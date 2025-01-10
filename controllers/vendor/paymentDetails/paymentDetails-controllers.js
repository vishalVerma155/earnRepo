const BankDetails = require('../../../models/paymentDetails/paymentDetails.model.js');


const registerBankDetails = async (req, res)=>{
    const bankAccountDetails = req.body;
    const {accountNumber} = req.body;

    if(!bankAccountDetails){
        return res.status(404).json({Message : "Data not found"});
    }

    const isBankAccountExisted = await BankDetails.findOne({accountNumber});

    if(isBankAccountExisted){
        return res.status(400).json({Message : "This bank account is already existed in database"});
    }

    const bankDetail = new BankDetails(bankAccountDetails);
    await bankDetail.save();

    if(!bankDetail){
        return res.status(400).json({Message : "Some issue in bank details saving in database"});
    }

    return res.status(200).json({Message : "Payment details have been saved.",  bankDetail});
}

module.exports = {registerBankDetails};