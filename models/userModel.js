const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide a name']
    },
    email:{
        type:String,
        required:[true,"Please provide an email address"],
        unique:[true,"Email already exists"]
    },
    password:{
        type:String,
        required:[true,"Please provide a password"]
    },
   location:{
        type:String,
        required:[true,"Please provide a location"]
    },
    points:{
        type:Number,
        required:true,
        default:0
    },
},{
    timestamps:true
});

module.exports=mongoose.model('User',userSchema);