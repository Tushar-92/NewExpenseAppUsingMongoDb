const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema ({
        
    paymentid: {type: String},

    orderid: {type: String},

    status: {type: String},

    usersofexpenseappId: {
        type: String,
        required: true
    }

})


const Order = mongoose.model("Order" , OrderSchema)
module.exports = Order;