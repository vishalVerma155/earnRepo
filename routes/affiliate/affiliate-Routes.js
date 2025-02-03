
const express = require('express');
const verifyJWT = require('../../middleware/authMIddleware.js');
const {registerAffiliate,logoutAffiliate,allAffiliateList,generateAffiliateLink, getAffiliateProfile, deleteAffiliateProfile , changeAffiliatePaswword, loginAffiliate} = require('../../controllers/affiliate/affiliate-controllers.js')

const router = express.Router();

// affiliate register router
router.post("/registerAffiliate",registerAffiliate);

// login affiliate
router.post("/loginAffiliate", loginAffiliate);

// get affiliate profile details
router.get("/getAffiliateProfile",verifyJWT, getAffiliateProfile);

// delete affiliate account
router.delete("/deleteAffiliateAccount", verifyJWT, deleteAffiliateProfile);

// change password of affiliate
router.post("/changeAffiliatePassword", verifyJWT, changeAffiliatePaswword);

// logout affiliate
router.post("/logoutAffiliate", verifyJWT, logoutAffiliate);

// all affiliate list
router.get("/allAffiliateList", verifyJWT, allAffiliateList);

// generate affiliate link
router.post("/generateAffiliateLink", generateAffiliateLink);




module.exports = router;