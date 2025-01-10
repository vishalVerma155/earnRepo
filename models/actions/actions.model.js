const mongoose = require('mongoose');

const actionsSchema = new mongoose.Schema({
    actions : {
        type : Number,
        required : true,
        default : 0
    }
}, {timestamps : true});

const Actions = mongoose.model("Action", actionsSchema);

module.exports = Actions;