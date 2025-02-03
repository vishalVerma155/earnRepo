const express = require('express');
const verifyJWT = require('../../middleware/authMIddleware.js');
const {registerAdmin, loginAdmin, getAdminProfile, deleteAdminProfile,changeAdminPaswword, logoutAdmin } = require('../../controllers/admin/admin-controllers.js');


const router = express.Router();

// admin register router
router.post("/registerAdmin",registerAdmin);

// login admin
router.post("/loginAdmin", loginAdmin);

// get admin profile details
router.get("/getAdminProfile",verifyJWT, getAdminProfile);

// delete admin account
router.delete("/deleteAdminAccount", verifyJWT, deleteAdminProfile);

// change password of admin
router.post("/changeAdminPassword", verifyJWT, changeAdminPaswword);

// logout admin
router.post("/logoutAdmin", verifyJWT, logoutAdmin);

// delete any user

// router.delete("/deleteAnyUser/:userId", verifyJWT, deleteUser);



module.exports = router;