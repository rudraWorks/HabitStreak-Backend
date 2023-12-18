import { Router } from "express";
import { addHabit , myHabits, habitDetails, today, updateEmoji, renameHabit, deleteHabit} from "../controllers/habit.js";
import checkUser from "../middlewares/checkUser.js";

const router = Router()

router.post('/add',checkUser,addHabit)
router.get('/myhabits',checkUser,myHabits)
router.get('/details',checkUser,habitDetails)
router.put('/today',checkUser,today)
router.put('/updateEmoji',checkUser,updateEmoji)
router.put('/renameHabit',checkUser,renameHabit)
router.delete('/deleteHabit',checkUser,deleteHabit)

export default router   