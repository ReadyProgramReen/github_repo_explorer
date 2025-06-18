import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export const authRouter = Router();

//test auth routes
authRouter.get('/test', (req, res) => {
  res.send("Auth route is working!");
});


//Register a new user with name email and password
authRouter.post('/register', async (req: any, res: any)=> {
  // get the email, password from the request body
  const { email, password } = req.body;

  //check if email and pass are empty
  if (!email || !password) {
    return res.status(400).json({ error: "Please provide both email and password" });
  }

  try {
    //check if the user with that email already exist in the database 
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    //if existinguser is true then send a message to the client informing them
    if (existingUser) {
      return res.status(400).json({ error: "You already have an account with this email" });
    }

    // waited for the hashed and salted password
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // store the new user data in User table
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashPassword
      },
    });

    //inform the client side that new user was successfully created and sent user email
    return res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, email: newUser.email }
    });

    //catch the error
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

//login routes for returning users 
authRouter.post('/login',async(req:any,res:any )=>{
//pulling the email and password from the req.body from login request
const {email, password} = req.body;

//check if the email or password is missing, if so send a message 
if(!email || !password){
    res.status(400).json({error:"Please provide email and password "})
}


try {
//check the db to see if the user email exist
    const existingUser = await prisma.user.findUnique({where: {email}});
//if user email does not exist sent an error message to the client 
  if(!existingUser){
    res.status(404).json({error: "No account found with this email"});
  }
//compare the password from the db to the password in the req.body
const comparePassword = await bcrypt.compare(password, existingUser!.password)
//if password does not match return an error message to the client 
if(!comparePassword){
  return res.status(401).json({error: "Incorrect password"})
}

//if password matches successfully return a json message to client with user data (no password)
return res.json(200).json({
  message:"Login successful",
  user:{id:existingUser!.id,
        email: existingUser?.email
      }

})

//catch error    
} catch (error) {
  console.log('Login error:', error)
  return res.status(404).json({error: "Something went wrong. Please try again"});    
}

})


