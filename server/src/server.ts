import dotenv from "dotenv"
dotenv.config(); //needs to be before the express 

import express from 'express';
const app = express();


const PORT = process.env.PORT || 8000

//testing  route 
app.get('/',(req,res)=>{
    res.send('Hello from the backend')
})

//listening to server
app.listen(PORT,()=>{
    console.log(`Server is running on Port: ${PORT}`)
})