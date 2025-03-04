const express=require("express");
const router=express.Router();
const { getBooks, getBook, addBook, updateBook,deleteBook } = require('../Controllers/BookController');

router.route('/').get(getBooks).post(addBook);

router.route('/:id').get(getBook).put(updateBook).delete(deleteBook);

module.exports=router;
