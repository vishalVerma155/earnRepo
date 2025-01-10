const mongoose = require('mongoose');

const contectAdminSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    domainName: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true  
    },
    body: {
        type: String,
        required: true
    },
    attachment: {
        type: String, // Path to the file or URL
        required: false
    }
}, { timestamps: true }); 

const Queries = mongoose.model('contectAdmin', contectAdminSchema);

module.exports = Queries;
