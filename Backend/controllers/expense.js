
const Expenses = require('../models/expenses');
const UsersOfExpenseApp = require('../models/users');
const Filesdownloaded = require('../models/FilesDownloaded');
const AWS = require('aws-sdk');


async function getExpense(req, res) {

    try {
        const result = await Expenses.find({usersofexpenseappId: req.user.id});
        // console.log(result);
        res.status(200).json(result);
     
    } catch (err) {
        console.log(err);
        res.status(500).json(err);        
    }
    
}


async function deleteExpense(req, res) {

    try {

        if(req.params.id == undefined || req.params.id.length === 0) {
            return res.status(400).json({message: 'id is invalid' , success: false});
        }
        
        await Expenses.deleteOne({ _id: req.params.id });
        console.log(`Expense id: ${req.params.id} is successfullty deleted from the record`);
        res.json({id: `${req.params.id} from expense table of user id: ${req.user.userId} is successfullty deleted from the record`});        
        
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}


async function addExpense(req, res) {
    
    try {
        
        const amount = req.body.Amount;
        const description = req.body.Description;
        const category = req.body.Category;
        const incomingUserId = req.user.id;
        const incomingUserName = req.user.Name;
        
        const newExpense = new Expenses({
            Amount: amount,
            Description: description,
            Category: category,
            usersofexpenseappId: incomingUserId,
            usersofexpenseappName: incomingUserName
        })

        const result = await newExpense.save();
        console.log('Expense Created');
        res.status(201).json(result);
        
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

}


function uploadToS3(data , filename) {

    const BUCKET_NAME = 'tusharexpensetracker';
    const IAM_USER_KEY = process.env.USER_KEY;
    const IAM_USER_SECRET = process.env.USER_SECRET;

    //lets create new instance of aws s3 bucket 
    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY ,
        secretAccessKey: IAM_USER_SECRET
    })

    let params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read' //this will make the file publicaly readable
    }

    return new Promise((resolve , reject) => {
        s3bucket.upload(params , (err , s3response) => {
            if(err) {
                console.log('Something went wrong' , err);
                reject(err);

            } else {
                console.log('success' , s3response);
                resolve(s3response.Location);
            }
        })
    })
        
}


async function downloadExpenses(req, res) {

    try {

        //First check whether the user is Premium user or not as this service is available only for the Premium User.
        if(!req.user.ispremiumuser){
            return res.status(401).json({ success: false, message: 'You are not an Premium User'});
        } 

        // Now lets get the expenses saved by this user in this app
        const expenses = await Expenses.find({usersofexpenseappId: req.user.id})
        // console.log(expenses); 
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user.id;
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileURL = await uploadToS3(stringifiedExpenses , filename);


        //lets also save this fileURL into our database table named FilesDownloaded, so that user can download his prevoisly downloaded files from old urls
        const savingUrlToDatabase = new Filesdownloaded ({
            URL: fileURL,
            usersofexpenseappId: req.user.id //or variabled named userId created above can also be used
        })
        
        await savingUrlToDatabase.save();
        
        res.status(200).json({ fileURL, success: true}); 
            
    } catch (err) {
        console.log(err);
        res.status(500).json({fileURL: '', success: false , err: err});
    }
        
}


async function previouslyDownloadedFileURL(req, res) {

    try {
        const result = await Filesdownloaded.find({ usersofexpenseappId: req.user.id});
        // console.log(result);
        res.status(200).json(result);
        
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

}


async function getLeaderBoard(req, res) {
    try{

        //Lets first find out the current user has purchased the premium membership or not.
        const isThisUserisPremiumUser = await UsersOfExpenseApp.find({_id: req.user.id , ispremiumuser: true});

        //If the current user have premium membership then we will show him the Leader Board.
        if(isThisUserisPremiumUser.length != 0) {

            const result = await Expenses.aggregate(
                
                [
                // Grouping pipeline
                {
                    $group:
                    {
                        _id: "$usersofexpenseappId",
                        Name: { "$first": "$usersofexpenseappName" } ,
                        Total_Expense: { $sum: "$Amount" }
                    } 
                } , 

                // Sorting pipeline
                { "$sort": { "Total_Expense": -1 } } 
            ])

            res.status(200).json(result);
    } else {
        res.status(200).json({Message: "You are not an Premium User"});
    }

    }catch(err) {
        console.log(err);
        res.status(500).json(err);     
    }
}




module.exports = {
    getExpense,
    deleteExpense,
    addExpense,
    downloadExpenses,
    previouslyDownloadedFileURL,
    getLeaderBoard

}