import NotesModel from "../models/Notes.js";
import AWS from 'aws-sdk'
import * as dotenv from 'dotenv';
import mongoose from 'mongoose' 

dotenv.config()

const s3 = new AWS.S3({
    credentials: {
        accessKeyId: process.env.ACCESS_ID_S3,
        secretAccessKey: process.env.SECRET_ACCESS_KEY_S3
    },
    region: process.env.REGION_S3,
})


export const addNote = async (req, res) => {
    try {
        let { email, title, text, epoch, images } = req.body; // Assuming the data is passed in the headers
        email = email.trim()
        title = title.trim()
        // text=text.trim() 

        // Check if email, text, epoch, and images are present in the request headers
        if (!email || !title || !epoch || !images) {
            return res.status(400).json({ message: 'Input fields can not be empty' });
        }

        // Create a new note
        const newNote = {
            epoch: Number(epoch),
            text: String(text),
            title: String(title),
            images: Array.isArray(images) ? images.map(String) : [String(images)]
        };

        // Find the user by email
        let user = await NotesModel.findOne({ email: String(email).toLowerCase() });

        // If the user doesn't exist, create a new one
        if (!user) {
            const newUser = new NotesModel({
                email: String(email).toLowerCase(),
                notes: [newNote]
            });
            user = await newUser.save();
        } else {
            // Add the new note to the existing user's notes
            user.notes.push(newNote);
            user = await user.save();
        }

        const addedNote = user ? user.notes[user.notes.length - 1] : newNote;
        const addedNoteId = addedNote._id;
        // console.log(addedNote);
        return res.status(200).json({ message:"Page added successfully", addedNoteId });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

 
export const uploadToS3 = async (req, res) => {
    try {
        const email = req.email
        // console.log(email);
        const key = `habitstreak/${email}/${Date.now()}.jpeg`
        // S3 getSignedUrl with callbacks are not supported in AWS SDK for JavaScript (v3).
        // Please convert to 'client.getSignedUrl(apiName, options)', and re-run aws-sdk-js-codemod.
        s3.getSignedUrl('putObject', {
            Bucket: 'my-blog-bucket-rps-123',
            ContentType: 'image/png',
            Key: key
        }, (err, url) => {
            if (err)
                return res.status(400).json({ message: err?.message })
            return res.status(200).json({ key, url })
        }) 
    }
    catch (e) {
        return res.status(400).json({ message: e.message })
    }
}

export const getTitles = async (req, res) => {
    try {
        const email = req.email
        const titles = await NotesModel.findOne({ email }, { 'notes.title': 1, 'notes._id': 1,'notes.epoch':1, _id: 0 });

        if (!titles) {
            return res.status(200).json({ message: [] })
        }

        const extractedTitles = titles//.map(note => note);

        return res.status(200).json({ message: extractedTitles });
    }
    catch (e) {
        return res.status(400).json({ message: e.message })
    }
}

export const getNoteDetails = async (req, res) => {
    try {
        const email = req.email
        const { noteId } = req.params
        // console.log(noteId);
        // Check if noteId is provided
        if (!noteId) {
            return res.status(400).json({ message: 'Note ID is required' });
        }

        // Use aggregation to retrieve the specific note by _id
        const result = await NotesModel.aggregate([
            { $match: { 'email': email } },
            { $unwind: '$notes' },
            { $match: { 'notes._id': new mongoose.Types.ObjectId(noteId) } },
            {
                $project: { 
                    _id: '$notes._id',
                    text: '$notes.text',
                    images: '$notes.images',
                    title: '$notes.title', 
                    epoch: '$notes.epoch',
                }
            }
        ]); 

        // Check if the result is empty
        if (result.length === 0) {
            return res.status(404).json({ message: 'Page not found' });
        }
 
        // Return the information in the JSON response
        return res.status(200).json(result[0]);
    } 
    catch (e) {
        return res.status(400).json({message:e.message})
    }
}

export const deleteNote = async (req,res) => {
    try{
        const email = req.email 
        const {noteId} = req.params 

        const result = await NotesModel.findOneAndUpdate(
            { email: String(email).toLowerCase() },
            { $pull: { notes: { _id: noteId } } },
            { new: true } 
        )
        
        return res.status(200).json({message:'Note deleted'})
        
    }
    catch(e){
        return res.status(400).json({message:e.message})
    }
}

export const editNote = async (req,res) => {
    try{
        const email = req.email 
        const {noteId,newText,newTitle,newImages} = req.body

        const result = await NotesModel.findOneAndUpdate(
            { 'email': String(email).toLowerCase(), 'notes._id': noteId },
            {
                $set: {
                    'notes.$.text': String(newText),
                    'notes.$.title': String(newTitle),
                    'notes.$.images': Array.isArray(newImages) ? newImages.map(String) : [String(newImages)]
                }
            },
            { new: true } // To return the updated document
        ); 
         
        return res.status(200).json({message:result?.notes?.filter((note)=>note._id==noteId)?.[0]}) 
    }
    catch(e){
        return res.status(400).json({message:e.message})
    }
}