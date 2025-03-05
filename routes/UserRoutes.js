const express=require("express");
const router=express.Router();
const { addUser, authUser , getUser, updateUser, deleteUser} = require('../Controllers/UserController');

router.route('/').post(addUser).post(authUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports=router;
