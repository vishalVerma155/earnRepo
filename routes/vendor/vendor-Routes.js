const express = require('express');
const verifyJWT = require('../../middleware/authMIddleware.js');
const {registerVendor,allVendorsList, loginVendor,changeVendorPaswword, logoutVendor,deleteVendorProfile, getVendorProfile} = require('../../controllers/vendor/vendor-controllers.js')
const {upload, createLink, getLinkDetails, updateLinkDetails, deleteCreateLink} = require('../../controllers/vendor/products/link/createLink.controller.js');
const { registerQueries, viewQueris, viewSingleQuery, editQuery, deleteQuery} = require('../../controllers/vendor/contectAdmin/contectAdmin.controllers.js')


const router = express.Router();

// vendor register router
router.post("/registerVendor",registerVendor);

// login vendors
router.post("/loginVendor", loginVendor);

// get vendor profile details
router.get("/getVendorProfile",verifyJWT, getVendorProfile);

// delete vendor account
router.delete("/deleteVendorAccount", verifyJWT, deleteVendorProfile);

// change password of Vendor
router.post("/changeVendorPassword", verifyJWT, changeVendorPaswword);

// logout vendor
router.post("/logoutVendor", verifyJWT, logoutVendor);

// all vendors list
router.get("/allVendorsList", verifyJWT, allVendorsList);

// create link
router.post("/createLink",verifyJWT, upload.single("featureImage"), createLink);

// get create link details
router.get("/getCreateLink/:linkId",verifyJWT, getLinkDetails);

// upated createlink details
router.post("/updateCreateLink/:linkId",verifyJWT, upload.single("featureImage"), updateLinkDetails);

// delete create link 
router.delete("/deletecreateLink/:linkId",verifyJWT, deleteCreateLink);

// contect to admin or queries register
router.post("/registerContectToAdmin", verifyJWT, upload.single("attachment"), registerQueries);

// view all queries
router.get("/getAllQueries", verifyJWT, viewQueris);

// view particular query
router.get("/getQuery/:queryId", verifyJWT, viewSingleQuery);

// update or edit query
router.post("/editQuery/:queryId", verifyJWT,upload.single("attachment"), editQuery);

// delete query
router.delete("/deleteQuery/:queryId", verifyJWT, deleteQuery);

module.exports = router;