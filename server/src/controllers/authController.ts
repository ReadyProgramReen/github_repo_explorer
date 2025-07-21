import { Router, Request, Response } from "express";
import type { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registerAuth: RequestHandler = async (req: any, res: any) => {
  // get the email, password from the request body
  const { email, password, username } = req.body;

  //check if email and pass are empty
  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ error: "Please provide both email, username and password" });
  }

  try {
    //check if the user with that email already exist in the database S
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    //if existinguser is true then send a message to the client informing them
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "You already have an account with this email" });
    }

    // waited for the hashed and salted password
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // store the new user data in User table
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashPassword,
      },
    });

    //inform the client side that new user was successfully created and sent user email
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });

    //catch the error
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};
