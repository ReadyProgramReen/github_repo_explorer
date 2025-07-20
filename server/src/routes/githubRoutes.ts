import { Router, Request, Response } from "express";
import axios from "axios";
import { authenticationToken } from "../middleware/auth.middleware";

export const githubRouter = Router();

//search github repo by username
githubRouter.get(
  "/:username",
  authenticationToken,
  async (req: Request, res: Response) => {
    //extract the username from the req.params
    const { username } = req.params;

    try {
      //make a request to the Github API
      const response = await axios.get(
        `https://api.github.com/users/${username}/repos`,
      );

      //return thr list of repositories to the client
      res.status(200).json(response.data);

      //catch error
    } catch (error) {
      console.log("GitHub API error:", error);

      // If the GitHub user doesn't exist or another issue occurred
      res
        .status(500)
        .json({ error: "Failed to fetch repositories from GitHub" });
    }
  },
);
