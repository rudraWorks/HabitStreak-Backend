import { Router } from "express";

import {login,verifyToken} from '../controllers/auth.js'

const router = Router()

router.post('/login',login)
router.get('/verifyToken',verifyToken)

export default router  