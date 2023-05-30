
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authenticatemiddleware = require('../middleware/auth');
const expenseController = require('../controllers/expense');


router.post('/signup' , userController.userSignUp);  

router.post('/login' , userController.userLogin);

router.get('/download', authenticatemiddleware.authenticate, expenseController.downloadExpenses);

router.get('/showPreviouslyDownloadedUrls' , authenticatemiddleware.authenticate, expenseController.previouslyDownloadedFileURL);



module.exports = router;