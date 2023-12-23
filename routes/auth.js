import { Router } from "express";

import {activate, checkout, login,verifyToken} from '../controllers/auth.js'
import checkUser from "../middlewares/checkUser.js";

const router = Router()

router.post('/login',login)
router.get('/verifyToken',verifyToken) 
router.post('/checkout',checkout)
router.get('/activate/:_id',activate)

export default router  