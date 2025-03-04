//@desc get all available books
//@route GET /api/books
//@access Public
const asyncHandler = require("express-async-handler");
const getBooks =asyncHandler(async (req, res) => {
  res.status(200).json({ message: `get all available books` });
});

//@desc get book with id
//@route GET /api/books/:id
//@access Public

const getBook = asyncHandler(async(req, res) => {
    res.status(200).json({ message: `get book with id   ${req.params.id}` });
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
    res.status(201).json({ message: `Add a new book (Only authenticated users)` });
  });

//@desc update book details
//@route PUT /api/books/:id
//@access Public

const updateBook = asyncHandler(async(req, res) => {
    res.status(200).json({ message: `update book details (Only owner) for book id ${req.params.id}` });
  });

//@desc Delete a book
//@route DELETE /api/books/:id
//@access Public

const deleteBook = asyncHandler(async(req, res) => {
    res.status(200).json({ message: `Delete a book (Only owner) for book id ${req.params.id}` });
  });


 
module.exports = {getBooks, getBook, addBook, updateBook, deleteBook};

