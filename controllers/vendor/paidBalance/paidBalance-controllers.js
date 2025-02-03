const PaidBalance = require('../../../models/Vendor/paidBalance/paidBalance.model.js');

const getPaidBalance =async (req, res)=>{
    const paidBalance = await PaidBalance.find();
    return res.status(200).json({Paid_Balance : paidBalance});
}

module.exports = {getPaidBalance};