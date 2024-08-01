import {Schema,model,Model,Document, models} from 'mongoose';

export interface IInteraction extends Document{
    question:Schema.Types.ObjectId,
    user:Schema.Types.ObjectId,
    tags:Schema.Types.ObjectId[],
    answer:Schema.Types.ObjectId,
    action:String,
    createdAt:Date
}

const InteractionSchema=new Schema({
    question:{
        type:Schema.Types.ObjectId,
        ref:'Question',
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    action:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    tags:[{
        type:Schema.Types.ObjectId,
        ref:'Tag'
    }],
    answer:{
        type:Schema.Types.ObjectId,
        ref:'Answer'
    },
    

})

const Interaction:Model<IInteraction>=models.Interaction||model('Interaction',InteractionSchema);

export default Interaction;