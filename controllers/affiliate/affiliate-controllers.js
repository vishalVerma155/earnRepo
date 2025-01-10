const User = require('../../models/user-model.js');
const generateJWT = require('../../utils/jwt.js');
const {comparePassword , hashPassword} = require('../../utils/bcrypt.js');


// // affiliate register controllers
const registerAffiliate = async (req, res)=>{

    const {firstName,email,phoneNumber,role,userName,password, lastName} = req.body;

    // check blank fields
     const isBlank = [firstName,email,phoneNumber,role,userName,password].some(fields => fields.trim() === "");

     if(isBlank){
        return res.status(401).json({Message : "All fields are compulsary"});
     }

     // check if affiliate is already existed
     const isUserExisted = await User.findOne( {$or: [{ userName }, { email }]});

     if(isUserExisted){
        return res.status(401).json({Message : "User is already existed. Please login or choose other user name"});
     }

     const hashedPassword = await hashPassword(password);
     // create affiliate
     const newUser = new User({
        firstName,
        lastName,
        email,
        phoneNumber,
        role,
        userName,
        password: hashedPassword
     })

     // save affiliate
     await newUser.save();

     const user = await User.findOne({$or : [{ userName }, { email }]});

     if(!user){
        return res.status(404).json({Message : "User not found. There is something problem in user data saving"});
     }


     // generate access token
     const accessToken = generateJWT({
      _id : user._id,
      email : user.email,
      userName : user.userName
  });

     res.cookie("AccessToken", accessToken);

     // return response
     res.status(200).json({Message : "Affiliate has been  sucessfully register.", affiliate : user});

};

// login affiliate

const loginAffiliate = async (req, res)=>{

   const {userName,password} = req.body;

   // check blank fields
    const isBlank = [userName,password].some(fields => fields.trim() === "");

    if(isBlank){
       return res.status(401).json({Message : "All fields are compulsary"});
    }

    // check if affiliate is existed
    const user = await User.findOne( {userName});

    if(!user){
       return res.status(401).json({Message : "User is not existed."});
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
    res.status(200).json({Message : "Affiliate has been  sucessfully Loged in.", affiliate : user});

};



// get affiliate profile details
const getAffiliateProfile = async (req, res)=>{
   const userId = req.user._id; // take affiliate id from request
   const affiliate = await User.findById(userId, {password : 0});
   console.log(affiliate);
   return res.status(200).json({affiliate}); // return response
}

// delete affiliate profile

const deleteAffiliateProfile =  async (req, res)=>{
   const userId = req.user._id; // get user id

   const {password} = req.body;
   
   const user = await User.findById(userId); // find and delete user
   if(!user){
       return res.status(404).json({Message : "User not found"});
   }

   const isPasswordCorrect = await comparePassword(password, user.password);
   if(!isPasswordCorrect){
    return res.status(402).json({Message : "Wrong password"});
   }

    await User.findByIdAndDelete(user._id); // find and delete user
   res.clearCookie("AccessToken"); // clear cookies for logout
   return res.status(200).json({Message : "Affiliate has been sucessfully deleted"}); // return response
}

// change affiliate password

const changeAffiliatePaswword = async (req, res)=>{
   const {currentPassword, newPassword} = req.body; // take details

   if(currentPassword.trim() === "" || newPassword.trim() === ""){
      return res.status(401).json({Message : "Please enter all fields"});
   }

   const user = await User.findById(req.user._id);
   console.log(user);

   // compare password
  const isPasswordCorrect = await comparePassword(currentPassword, user.password);

   if(!isPasswordCorrect){
      return res.status(401).json({Message : "password is not matched"});
   }

   const newHashedPassword = await hashPassword(newPassword); // hash new password
   user.password = newHashedPassword;

   await user.save(); // save user password

   return res.status(200).json({Message : "Password has been chenged"});
}

// logout affiliate
const logoutAffiliate = (req, res) => {
   res.clearCookie("AccessToken"); // clear cookies for logout
   return res.status(200).json({
      Message : "Affliate logout sucessfully"
   })
}

// get all affiliate

const allAffiliateList = async (req, res) =>{
   const list = await User.find({role : "affiliate"});
   res.status(200).json({affiliateList : list});
}

module.exports = {
    registerAffiliate,
    getAffiliateProfile,
    deleteAffiliateProfile,
    changeAffiliatePaswword,
    loginAffiliate,
    logoutAffiliate,
    allAffiliateList
}