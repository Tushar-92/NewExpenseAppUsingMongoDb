const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersOfExpenseAppSchema = new Schema ({

  Name: {
    type: String ,
    required: true
  },

  Email: {
    type: String ,
    required: true
  },

  Password: {
    type: String ,
    required: true
  },

  ispremiumuser: {
    type: Boolean
  }

});

const UsersOfExpenseApp = mongoose.model("UsersOfExpenseApp" , UsersOfExpenseAppSchema )
module.exports = UsersOfExpenseApp;
