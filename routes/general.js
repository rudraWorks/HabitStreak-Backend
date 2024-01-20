import { Router } from "express";

import { feedback } from "../controllers/general.js";

const router = Router()

router.post('/feedback',feedback)

export default router  