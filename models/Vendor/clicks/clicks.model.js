const mongoose = require('mongoose');

const clicksSchema = new mongoose.Schema({
    clicks : {
        type : Number,
        required : true,
        default : 0
    }
}, {timestamps : true});

const Clicks = mongoose.model("Click", clicksSchema);

module.exports = Clicks;