import dotenv from "dotenv"
dotenv.config(); //needs to be before the express 

import express from 'express';
const app = express();


// routes 
import {authRouter} from './routes/authRoutes'
import {profileRoutes} from '../src/routes/profile.routes'


//middleware to parse json
app.use(express.json())
//route starter middleware
app.use('/auth',authRouter)
app.use('/profile',profileRoutes) 


//PORT declaration 
const PORT = process.env.PORT || 8000

//testing the route 
app.get('/',(req,res)=>{
    res.send('Hello from the backend. Today has been a hard day ')
})

app.listen(PORT,()=>{
    console.log(`Server is running on Port: ${PORT}`)
})

//forces the server to keep running and not stop so abruptly
setInterval(() => {}, 1000);
