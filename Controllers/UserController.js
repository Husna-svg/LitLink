const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
    console.log("User Data:", req.user);
    res.json(req.userId);
    });


module.exports = {registerUser, loginUser, getUserProfile};