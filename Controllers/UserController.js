const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Book = require("../models/bookModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
//@desc register user
//@route POST /api/users/register
//@access Public

const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password, location} = req.body;
    if(!name || !email || !password || !location){
        res.status(400);
        throw new Error("Please fill in all fields");
    }
    const userAvailable=await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already exists");
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed password:", hashedPassword);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        location,
        points: 0,
    });
    console.log(`user created: ${user}`);
    if(user){
        res.status(201).json({
            _id: user._id,
            email: user.email,
        });
    }
    else{
        res.status(400);
        throw new Error("Invalid user data");
    }

    res.json({
        message: "User registration successful",
    });
    }
);

//@desc login user
//@route POST /api/users/login
//@access Public


const loginUser = asyncHandler(async(req, res) => {
   try{ const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("Please fill in all fields");
    }
    const user=await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
user:
        
            {
                name:user.name,
                email: user.email,
                 id: user._id},
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "30m",
            }
        );
        res.status(200).json({accessToken});
    }
    else{
        res.status(400);
        throw new Error("Invalid email or password");
    }
}catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: error.message });
}
   
    }
);

//@desc get user profile
//@route GET /api/users/profile
//@access private

const getUserProfile = asyncHandler(async(req, res) => {
    console.log("User Data:", req.userId);
    try {
        // req.user is set by the auth middleware after verifying token
        const user = await User.findById(req.userId.id).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
   
    );

const getmybooks= asyncHandler(async(req, res) => {
    const userId=req.userId.id;
    try {
       if(!userId){
        return res.status(404).json({error:"Un-authorized,log in first"}) 
       }
       const books=await Book.find({owner:userId});//.populate("holder","name email")
       if(!books || books.length===0){
        return res.status(404).json({message:"No books found"})
       }
       res.status(200).json(books);
    } catch (error) {
        console.log("error in myBooks : ",error);
        res.status(500).json({ error: "Internal server error in myBooks" });
    }
})
    ;

    const logout=asyncHandler(async(req, res) => {
        const userId=req.userId.id;
        try {
            if(!userId){
                return  res.status(500).json({ error: "Un-authorized" });   
            }
            res.clearCookie('jwtToken', { path: '/' });
            res.status(200).json({ message: "Logged out successfully" });
        } catch (error) {
            console.log("error in logout : ",error);
            resp.status(500).json({ error: "Internal server error in logout" });
        }
    });

module.exports = {registerUser, loginUser, getUserProfile, getmybooks,logout};