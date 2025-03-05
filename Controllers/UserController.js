const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc Register a new user
// @route POST /api/user/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all fields");
    }

    // Check if user already exists
    // Note: In a real implementation, you would check against a database
     const userExists = await User.findOne({ email });
     if (userExists) {
         res.status(400);
        throw new Error("User already exists");
     }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    // Note: In a real implementation, you would save to a database
     const user = await User.create({
         username,
         email,
         password: hashedPassword
     });

    res.status(201).json({ 
        message: "User registered successfully",
        user: { 
            username, 
            email 
        }
    });
});

// @desc Authenticate a user
// @route POST /api/user/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        res.status(400);
        throw new Error("Please provide email and password");
    }

    // Check if user exists
    // Note: In a real implementation, you would check against a database
     const user = await User.findOne({ email });
     if (!user) {
         res.status(400);
         throw new Error("Invalid credentials");
     }

    // Check password
    // Note: In a real implementation, you would compare against stored hash
     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) {
         res.status(400);
         throw new Error("Invalid credentials");
     }

    // Generate JWT token
    const token = jwt.sign(
        { 
            user: { 
              id: user._id,
              username: user.username,
              email: user.email 
                // In a real app, you might include user ID 
            } 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '30d' }
    );

    res.status(200).json({
        message: "User logged in successfully",
        token: token
    });
});

// @desc Get current user profile
// @route GET /api/user/:id
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
    // Note: In a real implementation, this would use authenticated user's info
    res.status(200).json({ 
        message: "User profile retrieved",
        user: {
            username: "Example User",
            email: "user@example.com"
        }
    });
});

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};