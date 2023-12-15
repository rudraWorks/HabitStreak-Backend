import { Schema, model } from "mongoose";

const calendar = Schema({
    epoch:{
        type:Number,
        required:true
    },
    value:{
        type:Number,
        min:[0,"Invalid input"]
    }
})

const habit = Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    type:{
        type:String,
        required:true,
        enum: ['Binary', 'Integer'] 
    },
    emoji:{
        type:String,
        required:true
    },
    creationDate:{
        type:Date,
        default:Date.now,
        immutable:true
    },
    calendar:{
        type:[calendar]
    }
})

const habitSchema = Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    habits:[habit]
})


export default model('Habits', habitSchema)