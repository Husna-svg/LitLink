
const Book= require("../models/bookModel");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel"); // Ensure this line is present at the top
const Request = require("../models/requestModel");

// @desc Approve a request  
// @route PUT /api/request/approve
// @access Private

const approveRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.body;
    const userId = req.userId.id; // Assuming req.userId contains the ID of the logged-in user

    // Find the request by ID and populate the book and requester details
    const request = await Request.findById(requestId).populate('bookId').populate('requesterId');
    const book = await Book.findById(request.bookId._id);
    const bookId = request.bookId._id;
    if (!request) {
        return res.status(404).json({ message: "Request not found" });
    }

    // Check if the user is the owner of the book
    if (request.bookId.owner.toString() !== userId.toString()) {
        return res.status(403).json({ message: "You are not authorized to approve this request" });
    }

    // Update the request status to 'Approved'
    request.status = 'Approved';
    await request.save();

    const updatedRequest = await Request.findById(requestId).populate('bookId').populate('requesterId');
    if (!updatedRequest) {
        return res.status(404).json({ message: "Request not found" });
    }

    // Optionally, you can also update the book's status or notify the requester
    // For example, you might want to update the book's availability status
    book.isApproved = true; // Assuming you have a field to indicate if the book is approved
     book.holder = book.requester._id;
            book.requester = null;
            book.isAvailable = false;
            // console.log(book);
            await book.save();
            const updatedBook = await Book.findById(bookId).populate("requester", "name email").populate("owner", "name email").populate("holder", "name email");
            if(!updatedBook){
                return res.status(404).json({ error: 'Book not found' });
            }

    res.status(200).json({ message: "Request approved successfully", request });
});

// @desc Reject a request
// @route PUT /api/request/reject
// @access Private
const reject = asyncHandler(async (req, res) => {
    const { requestId } = req.body;
    const userId = req.userId.id; // Assuming req.userId contains the ID of the logged-in user

    // Find the request by ID
    const request = await Request.findById(requestId).populate('bookId').populate('requesterId');
    

    if (!request) {
        return res.status(404).json({ message: "Request not found" });
    }

    // Check if the user is the owner of the book
    if (request.bookId.owner.toString() !== userId.toString()) {
        return res.status(403).json({ message: "You are not authorized to reject this request" });
    }

    // Update the request status to 'Rejected'
    request.status = 'Rejected';
    await request.save();
    const book = await Book.findById(request.bookId._id).populate("requester", "name email").populate("owner", "name email");
                console.log("Book Data:", book);
        console.log("Book Requester:", book.requester);
          
                  if(!book){
                      return res.status(404).json({ error: 'Book not found' });
                  }
                  if (!book.requester) {
                    return res.status(400).json({ error: "No requester found for this book" });
                  }
                  book.isApproved = false;
                  book.holder = null;
                  book.requester = null;
                  book.isAvailable = true;
                  // console.log(book);
                  await book.save();
                  const updatedBook = await Book.findById(bookId).populate("requester", "name email").populate("owner", "name email").populate("holder", "name email");
                  if(!updatedBook){
                      return res.status(404).json({ error: 'Book not found' });
                  }
                  res.status(200).json({ message:`Request rejected successfully`, updatedBook });
              
     const updatedRequest = await Request.findById(requestId).populate('bookId').populate('requesterId');
    if (!updatedRequest) {
        return res.status(404).json({ message: "Request not found" });}
        
    res.status(200).json({ message: "Request rejected successfully", request });
});

module.exports = {
    approveRequest,
    reject
};