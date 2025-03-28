
const CHAT = require('../models/chatModel');
const USER = require('../models/userModel');
const asyncHandler = require("express-async-handler");

//@desc create chat
//@route POST /api/chat/createChat/:id
//@access Private
const createChat= asyncHandler(async(req,resp)=>{
    const userId = req.userId.id;
    const {id} = req.params;
    try {
        if(!userId){
            return resp.status(404).json({error:"Un-authorized,log in first"})
        }
        let userToChat = await USER.findById(id)
        let chat = await CHAT.findOne({ 
            users: { $all: [id, userId], $size: 2 }
        }).populate('users', '-password');
        if (chat) {
            return resp.status(200).json(chat);
        }else{
            var chatData = {
                chatName: userToChat.name,
                users:[id,userId],
            }
            const createdChat =await CHAT.create(chatData)
                const fullChat = await CHAT.findOne({_id:createdChat._id}).populate("users","email name")
                resp.status(201).json(fullChat)
        }
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({ error: 'Internal server error while creating chat' });
    }
});

const getChats= asyncHandler(async(req,resp)=>{
    const userId = req.userId.id;
    try {
        const getChats = await CHAT.find({users:{$elemMatch:{$eq:userId}}}).populate("users","name")
        resp.status(200).json(getChats)
    } catch (error) {
        resp.status(404).json({message:error.message})
    }
})



module.exports = {createChat,getChats};//getChats};