var mongoose=require('mongoose');
var UserSchema=new mongoose.Schema(
    {
        username:String,
        email:String,
        phone:String,
        password:String,
    },
    {timestamps:true}
);
module.exports=mongoose.model('User',UserSchema,'User');