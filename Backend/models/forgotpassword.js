const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ForgotpasswordSchema = new Schema ({
    active: {type: Boolean},
    expiresby: {type: Date}
})

const Forgotpassword = mongoose.model("Forgotpassword" , ForgotpasswordSchema);
module.exports = Forgotpassword;