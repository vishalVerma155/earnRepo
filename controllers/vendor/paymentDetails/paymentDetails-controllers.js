const BankDetails = require('../../../models/Vendor/paymentDetails/paymentDetails.model.js');


const registerBankDetails = async (req, res)=>{
try {
    const bankAccountDetails = req.body; // get details
    const {accountNumber} = req.body; // get account number

    if(!bankAccountDetails){
        return res.status(404).json({Message : "Data not found"});
    }

    const isBankAccountExisted = await BankDetails.findOne({accountNumber}); // check account is alredy saved or not

    if(isBankAccountExisted){
        return res.status(400).json({Message : "This bank account is already existed in database"});
    }

    const bankDetail = new BankDetails(bankAccountDetails); // create new bank details
    await bankDetail.save(); // save bank details in database

    if(!bankDetail){
        return res.status(400).json({Message : "Some issue in bank details saving in database"});
    }

    return res.status(200).json({Message : "Payment details have been saved.",  bankDetail}); // return response
} catch (error) {
    return res.status(400).json({Error : error.message});
}
}

// view all bank account

const getAllBankAccount =  async (req, res) => {
    try {
    const allAccounts = await BankDetails.find();
    return res.status(200).json({All_saved_bank_accounts : allAccounts});
    } catch (error) {
        return res.status(500).json({Error :error.message });
    }  
}

// get single bank account
const getSingleBankAccount = async (req, res) =>{
try {
    const {accountNumber} = req.body; // get account number
    if(!accountNumber || accountNumber.trim() === ""){
        return res.status(400).json({Message : " Please enter account number"}); // if account number not found in body
    }
    const isBankAccountExisted = await BankDetails.findOne({accountNumber}); // find bank account in database
    if(!isBankAccountExisted){
        return res.status(402).json({Message : "Bank account is not registered."}) 
    }

    return res.status(200).json({Message : "Successfully found bank account", bank_details : isBankAccountExisted}); // return response
} catch (error) {
    return res.status(400).json({Error : error.message});
}
}

// delete bank account
const deleteBankAccount = async (req, res) =>{
    const accountId = req.params.accountId; // get account details id

    if(!accountId){
        return res.status(404).json({Message : "Do not found account id"}); // if account id not found
    }

    const bankAccount = await BankDetails.findByIdAndDelete(accountId, {accountNumber : 1, accountName : 1, bankName : 1}); // find and delete account

    if(!bankAccount){
        return res.status(404).json({Message : "Do not found bank account"}); // if bank account not found
    }

    return res.status(200).json({Message : "Bank account sucessfully deleted", bankAccount});
}

// update bank account

const updateAccountDetails = async (req, res) =>{
    const accountDetails = req.body; // get data
    const accountId = req.params.accountId; // get account id that wants to update

    if(!accountDetails ){
        return res.status(400).json({Message : "Account details not found"}); // if account details not found
    }

    if(!accountId){
        return res.status(404).json({Message  : "Account id not found."}); // if account id not found
    }

    const updatedAccount = await BankDetails.findByIdAndUpdate(accountId, accountDetails, {new : true}); //find and update account details

    if(!updatedAccount){
        return res.status(404).json({Message : "Account not found"});
    }

    return res.status(200).json({Message : "Bank details has been updated", updatedAccount});

}


module.exports = {registerBankDetails, getAllBankAccount, getSingleBankAccount, deleteBankAccount, updateAccountDetails};