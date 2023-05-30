const Razorpay = require('razorpay');
const Order = require('../models/orders');
const UsersOfExpenseApp = require('../models/users');
const userController = require('./user');


async function purchasepremium(req , res) {
    
        let rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        
        const amount = 2500;
        const currency = "INR";
    
        rzp.orders.create({amount, currency}, async(err, order)=>{
                  
                if(!err){

                    const orderDetails = new Order({
                        orderid: order.id,
                        status: "Pending",
                        usersofexpenseappId: req.user.id
                    })
            
                    await orderDetails.save();
                    console.log('Status is Pending');
                    res.status(201).json(order);
                }
                else {
                    res.send(err);
                }
                    
                }
            )
}


        
async function updateTransactionStatus(req, res) {
    try {

        const userId = req.user.id; //This will be used to find user from User table so that uske 'ispremiumuser' field ko update kar sake.
        const {payment_id, order_id} = req.body;
        // console.log("This is your payment_id"+ " " + payment_id); //For Self Analysis
        // console.log("This is your order_id"+ " " + order_id); //For Self Analysis

        /* Now Updating the 'status' property and 'paymentid' of the order found above in the Order Table */
        const promise1 = Order.findOneAndUpdate(
            {orderid : order_id}, //--> Filter
            {status : 'SUCCESSFUL' , paymentid : payment_id}, //--> Updates
            { new: true } //--> This will return the new i.e updated document
        );

              
        /* Let's also update the 'ispremiumuser' field of the Users Table since now his payment is successfull */
        const promise2 =  UsersOfExpenseApp.findOneAndUpdate(
            {_id: userId}, //--> Filter
            { ispremiumuser: true }, //--> Updates
            { new: true } //--> This will return the new i.e updated document
        ); 
       

        Promise.all([promise1, promise2]).then(()=> {
            return res.status(202).json({sucess: true, message: "Transaction Successful", token: userController.generateAccessToken(userId,undefined , true) });
        }).catch((error ) => {
            throw new Error(error)
        })

        
                
    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Sometghing went wrong' });

    }
}

module.exports = {
    purchasepremium ,
    updateTransactionStatus
}

