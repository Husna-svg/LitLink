const mongoose=require("mongoose");

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true,"Please provide a title"],
    },
    author: {
        type: String,
        required: [true,"Please provide an author"],
    },
    edition:{
        type: String,
       
      },
    category: {
        type: [String],
        required: [true,"Please provide a genre"],
    },
    condition: {
        type: String,
        required: [true,"Please provide book's condition"],
    },
    isbn: {
        type: String,
        required: true,
        unique:true
      },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    holder:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User"',
      default: null
      },
      isAvailable: {
        type: Boolean,
        default: true,
      },
      requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      desc:{
        type: String,
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
      isReturned:{
        type: Boolean,
        default: false,
      },
      frontPage: {
        type: String,
        required: true,
      },
      backPage: {
        type: String,
        required: true,
      },

    location: {
        type: String,
        required: [true,"Please provide your location"],
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model("Book", bookSchema);
