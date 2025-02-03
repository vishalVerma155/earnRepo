const Admin = require('../../models/Admin/web/admin.model.js');
const generateJWT = require('../../utils/jwt.js');
const {hashPassword, comparePassword} = require('../../utils/bcrypt.js')


// admin register controllers
const registerAdmin = async (req, res)=>{

    const {firstName,email,phoneNumber,userName,password, lastName} = req.body;

    const isAdminExisted = await Admin.findOne({role : "admin"});
    if(isAdminExisted){
        return res.status(401).json({Message : "Admin is already existed. There can be only one admin"})
    }

    // check blank fields
     const isBlank = [firstName,email,phoneNumber,userName,password].some(fields => fields.trim() === "");

     if(isBlank){
        return res.status(401).json({Message : "All fields are compulsary"});
     }


     const hashedPassword = await hashPassword(password);

     // create admin
     const newUser = new Admin({
        firstName,
        lastName,
        email,
        phoneNumber,
        userName,
        password: hashedPassword
     })

     // save admin
     await newUser.save();

     const user = await Admin.findOne({$or : [{ userName }, { email }]});

     if(!user){
        return res.status(404).json({Message : "Something wen wrong. Admin not saved."});
     }


     // generate access token
     const accessToken = generateJWT({
      _id : user._id,
      email : user.email,
      userName : user.userName
  });

     res.cookie("AccessToken", accessToken);

     // return response
     res.status(200).json({Message : "Admin has been  sucessfully register.", Admin : user});

};

// login Admin

const loginAdmin = async (req, res)=>{

   const {userName,password} = req.body;

   // check blank fields
    const isBlank = [userName,password].some(fields => fields.trim() === "");

    if(isBlank){
       return res.status(401).json({Message : "All fields are compulsary"});
    }

    // check admin is existed
    const user = await Admin.findOne({$or : [{userName}, {email : userName}]});

    if(!user){
       return res.status(401).json({Message : "Admin is not existed."});
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
    res.status(200).json({Message : "Admin has been  sucessfully Loged in.", Admin : user});

};



// get Admin profile details
const getAdminProfile = async (req, res)=>{
   const userId = req.user._id; // take admin id from request
   const admin = await Admin.findById(userId, {password : 0});
   return res.status(200).json({admin}); // return response
}

// // delete Admin profile

const deleteAdminProfile =  async (req, res)=>{
   const userId = req.user._id; // get admin id
   const {password} = req.body;
   const user = await Admin.findById(userId); // find and delete admin

   if(!user){
       return res.status(404).json({Message : "User not found"});
   }

   const isPasswordCorrect = await comparePassword(password, user.password);

   if(!isPasswordCorrect){
    return res.status(402).json({Message : "Wrong password"});
   }

    await Admin.findByIdAndDelete(user._id); // find and delete user

   res.clearCookie("AccessToken"); // clear cookies for logout
   return res.status(200).json({Message : "Admin has been sucessfully deleted"}); // return response
}

// change Admin password

const changeAdminPaswword = async (req, res)=>{
   const {currentPassword, newPassword} = req.body; // take details

   if(currentPassword.trim() === "" || newPassword.trim() === ""){
      return res.status(401).json({Message : "Please enter all fields"});
   }

   const user = await Admin.findById(req.user._id);

   // compare password
  const isPasswordCorrect = await comparePassword(currentPassword, user.password);

   if(!isPasswordCorrect){
      return res.status(401).json({Message : "password is not matched"});
   }
   
   const newHashedPassword = await hashPassword(newPassword);
   user.password = newHashedPassword; 
   await user.save(); // save password

   return res.status(200).json({Message : "Password has been chenged"});
}

// logout Admin
const logoutAdmin = (req, res) => {
   res.clearCookie("AccessToken"); // clear cookies for logout
   return res.status(200).json({
      Message : "Admin logedout sucessfully"
   })
}

// get delete any vendor or affiliate PENDING

// const deleteUser =  async(req, res) =>{
//    const {userId} = req.params;
   
//    const user = await Admin.findByIdAndDelete(userId);

//    if(!user){
//       return res.status(404).json({Message : "User not found"});
//    }

//    return res.status(200).json({Message : "User has been deleted"});

// }


module.exports = {
     registerAdmin,
    getAdminProfile,
    deleteAdminProfile,
    changeAdminPaswword,
    loginAdmin,
    logoutAdmin
}