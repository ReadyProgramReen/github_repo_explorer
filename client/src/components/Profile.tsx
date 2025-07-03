import { useEffect,useState } from "react"
import "./Profile.css"
import Navbar from "./Navbar"

export default function Profile() {
    
    const [user,setUser]= useState<{email:string,id:number}>({})

    useEffect(()=>{
        //get user email annd id from local storage 
        const userData = localStorage.getItem("user")

        //if the user data exit , turn the string back to an object and set it in state hook
        if(userData){
            setUser(JSON.parse(userData))
        }
    },[])

  return (
    <div className="profile-container">

        <Navbar/>
        <h1>Profile</h1>

        {user.email? 
        (
            <>
            <p><strong>Your Email:</strong>{user.email}</p>
            <p><strong>Your Id :</strong>{user.id}</p>
            </>
        )
        :
        (
            <p>User Profile not avaiable </p>
        )}
    </div>
  )
}
