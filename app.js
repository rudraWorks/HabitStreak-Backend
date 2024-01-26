import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import Users from './models/Users.js';
import Habits from './models/Habits.js';

// routes
import authRoutes from './routes/auth.js'
import habitRoutes from './routes/habit.js'
import generalRoutes from './routes/general.js'
import notesRoutes from './routes/notes.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(req.path, req.method);
  // setTimeout(() => { 
  next();
  // }, 3000); 
});


app.use('/auth', authRoutes)
app.use('/habit', habitRoutes)
app.use('/general',generalRoutes)
app.use('/notes',notesRoutes)


// 404 handler
app.get('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.DATABASE);
    console.log('Connected to the database');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const temp = async () => {
  let epoch = new Date('11/02/2023').getTime()
  for (let i = 1; i <= 3; ++i) {
    const t = await Habits.updateOne(
      { email:'srudra754@gmail.com', 'habits.name': 'read book' },
      { $addToSet: { 'habits.$[elem].calendar': { epoch, value:generateRandom(0,8) } } },
      { arrayFilters: [{ 'elem.name': 'read book' }] }
    );
    epoch+=1000*60*60*24
      console.log(new Date(epoch))
  }
  // const t = await Users.find({})
  // console.log(t);
  console.log('done');
}
// temp()
 
function generateRandom(min = 0, max = 100) {

  // find diff
  let difference = max - min;

  // generate random number 
  let rand = Math.random();

  // multiply with difference 
  rand = Math.floor( rand * difference);

  // add with min value 
  rand = rand + min;

  return rand;
}

// temp() 
// Start server after connecting to the database
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((error) => {
  console.error(error);
}); 
