const express = require('express');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

const UsersOfExpenseApp = require('./models/users');
const Expenses = require('./models/expenses');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');
const FilesDownloaded = require('./models/FilesDownloaded');
const cors = require('cors');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());

const accessLogStream = fs.createWriteStream(path.join(__dirname , 'access.log') , {flags:'a'});
app.use(morgan('combined' , {stream: accessLogStream}));



//Connecting to Mongodb Atlas
mongoose
  .connect(
    'mongodb+srv://tsaerotab:uHq4l65gnsV14uYs@cluster0.vwgqiko.mongodb.net/ExpenseApp?retryWrites=true&w=majority'
  )
  .then(result => {
    console.log('Connected to Atlas');
    // console.log(result); //for self analysis tha
  })
  .catch(err => {
    console.log(err);
  });





const userRouter = require('./routes/user');
app.use('/user' , userRouter);

const expenseRouter = require('./routes/expense');
app.use('/expense' , expenseRouter);

const purchaseRoutes = require('./routes/purchase');
app.use('/purchase' , purchaseRoutes);

const resetpasswordRoutes = require('./routes/resetpassword');
app.use('/password' , resetpasswordRoutes);




//Connecting to Server
app.listen(3000, () => {
    console.log(`Server Started at port ${3000}`);
})







