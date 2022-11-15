const express = require("express");
const router = express.Router();
const UserController = require('../controllers/users');
const authn = require('../middleware/check-auth')
const authr = require('../middleware/checkAuthr')
const validation = require('../validation/validate')

router.post("/signup", authn, authr.isAdmin, validation.signup, UserController.user_signup);
router.post("/login", validation.loging, UserController.user_login);
router.post("/reLogin", UserController.userRefreshToken)
router.get("/logOut", UserController.logOut)
router.delete("/:Id", authn, authr.isAdmin, validation._Id, UserController.user_delete);
router.patch("/:Id", authn, authr.isAdmin, validation._Id, validation.signupUpdate, UserController.user_update);
router.get("/:userRole", authn, authr.isAdmin, validation.role, UserController.user_getUsersByRoles);
router.get("/detail/:Id", 
// authn,
//  validation._Id,
  UserController.userDetial);
router.get("/", authn, authr.isAdmin, validation.search, UserController.user_get);
module.exports = router;
 