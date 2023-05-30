
const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense');
const userAuthentication = require('../middleware/auth');


router.get('/getexpense', userAuthentication.authenticate , expenseController.getExpense);

router.post('/addexpense', userAuthentication.authenticate ,expenseController.addExpense);

router.delete('/deleteexpense/:id' , userAuthentication.authenticate , expenseController.deleteExpense);

router.get('/showLeaderBoard', userAuthentication.authenticate ,expenseController.getLeaderBoard);

module.exports = router;
