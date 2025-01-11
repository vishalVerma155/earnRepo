const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({

    programName : {
        type : String,
        required : true
    },
    // adminCommission :{
    //     type : String,
    //     required : true
    // }
    commisionType: {
        type : String,
        enum : ['percentage', 'fixed'],
        required : true
    },
    commisionForSale : {
        type : Number,
    },
    saleStatus : {
        type : String,
        enum : ['enable', 'disable'],
        required : true
    },
    vendorComment : {
        type : String,
    },
    clickAllow : {
        type : String,
        enum : ['allow multi clicks', 'allow single click'],
        required : true
    },
    numberOfClicks : {
        type : Number,
        required : true
    },
    amountPerClick : {
        type : Number,
        required : true
    },
    clickStatus : {
        type : String,
        enum : ['enable', 'disable'],
        required : true
    }
}, {timestamps : true});

const Program = mongoose.model("program", programSchema);
module.exports = Program;