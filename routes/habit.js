import { Router } from "express";
import { addHabit , myHabits} from "../controllers/habit.js";
import checkUser from "../middlewares/checkUser.js";

const router = Router()

router.post('/add',checkUser,addHabit)
router.get('/myhabits',checkUser,myHabits)

export default router  