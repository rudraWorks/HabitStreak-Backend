import { Schema, model } from "mongoose";

const notesSchema = new Schema({
    epoch: {
        type:Number,
        required: [true, 'Epoch is required'],
        validate: {
            validator: Number.isInteger,
            message: 'Epoch must be an integer.'
        }
    },
    title:{
        type:String,
        maxlength:[100],
        required:true
    },
    text: {
        type: String,
        maxlength: [1000],
        default: ''
    },
    images: {
        type: [String] // Assuming images are stored as strings (file paths or URLs)
    }
});

const NotesSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique'],
        lowercase: true,
        maxlength: [255, 'Email must be at most 255 characters']
    },
    notes: {
        type: [notesSchema]
    }
});

const NotesModel = model('Notes', NotesSchema);

export default NotesModel;
