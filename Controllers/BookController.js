//@desc get all available books
//@route GET /api/books
//@access Public
const Book= require("../models/bookModel");
const asyncHandler = require("express-async-handler");
const getBooks =asyncHandler(async (req, res) => {
  const books = await Book.find({});
  res.status(200).json(books);
});

//@desc get book with id
//@route GET /api/books/:id
//@access Public

const getBook = asyncHandler(async(req, res) => {
  const book = await Book.findById(req.params.id);
  if(!book) {
    res.status(404);
    throw new Error("Book not found");
  }

    res.status(200).json(book);
  });

//@desc Add a new book
//@route POST /api/books
//@access Public

const addBook = asyncHandler(async(req, res) => {
    console.log("the request body is ", req.body);
    const { title, author, genre, condition, ownerId, location } = req.body;
    if(!title || !author || !genre || !condition || !ownerId || !location) {
      res.status(400);
      throw new Error("Please fill in all fields");
    }
    const book = await Book.create({
      title,
      author,
      genre,
      condition,
      ownerId,
      location
    });
    res.status(201).json(book);
  });

//@desc update book details
//@route PUT /api/books/:id
//@access Public

const updateBook = asyncHandler(async(req, res) => {
  const book = await Book.findById(req.params.id);
  if(!book) {
    res.status(404);
    throw new Error("Book not found");
  }
  const updatedBook = await Book.findByIdAndUpdate
  (req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json(updatedBook);
  });

//@desc Delete a book
//@route DELETE /api/books/:id
//@access Public

const deleteBook = asyncHandler(async(req, res) => {
  const book = await Book.findById(req.params.id);
  if(!book) {
    res.status(404);
    throw new Error("Book not found");
  }
  await book.deleteOne();
    res.status(200).json(book);
  });


 
module.exports = {getBooks, getBook, addBook, updateBook, deleteBook};

