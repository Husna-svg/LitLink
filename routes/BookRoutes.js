const express=require("express");
const router=express.Router();
router.route('/').get((req,res)=>{
  res.status(200).json({message : `get all available books`});
});

router.route('/:id').get((req,res)=>{
    res.status(200).json({message : `get book with id   ${req.params.id}`});
  });

  router.route('/').post((req,res)=>{
    res.status(200).json({message : `Add a new book (Only authenticated users)`});
  });

  router.route('/:id').put((req,res)=>{
    res.status(200).json({message : `update book details (Only owner) for book id ${req.params.id}`});
  });

  router.route('/:id').delete((req,res)=>{
    res.status(200).json({message : `Delete a book (Only owner) for book id ${req.params.id}`});
  });
module.exports=router;
