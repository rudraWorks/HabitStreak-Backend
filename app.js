import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import Users from './models/Users.js';
import Habits from './models/Habits.js';

// routes
import authRoutes from './routes/auth.js'
import habitRoutes from './routes/habit.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(req.path, req.method);
  // setTimeout(() => { 
    next(); 
  // }, 200); 
}); 


app.use('/auth',authRoutes)
app.use('/habit',habitRoutes)

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
  const t = await Users.updateMany(
    {},
    { $set: { pro : false } },
    {multi:true}
  )
  // const t = await Users.find({})
  console.log(t); 
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
