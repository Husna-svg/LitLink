const express=require("express");
const router=express.Router();
const { getBooks, getBook, addBook,reqBook,deleteBook ,viewRequests,approveRequest,mysent} = require('../Controllers/BookController');
const validateTokenHandler=require("../middleware/validateTokenHandler");
const upload=require("../middleware/upload");
router.route('/allBooks').get(validateTokenHandler , getBooks);
router.route('/requests').get(validateTokenHandler,viewRequests);
router.route('/create').post(validateTokenHandler
    , upload.fields([
    { name: "frontPage", maxCount: 1 },
    { name: "backPage", maxCount: 1 }
])
    ,addBook);
router.route('/request').post(validateTokenHandler,reqBook);
router.route('/mysent').get(validateTokenHandler,mysent);
router.route('/:id').get(validateTokenHandler,getBook);
router.route('/approve').put(validateTokenHandler,approveRequest);
router.route('/').delete(validateTokenHandler,deleteBook);

module.exports=router;


