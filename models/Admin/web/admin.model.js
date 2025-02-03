const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        minlength: [2, "First name must be at least 2 characters"],
        maxlength: [50, "First name must be at most 50 characters"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        minlength: [2, "Last name must be at least 2 characters"],
        maxlength: [50, "Last name must be at most 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email"]
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        match: [
            /^\+?[1-9]\d{9,14}$/,
            "Invalid phone number format. Please use E.164 format, e.g., +1234567890."
          ]
    },
    userName: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [30, "Username must be at most 30 characters"]
    },
    country: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    }
}, { timestamps: true });


const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
