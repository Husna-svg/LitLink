const mongoose=require('mongoose')

const MessageSchema = new mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    message:{type:String},
    chatId:{type:mongoose.Schema.Types.ObjectId,ref:"Chat"}
},{timestamps:true})


const MESSAGE=mongoose.model("Message",MessageSchema)
module.exports=MESSAGE