import { Router,Request,Response } from "express";
import { authenticationToken } from '../middleware/auth.middleware';
import {PrismaClient} from "../generated/prisma";

const prisma = new PrismaClient();
export const favRouter = Router();

favRouter.post('/',authenticationToken,async(req:any,res:any)=>{
    const {repoId,repoName} = req.body;

    //Check if repo id and repo name are both included 
    if(!repoId || !repoName){
        return res.status(400).json({error:"Repository ID and name are both required"})
    }

    try {
        //add the faviorite to the db 
        const newFaviorite = await prisma.favorite.create({
           data: {
            repoId,
            repoName,
            userId: req.user.userId,
      }, 
        });
        //respond to client  with a status and mesaage and new db
        return res.status(201).json({
            message:"Repository favorited successfully",
            favorite: newFaviorite,
        })
        
    } catch (error) {
         console.error("Favorite error:", error);
        return res.status(500).json({ error: "Something went wrong. Try again." });
    }
});

// Create a new favorite entry 
favRouter.post("/add", authenticationToken, async (req: any, res: any) => {
  // Extract repoId and repoName from the request body
  const { repoId, repoName } = req.body;

  // Extract userId from the decoded token payload
  const userId = req.user.userId;

  //  Validate input
  if (!repoId || !repoName) {
    return res.status(400).json({ error: "repoId and repoName are required" });
  }

  try {
    // Check if this repo is already favorited by the same user
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        repoId,
        userId,
      },
    });

    if (existingFavorite) {
      return res.status(409).json({ error: "Repository already favorited." });
    }

    // Create new favorite
    const newFavorite = await prisma.favorite.create({
      data: {
        repoId,
        repoName,
        user: { connect: { id: userId } },
      },
    });

    return res.status(201).json({ message: "Favorite added!", favorite: newFavorite });
  } catch (error) {
    console.error("Error adding favorite:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


//create route where logged in user can see all their favorite GitHub repos
favRouter.get("/", authenticationToken , async (req:any,res:any)=>{
    try {
        //get the user id 
        const userId = req.user.userId
    
        //find all faviorites that belong to the logged in user in the db
        const favorites  = await prisma.favorite.findMany({
            where:{userId},
            //newest first
            orderBy:{createdAt:"desc"}
        })
    
        //send faviorte list back to the client with a status 
        return res.status(200).json({favorites})
    } catch (error) {
            console.error("Error fetching favorites:", error);
    return res.status(500).json({ error: "Failed to fetch favorites" });
        
    }
})

//Removing a favorite repo
favRouter.delete('/:id',authenticationToken,async(req:any,res:any)=>{
//get the fav repo id from the req.params
const favioriteId = req.params.id;

try {
    //check if the id exist in the db
    const favorite = await prisma.favorite.findUnique({
        where:{id:favioriteId},
    });
    
    //check that the current user owns the fav repo before deleting
    if(!favorite || favorite.userId != req.user.userId){
        return res.status(403).json({error:"Unauthorized or not found"});
    }
    
    //delete the entry from the favorite table 
    await prisma.favorite.delete({
        where: {id: favioriteId},
    })
    
    //responde to the client that the delete was successful
    return res.status(200).json({message:"Favorite removed successfully"})
    
} catch (error) {
    console.error('Delete favorite error:', error);
    return res.json(500).json({error:"Something went wrong"});
    
}

})