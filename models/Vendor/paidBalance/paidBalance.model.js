const mongoose = require('mongoose');

const paidBalanceSchema = new mongoose.Schema({
    balance : {
        type : Number,
        required : true,
        default : 0
    }
}, {timestamps : true});

const PaidBalance = mongoose.model("paidBalance", paidBalanceSchema);

module.exports = PaidBalance;