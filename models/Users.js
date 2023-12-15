import { Schema, model } from "mongoose";

const userSchema = Schema({
    name: { 
        type: String, 
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true
    },
    picture: {
        type: String
    },
    joined: {
        type: Date,
        default: Date.now,
        required: true,
    }
})


export default model('Users', userSchema)