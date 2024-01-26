import { Router } from "express";

import checkUser from "../middlewares/checkUser.js";

import { addNote, uploadToS3, getTitles, getNoteDetails, deleteNote,editNote } from "../controllers/notes.js";

const router = Router()

router.post('/note',checkUser,addNote) 
router.get('/image',checkUser,uploadToS3)
router.get('/titles',checkUser,getTitles)
router.get('/details/:noteId',checkUser,getNoteDetails)
router.delete('/delete/:noteId',checkUser,deleteNote)
router.put('/edit',checkUser,editNote)

export default router   