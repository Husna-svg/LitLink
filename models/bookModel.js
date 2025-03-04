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
    genre: {
        type: [string],
        required: [true,"Please provide a genre"],
    },
    condition: {
        type: String,
        required: [true,"Please provide book's condition"],
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
