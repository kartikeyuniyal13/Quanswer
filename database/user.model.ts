import {Schema,models,model,Document,Model} from "mongoose";
export interface IUser extends Document{
    clerkId:string;
    name:string;
    username:string;
    email:string;
    password?:string; 
    bio?:string;
    picture:string;
    portfolioWebsite?:string;
    location?:string;
    saved :Schema.Types.ObjectId[];
    reputation?:number;
    joinedAt:Date;
}
const UserSchema=new Schema({
    clerkId:{type:String,required:true},
    name:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,},
    bio:{type:String},
    picture:{type:String,required:true},
    portfolioWebsite:{type:String},
    location:{type:String},
    saved:[{type:Schema.Types.ObjectId,ref:'Question'}],
    reputation:{type:Number,default:0},
    joinedAt:{type:Date,default:Date.now}

    
})

const User: Model<IUser> = models.User || model<IUser>('User', UserSchema);
export default User;