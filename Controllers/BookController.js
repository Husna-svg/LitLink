
const Book= require("../models/bookModel");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel"); // Ensure this line is present at the top


//@desc get all available books
//@route GET /api/books/allBooks
//@access Private
const getBooks =asyncHandler(async (req, res) => {
  
  try {
    let query = { isAvailable: true, requester: null };

    // Searching by title or author
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { author: searchRegex }
      ];
    }

    // Filtering by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    console.log("Query:", query); // Debugging query
    // Fetch books and populate owner details
    const books = await Book.find(query).populate('owner', 'name email');
    console.log("Books Found:", books); // Debugging response
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: error.message });
  }
});

//@desc get book with id
//@route GET /api/books/:id
//@access Private

const getBook = asyncHandler(async(req, res) => {
  const {id}=req.params
  try {
      const books = await Book.findOne({ isAvailable: true,_id:id }).populate('owner', 'name email');
      if(!books){
          return  res.status(404).json({error:"No book Found"});  
      }
      res.status(200).json(books);
  } catch (error) {
      res.status(500).json({message:error.message});
  }
})

//@desc Add a new book
//@route POST /api/books/create
//@access Private
const addBook = asyncHandler(async (req, res) => {
  try {
      const userId = req.userId.id;
      console.log("User ID from Token:", req.userId); // Debug log

      console.log(req.body); // ✅ Debugging: Check if req.body is received
      console.log(req.files); // ✅ Debugging: Check if files are received

      if (!req.files || !req.files.frontPage || !req.files.backPage) {
          return res.status(400).json({ message: 'Front and Back images are required' });
      }

      const { title, author, category, isbn,location,condition,desc} = req.body;
      const frontPage = req.files['frontPage'] ? req.files['frontPage'][0].filename :"default-front.jpg";
      const backPage = req.files['backPage'] ? req.files['backPage'][0].filename : "default-back.jpg";
      if (!location || !condition) {
        return res.status(400).json({ error: "Location and book condition are required." });
    }
      if (!userId) {
          return res.status(404).json({ error: "Un-authorized, log in first" });
      }
      if (!frontPage || !backPage) {
          return res.status(400).json({ error: 'Incomplete book images.' });
      }
      if (!title || !author || !isbn || !category || !location || !condition || !desc
          ) {
          return res.status(400).json({ error: 'Incomplete book details.' });
      };
      console.log(req.body);
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }
      user.points += 1; // Add 1 point for adding a book
      await user.save();


      const newBook = await Book.create({
          title,
          author,
          isbn,
          category,
          owner: userId,
          location,
          condition,
          desc,
         
          frontPage,
          backPage
      });

      const getNewBook = await newBook.populate("owner", "name email");
      res.status(200).json({
        message: "Book created successfully! You earned 1 point.",
        points: user.points,
        getNewBook
    });
    
  } catch (error) {
    console.error("Error while creating a book:", error); // Log full error
    res.status(500).json({ error: "Internal error while creating a book", details: error.message });

  }
});

//@desc Request a book
//@route POST /api/books/request/
//@access Private

const reqBook = asyncHandler(async(req, res) => {
  
    const userId = req.userId.id;
    const user=await User.findById(userId);
    const { bookId } =req.body;
    console.log("Received bookId:", bookId);
    const mongoose = require("mongoose");

if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: "Invalid book ID format" });
}

    try{
        if (!userId) {
            return res.status(404).json({ error: "Un-authorized, log in first" });
        }
        if (user.points <= 0) {
          return res.status(400).json({ error: "Not enough points to request a book. Add a book to earn points!" });
      }

    /*    const heldBook=await Book.findOne({holder:userId});
        if(heldBook){
            return res.status(400).json({error:"You already have a book"});
        }*/
        const book=await Book.findById(bookId);
       

        if(!book){
            return res.status(404).json({error:"Book not found"});
        }
        if(String(book.owner)===String(userId)){
            return res.status(400).json({error:"You can't request your own book"});
        }

        if (book.requester) {
          console.log("Book requester ID:", book.requester);

            if (String(book.requester) === String(userId)) {
                await Book.findOneAndUpdate({
                  _id: bookId },
                  { requester: null },
                  { new: true, runValidators: true }
              );
              return res.status(200).json({ message: 'Request canceled successfully.' });
            } else {
                const requester = await User.findById(book.requester);
                return res.status(400).json({ error: `This book is already requested by ${requester.name}.` });
            }
        }

        user.points -= 1;
        await user.save();

        const updatedBook = await Book.findOneAndUpdate(
          { _id: bookId, isAvailable: true, holder: null },
          { requester: userId },
          { new: true, runValidators: true }
        ).populate("requester", "name email").populate("owner", "name email");
        
        if (!updatedBook) {
          return res.status(404).json({ error: 'Book not available for request.' });
        }
        res.status(200).json({ message: "Request has been sent. 1 point deducted.", updatedBook });
        
       
        } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error while requesting" });
        }
        });
        
    



//@desc Delete a book
//@route DELETE /api/books/:id
//@access Public

const deleteBook = asyncHandler(async(req, res) => {
  try{const book = await Book.findById(req.body.id);
    console.log("Received bookId:", req.body.id);
  if(!book) {
    res.status(404);
    throw new Error("Book not found");
  }
  if (book.isAvailable && !book.holder && !book.requester) {
    const deletedBook = await Book.findByIdAndDelete(req.body.id);
    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    return res.status(200).json({ message: 'Book deleted successfully' });
  } else {
    return res.status(400).json({ error: 'Cannot delete the book' });
  }
} catch(error) {
  res.status(500).json({ error: 'Server error' });
}
});

 //view requests
//@route GET /api/books/requests
//@access Private
const viewRequests = asyncHandler(async (req, res) => {
  const userId = req.userId.id;
  try {
    if (!userId) {
      return res.status(401).json({ error: 'Un-authorized' });
    }
    const requests =await Book.find({ owner: userId, isApproved: false, requester: { $ne: null } }).populate("requester", "name email");
    if(!requests || requests.length === 0) {
      return res.status(404).json({ message: 'No requests found' });
    }
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error in viewing requests'});
  }
});

//@desc Approve a request
//@route PUT /api/books/approve/
//@access Private

const approveRequest = asyncHandler(async(req, res) => {
  const userId = req.userId.id;
    const { bookId } = req.body;

    try {
        if (!userId) {
            return res.status(401).json({ error: 'Un-authorized' });
        }
        
        const book = await Book.findById(bookId).populate("requester", "name email").populate("owner", "name email");
        console.log("Book Data:", book);
console.log("Book Requester:", book.requester);

        if(!book){
            return res.status(404).json({ error: 'Book not found' });
        }
        if (!book.requester) {
          return res.status(400).json({ error: "No requester found for this book" });
        }
        book.isApproved = true;
        book.holder = book.requester._id;
        book.requester = null;
        book.isAvailable = false;
        // console.log(book);
        await book.save();
        const updatedBook = await Book.findById(bookId).populate("requester", "name email").populate("owner", "name email").populate("holder", "name email");
        if(!updatedBook){
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json({ message:`Book approved successfully , the holder of book is ${updatedBook.holder.name}`, updatedBook });
    } catch (error) {
      console.log(error);
        res.status(500).json({ error: 'Server error while uploading book' });
    }
});

 
module.exports = {getBooks, getBook, addBook, reqBook, deleteBook, viewRequests, approveRequest};

