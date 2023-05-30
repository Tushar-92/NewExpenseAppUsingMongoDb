
const jwt = require('jsonwebtoken');
const UsersOfExpenseApp = require('../models/users'); 

function authenticate (req, res, next) {

    try {
        const token = req.header('Authorization');
        console.log(token); //just for self analysis
        const user = jwt.verify(token, 'secretkey'); //jo waha se encrypt kiye the wahi yaha pe decrypt kar rahe. Yaha se hume ek user object mil jaega jisme ki userId bhi hai and Name bhi i.e jo jo pass kiye the token banane k liye :)
        console.log('userID is -----> ', user.userId); //just for self analysis. tc ki header me tum userId k nam se is user ki id beheje hai to plz user.id kar k mat dhundne lagna :)
        
        UsersOfExpenseApp.findById(user.userId)
        .then(user => {
            req.user = user; //UsersOfExpenseApp wale table me se jo user row mila jisme id match ki ab use req me user object ki tarah bhej rahe hai. 
            next();
        })

      } catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
    
      }

}

module.exports = {
    authenticate
}