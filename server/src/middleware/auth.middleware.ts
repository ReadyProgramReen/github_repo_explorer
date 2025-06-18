import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken"

interface AuthRequest extends Request {
  user?: any; 
}

//create a middleware for the authentication 
export function authenticationToken(req:AuthRequest,res:Response,next:NextFunction){
    //store  the client  authentication header 
    const authHeader = req.headers.authorization

    //check if the authentication header exist and get the token after the bearer 
    const token = authHeader && authHeader.split(' ')[1]

    //if token does not exist return a status with an erroe message
    if(!token){
        res.status(401).json({error: "Access denied . No token provided"})
    }
     
    

    //verify the token is valid and return the payload data
    try {
         const decoded = jwt.verify(token!,process.env.JWT_SECRET as string) ;
        
         //attach the payload data in req.user
         req.user = decoded ;
            
          //call next to run the next route
         next() ;
            
    } catch (error) {
     //catch any error respond 
     res.status(401).json({error: "Invalid or expired token"});
        
    }



}