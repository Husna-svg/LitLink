const express=require("express");
const router=express.Router();
const { getBooks, getBook, addBook,reqBook,deleteBook ,viewRequests,approveRequest} = require('../Controllers/BookController');
const validateTokenHandler=require("../middleware/validateTokenHandler");
const upload=require("../middleware/upload");
router.route('/allBooks').get(validateTokenHandler , getBooks);
router.route('/').get(validateTokenHandler,viewRequests);
router.route('/create').post(validateTokenHandler
    , upload.fields([
    { name: "frontPage", maxCount: 1 },
    { name: "backPage", maxCount: 1 }
])
    ,addBook);
router.route('/request/:id').post(validateTokenHandler,reqBook);

router.route('/:id').get(validateTokenHandler,getBook).delete(validateTokenHandler, deleteBook).put(validateTokenHandler,approveRequest);

module.exports=router;


