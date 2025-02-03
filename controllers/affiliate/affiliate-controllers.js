const Affiliate = require('../../models/Affiliate/web/affiliate.model.js');
const generateJWT = require('../../utils/jwt.js');
const { comparePassword, hashPassword } = require('../../utils/bcrypt.js');


// get affiliate id with url
// function getAffiliateIdFromURL() {
//    const urlParams = new URLSearchParams(window.location.search);
//    return urlParams.get("ref"); // 'ref' is the parameter name
// }




// // affiliate register controllers
const registerAffiliate = async (req, res) => {
   try {

      const totalCount = await Affiliate.countDocuments(); // get total count of register affiliate
      const affiliateId = `AF${totalCount + 1}`; // create affiliate id
      const referrerAffiliateId = req.query.aff_id; // get referrer affiliate id
      
      let referrerAff; // declair referrer affiliate

      if (referrerAffiliateId) {
         referrerAff = await Affiliate.findOne({ // find referrer affiliate
            affiliateId: referrerAffiliateId
         });
         if (!referrerAff) {
            return res.status(404).json({ Error: "  Refferrer Affiliate not found" });
         }
      }

      const {
         firstName,
         lastName,
         email,
         phoneNumber,
         userName,
         country,
         password
      } = req.body;

      // check blank fields
      const isBlank = [firstName, email, phoneNumber, userName, password, country].some(fields => fields.trim() === "");

      if (isBlank) {
         return res.status(401).json({ Message: "All fields are compulsary" });
      }

      // check if affiliate is already existed
      const isUserExisted = await Affiliate.findOne({ $or: [{ userName }, { email }] });

      if (isUserExisted) {
         return res.status(401).json({ Message: "User is already existed. Please login or choose other user name" });
      }

      const hashedPassword = await hashPassword(password);
      // create affiliate
      const newUser = new Affiliate({
         firstName,
         lastName,
         email,
         phoneNumber,
         userName,
         country,
         affiliateId,
         referrer: referrerAff? referrerAff._id : null,
         password: hashedPassword
      })

      if (referrerAff) {
         referrerAff.referredUsers.push(newUser._id);
         await referrerAff.save();
      }

      // save affiliate
      await newUser.save();

      const user = await Affiliate.findOne({ $or: [{ userName }, { email }] });

      if (!user) {
         return res.status(404).json({ Message: "User not found. There is something problem in user data saving" });
      }

      // return response
      res.status(200).json({ Message: "Affiliate has been  sucessfully register.", affiliate: user });
   } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
   }

};

// login affiliate

const loginAffiliate = async (req, res) => {

   const { userName, password } = req.body;

   // check blank fields
   const isBlank = [userName, password].some(fields => fields.trim() === "");

   if (isBlank) {
      return res.status(401).json({ Message: "All fields are compulsary" });
   }

   // check if affiliate is existed
   const user = await Affiliate.findOne({ $or: [{ userName }, { email: userName }] });

   if (!user) {
      return res.status(401).json({ Message: "User is not existed." });
   }

   // compare password
   const isPasswordCorrect = await comparePassword(password, user.password);

   if (!isPasswordCorrect) {
      return res.status(401).json({ Message: "Invalid password" });
   }

   const payload = {
      _id: user._id,
      email: user.email,
      userName: user.userName
   }

   // generate jwt token
   const accessToken = generateJWT(payload);

   res.cookie("AccessToken", accessToken);

   // return response
   res.status(200).json({ Message: "Affiliate has been  sucessfully Loged in.", affiliate: user });

};



// get affiliate profile details
const getAffiliateProfile = async (req, res) => {
   const userId = req.user._id; // take affiliate id from request

   const affiliate = await Affiliate.findById(userId, { password: 0 });

   return res.status(200).json({ affiliate }); // return response
}

// delete affiliate profile

const deleteAffiliateProfile = async (req, res) => {
   const userId = req.user._id; // get user id

   const { password } = req.body;

   const user = await Affiliate.findById(userId); // find and delete user
   if (!user) {
      return res.status(404).json({ Message: "User not found" });
   }

   const isPasswordCorrect = await comparePassword(password, user.password);
   if (!isPasswordCorrect) {
      return res.status(402).json({ Message: "Wrong password" });
   }

   await Affiliate.findByIdAndDelete(user._id); // find and delete user
   res.clearCookie("AccessToken"); // clear cookies for logout
   return res.status(200).json({ Message: "Affiliate has been sucessfully deleted" }); // return response
}

// change affiliate password

const changeAffiliatePaswword = async (req, res) => {
   const { currentPassword, newPassword } = req.body; // take details

   if (currentPassword.trim() === "" || newPassword.trim() === "") {
      return res.status(401).json({ Message: "Please enter all fields" });
   }

   const user = await Affiliate.findById(req.user._id);
   console.log(user);

   // compare password
   const isPasswordCorrect = await comparePassword(currentPassword, user.password);

   if (!isPasswordCorrect) {
      return res.status(401).json({ Message: "password is not matched" });
   }

   const newHashedPassword = await hashPassword(newPassword); // hash new password
   user.password = newHashedPassword;

   await user.save(); // save user password

   return res.status(200).json({ Message: "Password has been chenged" });
}

// logout affiliate
const logoutAffiliate = (req, res) => {
   res.clearCookie("AccessToken"); // clear cookies for logout
   return res.status(200).json({
      Message: "Affliate logout sucessfully"
   })
}

// get all affiliate

const allAffiliateList = async (req, res) => {
   const list = await Affiliate.find();
   res.status(200).json({ affiliateList: list });
}

// generate affiliate link
const generateAffiliateLink = (req, res) => {
   try {
      const { productUrl, affiliateId } = req.body;
      const url = new URL(productUrl);
      url.searchParams.append("aff_id", affiliateId);
      return res.status(200).json(url);
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
};

module.exports = {
   registerAffiliate,
   getAffiliateProfile,
   deleteAffiliateProfile,
   changeAffiliatePaswword,
   loginAffiliate,
   logoutAffiliate,
   allAffiliateList,
   generateAffiliateLink
}