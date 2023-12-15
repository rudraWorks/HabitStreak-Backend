import Habits from "../models/Habits.js";

export const addHabit = async (req,res) => {
    try{
        let {habitName : name,habitType : type, habitEmoji : emoji} = req.body 
        name = name.trim()
        type = type.trim()

        if(!name || !type)
            return res.status(400).json({message:"Invalid inputs"})
        if(type!=='Integer' && type!=='Binary')
            return res.status(400).json({message:"Invalid habit type"})
        if(name.length>25)
            return res.status(400).json({message:"Habit name is too long"})

        const email = req.email

        const response = await Habits.updateOne(
            { email, 'habits.name': { $ne: name } },
            { $addToSet: { habits: { name, type, emoji } } },
            {
                upsert: true,
                new: true 
            }
        );


        console.log(response);

        return res.status(200).json({message:'Habit created successfully.'})
    }
    catch(e){
        if(e.message.includes('E11000'))
            return res.status(400).json({message:'You have already created a habit with the same name.'})
        return res.status(400).json({message:e.message})
    }
}

export const myHabits = async (req,res) => {
    try{
        const email = req.email 
        const habit = (await Habits.findOne({email},{_id:0,email:0})).habits
        console.log(habit);
        const arr = habit.map((h)=>{
            return {name:h.name,emoji:h.emoji}
        })
        return res.status(200).json({message:arr})
    }
    catch(e){
        return res.status(400).json({message:e.message})
    }
}