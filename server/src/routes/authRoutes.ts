import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticationToken } from "../middleware/auth.middleware";
import { PrismaClient } from "../generated/prisma";
import { registerAuth } from "../controllers/authController";

const prisma = new PrismaClient();

export const authRouter = Router();

// //test auth routes
// authRouter.get('/test', (req, res) => {
//   res.send("Auth route is working!");
// });

//Register a new user with name email and password
authRouter.post("/register", registerAuth);

//login routes for returning users
authRouter.post("/login", async (req: any, res: any) => {
  //pulling the email and password from the req.body from login request
  const { email, password } = req.body;

  //check if the email or password is missing, if so send a message
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Please provide email and password " });
  }

  try {
    //check the db to see if the user email exist
    const existingUser = await prisma.user.findUnique({ where: { email } });
    //if user email does not exist sent an error message to the client
    if (!existingUser) {
      return res
        .status(404)
        .json({ error: "No account found with this email" });
    }
    //compare the password from the db to the password in the req.body
    const comparePassword = await bcrypt.compare(
      password,
      existingUser!.password,
    );
    //if password does not match return an error message to the client
    if (!comparePassword) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    //once email is confirmed and password is verified create web token
    const token = jwt.sign(
      { userId: existingUser!.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );
    //if password matches successfully return a json message to client with user data (no password)
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: existingUser!.id,
        email: existingUser!.email,
        username: existingUser.username,
      },
    });

    //catch error
  } catch (error) {
    console.log("Login error:", error);
    return res
      .status(404)
      .json({ error: "Something went wrong. Please try again" });
  }
});

//Uses the authenticationToken middleware to verify the JWT
authRouter.get(
  "/protected",
  authenticationToken,
  (req: Request, res: Response) => {
    res.json({ message: "Access granted to protected route!" });
  },
);
