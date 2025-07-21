import { Router, Request, Response } from "express";
import { authenticationToken } from "../middleware/auth.middleware";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const profileRoutes = Router();

//Request profile to get all user data from db
profileRoutes.get("/", authenticationToken, async (req: any, res: any) => {
  try {
    //get userid from the request from the decoded in authToken
    const userId = req.user.userId;

    //find the user data in the db with the userId
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true, createdAt: true },
    });

    // check if no user is found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //if user data is found , return it back to the client
    res.json({ user });

    //catching the error
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

//log user out
profileRoutes.post("/logout", authenticationToken, (req: any, res: any) => {
  //instructs frontend to delete the token
  return res
    .status(200)
    .json({
      message: "Logout successful . Please delete the token from client ",
    });
});
