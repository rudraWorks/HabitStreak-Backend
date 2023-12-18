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
        let habit = (await Habits.findOne({email},{_id:0,email:0}))
        
        if(!habit)
            return res.status(200).json({message:[]})
        
        habit = habit.habits
        // console.log(habit); 
        const arr = habit.map((h)=>{
            return {name:h.name,emoji:h.emoji}
        })
        return res.status(200).json({message:arr})
    }
    catch(e){
        return res.status(400).json({message:e.message})
    }
}

export const habitDetails = async (req,res) => {
    try{
        const email = req.email 
        let {habitName} = req.query 
        habitName = habitName.trim()

        console.log(email,habitName)

        const habit = await Habits.findOne({
            email: email,
            'habits.name': habitName
        }, {
            'habits.$': 1
        }).exec();

        if(!habit)
            return res.status(404).json({message:'Not found'})
        // console.log(habit); 
        const habitObj = habit.habits[0]
        return res.status(200).json({emoji:habitObj.emoji,type:habitObj.type,calendar:habitObj.calendar})
    }
    catch(e){
        console.log(e);
        return res.status(400).json({message:e.message})
    }
}

export const today = async (req,res) => {
    try{
        const email = req.email 
        let {type,epoch,value,habit} = req.body 

        console.log(email,type,habit,epoch,value)

        if(!epoch || value<0)
            return res.status(400).json({message:'Invalid input'})

        let p = await Habits.findOne(
            { email, 'habits.name': habit },
            { 'habits.calendar.$': 1 }
        )
        // console.log(p)
        p = p.habits[0].calendar
        let flag=0
        for(let i=0;i<p.length;++i)
            if(p[i].epoch === epoch)
                flag=1 
        if(!flag){
            await Habits.updateOne(
                { email, 'habits.name': habit },
                { $addToSet: { 'habits.$[elem].calendar': {epoch , value} } },
                { arrayFilters: [{ 'elem.name': habit }] }
            );
        }

        else{
            await Habits.updateOne(
                { email, 'habits.name': habit, 'habits.calendar.epoch': epoch },
                { $set: { 'habits.$.calendar.$[entry].value': value } },
                { arrayFilters: [{ 'entry.epoch': epoch }] }
            );
        }
       
        console.log(p)
        return res.json({message:p})
    }
    catch(e){
        return res.status(400).json({message:e.message})
    }
}

export const updateEmoji = async (req,res) => {
    try{
        const email = req.email 
        const {habit,emoji} = req.body 
        console.log(habit,emoji)
        const response = await Habits.updateOne(
            { email: email, 'habits.name': habit },
            { $set: { 'habits.$.emoji': emoji } }
        )
        
        return res.status(200).json({message:'Theme updated successfully'})
    }
    catch(e){
        return res.status(400).json({message:e.message})
    }
}

export const renameHabit = async (req,res) => {
    try{
        const email = req.email 
        const {habit,newHabit} = req.body 

        if(!newHabit)
            return res.status(400).json({message:'Invalid input'})

        const checkIfAlreadyPresent = await Habits.exists(
            {email,'habits.name':newHabit}
        )
        console.log(checkIfAlreadyPresent);
        if(checkIfAlreadyPresent)
            return res.status(400).json({message:'This habit already exists'})

        const response = await Habits.updateOne(
            { email, 'habits.name': habit },
            { $set: { 'habits.$.name': newHabit } }
        )
        return res.status(200).json({message:newHabit})
    }
    catch(e){
        return res.status(400).json({message:e.message})
    }
}

export const deleteHabit = async (req,res) => {
    try{
        const email = req.email 
        const {habit} = req.body 


        const response = await Habits.updateOne(
            { email },
            { $pull: { habits: { name: habit } } }
        );

        return res.status(200).json({message:'Successfully deleted'})
    }
    catch(e){
        return res.status(400).json({message:e.message})
    }
}