const express=require("express");
const router=express.Router();
const { approveRequest, reject} = require('../Controllers/RequestController');
const validateTokenHandler=require("../middleware/validateTokenHandler");
    router.route('/approve').put(validateTokenHandler,approveRequest);
router.route('/reject').put(validateTokenHandler,reject);
module.exports=router;