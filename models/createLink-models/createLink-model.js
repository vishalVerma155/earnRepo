const mongoose = require('mongoose');

const createLinkSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    campaignTargetLink : {
        type : String,
        required : true, 
    },
    terms : {
        type : String,
        required : true  
    },
    categories : {
        type : String,
        required : true, 
    },
    image: {
        type : String,
        required : true, 
    },
    linkTitle : {
        type : String,
        required : true, 
    },
    afflowForAffiliate : {
        type : String,
        required : true,
        default : "all" 
    },
    status : {
        type : String,
        required : true,
        default : "draft"
    }
}, {timestamps : true});

const CreateLink = mongoose.model("createLink", createLinkSchema);

module.exports = CreateLink;