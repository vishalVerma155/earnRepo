const Vendor = require('../../models/Vendor/web/vendor.model.js')
const generateJWT = require('../../utils/jwt.js');
const {hashPassword, comparePassword} = require('../../utils/bcrypt.js')


// affiliate register controllers
const registerVendor = async (req, res)=>{

    const {firstName,email,phoneNumber,role,userName,password, lastName,storeName} = req.body;

    // check blank fields
     const isBlank = [firstName,email,phoneNumber,role,userName,password, storeName].some(fields => fields.trim() === "");

     if(isBlank){
        return res.status(401).json({Message : "All fields are compulsary"});
     }

     // check if affiliate is already existed
     const isUserExisted = await Vendor.findOne( {$or: [{ userName }, { email }]});

     if(isUserExisted){
        return res.status(401).json({Message : "User is already existed. Please login or choose other user name"});
     }


     const hashedPassword = await hashPassword(password);
     // create Vendor
     const newUser = new Vendor({
        firstName,
        lastName,
        email,
        phoneNumber,
        role,
        userName,
        password: hashedPassword, 
        storeName
     })

     // save affiliate
     await newUser.save();

     const user = await Vendor.findOne({$or : [{ userName }, { email }]});

     if(!user){
        return res.status(404).json({Message : "Vendor not found. There is something problem in user data saving"});
     }


     // generate access token
     const accessToken = generateJWT({
             _id : user._id,
             email : user.email,
             userName : user.userName
         });

     res.cookie("AccessToken", accessToken);

     // return response
     res.status(200).json({Message : "Vendor has been  sucessfully register.", Vendor : user});

};

// login Vendor

const loginVendor = async (req, res)=>{

   const {userName,email, password} = req.body;

   // check blank fields
    const isBlank = [userName,password].some(fields => fields.trim() === "");

    if(isBlank){
       return res.status(401).json({Message : "All fields are compulsary"});
    }

    // check if Vendor is existed
    const user = await Vendor.findOne( {$or : [{userName}, {email : userName}]});

    if(!user){
       return res.status(401).json({Message : "Vendor is not existed."});
    }

    // compare password
    const isPasswordCorrect = await comparePassword(password, user.password);

    if(!isPasswordCorrect){
      return res.status(401).json({Message : "Invalid password"});
    }

   

    // generate jwt token
    const accessToken = generateJWT({
            _id : user._id,
            email : user.email,
            userName : user.userName
        });
    
    res.cookie("AccessToken", accessToken);

    // return response
    res.status(200).json({Message : "Vendor has been  sucessfully Loged in.", Vendor : user});

};



// get Vendor profile details
const getVendorProfile = async (req, res)=>{
   const userId = req.user._id; // take affiliate id from request
   const vendor = await Vendor.findById(userId, {password : 0});
   return res.status(200).json({vendor}); // return response
}

// // delete vendor profile

const deleteVendorProfile =  async (req, res)=>{
   const userId = req.user._id; // get user id
   const {password} = req.body;
   const user = await Vendor.findById(userId); // find user
   if(!user){
       return res.status(404).json({Message : "User not found"});
   }

   const isPasswordCorrect = await comparePassword(password, user.password);
   if(!isPasswordCorrect){
    return res.status(402).json({Message : "Wrong password"});
   }

    await Vendor.findByIdAndDelete(user._id); // find and delete user

   res.clearCookie("AccessToken"); // clear cookies for logout
   return res.status(200).json({Message : "Vendor has been sucessfully deleted"}); // return response
}

// change Vendor password

const changeVendorPaswword = async (req, res)=>{
   const {currentPassword, newPassword} = req.body; // take details

   if(currentPassword.trim() === "" || newPassword.trim() === ""){
      return res.status(401).json({Message : "Please enter all fields"});
   }

   const user = await Vendor.findById(req.user._id);
  

   // compare password
  const isPasswordCorrect = await comparePassword(currentPassword, user.password);

   if(!isPasswordCorrect){
      return res.status(401).json({Message : "password is not matched"});
   }

   const newHashedPassword = await hashPassword(newPassword);
   user.password = newHashedPassword;
   await user.save();

   return res.status(200).json({Message : "Password has been chenged"});
}

// logout affiliate
const logoutVendor = (req, res) => {
   res.clearCookie("AccessToken"); // clear cookies for logout
   return res.status(200).json({
      Message : "Vendor logedout sucessfully"
   })
}

// get all vendors

const allVendorsList = async (req, res) =>{
   const list = await Vendor.find({role : "vendor"});
   res.status(200).json({vendorList : list});
}

module.exports = {
    registerVendor,
    getVendorProfile,
    deleteVendorProfile,
    changeVendorPaswword,
    loginVendor,
    logoutVendor,
    allVendorsList
}