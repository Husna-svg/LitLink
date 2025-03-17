const express=require("express");
const router=express.Router();
const {registerUser,loginUser,getUserProfile}=require("../Controllers/UserController");
const validateTokenHandler=require("../middleware/validateTokenHandler");

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile",validateTokenHandler, getUserProfile);
module.exports=router;
/*const { addUser, authUser , getUser, updateUser, deleteUser} = require('../Controllers/UserController');

router.route('/').post(addUser).post(authUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports=router;
*/