
const UsersOfExpenseApp = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//Through this function we are are going to check if string is empty or null
function isStringValid (str) {
    if(str === null || str.trim() === "") {
        return true;
    } else {
        return false;
    }
} 



async function userSignUp(req, res) {
    
    try {

        let incomingName =  req.body.username;
        let incomingEmail =  req.body.email;
        let incomingPassword =  req.body.password;

        
        //Now lets validate that incoming data coming from the form is valid i.e not null or empty
        if(isStringValid(incomingName) || isStringValid(incomingEmail) || isStringValid(incomingPassword)) {
            return res.status(400).json({error : 'Bad parameters. Something is missing'});
        }

        const saltrounds = 10;

        bcrypt.hash(incomingPassword, saltrounds, async(error , hash) => {
            
            console.log(error);
            
            const newUser = new UsersOfExpenseApp({
                Name: incomingName,
                Email: incomingEmail,
                Password: hash
            });

            await newUser.save();
           
            console.log('User Created');
            res.status(201).json({message: 'Successfully Created New User'});
        
        })

    } catch(err) {
        console.log(err);
        res.status(500).json({message: err.message});
    } 
}


function generateAccessToken (id, name, ispremiumuser) {
    return jwt.sign({ userId: id , Name: name , ispremiumuser } , 'secretkey');
}


async function userLogin(req, res) {

    try {
        
        let incomingEmail =  req.body.email;
        let incomingPassword =  req.body.password;
        
        //Now lets validate that incoming data coming from the form is valid i.e not null or empty
        if(isStringValid(incomingEmail) || isStringValid(incomingPassword)) {
            return res.status(400).json({message : 'Email ID or Password is missing'});
        }

        let user = await UsersOfExpenseApp.find({Email: req.body.email});
        
        if(user.length > 0) {

            bcrypt.compare(incomingPassword , user[0].Password , (err, result) => {
                if(err) {
                    throw new Error('Something went wrong');
                }
                
                if(result === true) {
                    // console.log(user[0].id); // Just for self analysis
                    // console.log(user[0]._id); // Just for self analysis
                    return res.status(200).json({message: 'User logged in successfully' , token: generateAccessToken(user[0].id, user[0].Name , user[0].ispremiumuser)});

                } else {
                    return res.status(401).json({message: 'Password is Incorrect'});
                }
            })
            
            } else {
                return res.status(404).json({message: 'User Does Not Exists'});
            }
        
    
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `${err.message}`});
    }

}


module.exports = {
    userSignUp,
    userLogin,
    generateAccessToken
    
}