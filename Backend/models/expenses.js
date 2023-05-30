const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExpensesSchema = new Schema ({
  
  Amount: {
    type: Number,
    required: true
  },

  Description: {
    type: String,
    required: true
  },

  Category: {
    type: String,
    required: true
  },

  usersofexpenseappId: {
    type: String,
    required: true
  },

  usersofexpenseappName: {
    type: String,
    required: true
  }



});

const Expenses = mongoose.model("Expenses" , ExpensesSchema);
module.exports = Expenses;