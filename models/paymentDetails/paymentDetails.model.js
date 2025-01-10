const mongoose = require('mongoose');

// Define the schema
const bankDetailsSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        required: true,
        unique: true, // Account numbers should be unique
        
    },
    accountName: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    bankAddress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the model
const BankDetails = mongoose.model('bankDetail', bankDetailsSchema);

module.exports = BankDetails;
