import {model,models,Schema,Document,Model} from "mongoose";
export interface ITag extends Document{
    name:string;
    description:string;
    questions:Schema.Types.ObjectId[];
    followers:Schema.Types.ObjectId[];
    createdOn:Date;
}
const TagSchema=new Schema({

    name:{type:String,required:true,unique:true},
    description:{type:String},
    questions:[{type:Schema.Types.ObjectId,ref:'Question'}],
    followers:[{type:Schema.Types.ObjectId,ref:'User'}],
    createdOn:{type:Date,default:Date.now}
});

const Tag: Model<ITag> = models.Tag || model<ITag>('Tag', TagSchema);
export default Tag;