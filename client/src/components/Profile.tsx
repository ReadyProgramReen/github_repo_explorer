import { useEffect,useState } from "react"
import "./Profile.css"
import Navbar from "./Navbar"
import type { Favorite} from '../types/types.ts';


export default function Profile() {
    
    const [user,setUser]= useState<{email:string,username:string,id:number}|null>(null)
    const [faviorites, setFavorites]= useState<Favorite[]>([])
//placeholder logic for editing user info 
    const [editProfile, setEditProfile]= useState(false)

    console.log(user)
    //get user from local storage and store it in user state 
    useEffect(()=>{
        //get user email annd id from local storage 
        const userData = localStorage.getItem("user")

        //if the user data exit , turn the string back to an object and set it in state hook
        if(userData){
            setUser(JSON.parse(userData))
        }
    },[])

    //fetch favorites from db and store in favorites state hook
    useEffect(() => {
  const fetchFavorites = async () => {
    try {
    //get token from local storage 
      const token = localStorage.getItem("token");
      //fetch favorites from db with the token 
      const response = await fetch("http://localhost:9000/favorite", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //if http response is not ok , throw error 
      if (!response.ok) {
        throw new Error("Failed to fetch favorites");
      }

      //parse the data
      const data = await response.json();
      //store the data in the db 
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };
  //call the function
  fetchFavorites();
}, []);

  return (
<div>

        <Navbar/>

    <div className="profile-container">
        <div className="profile-header">
            <div className="profile-text">
                {/* <h1>{user && user.email?`Welcome back, ${user.email.split("@")[0]}`: "Welcome back! "}</h1> */}
                <h1>{user && user.username?`Welcome back, ${user.username}`: `Welcome back!`}</h1>
                <p>Your email: {user &&  user.email}</p>
            </div>

        <div className="profile-avatar">
            <img src="/default-avatar.png" alt="User avatar" className="profile-avatar" />
        </div>
        </div>

        {/* Edit user info placeholder */}
        {!editProfile ? 
        (
            <h3 className="edit-profile" onClick={()=>setEditProfile(!editProfile)}>Edit your profile info</h3>
        ):
        (

        <div className="profile-info">
        <h2>Profile Info</h2>
        <p><strong>Email:</strong> {user && user.email}</p>
        <button onClick={()=>setEditProfile(!editProfile)}>EDIT</button>
        </div>
        )}


        {/* profile repo info */}
        <div className="profile-repos">
            <h2>Recently Added Favorites</h2>

            {faviorites.length == 0 ?
            (
                <p>You haven't saved any repositories yet.</p>
            ):(
                <ul>
                    {faviorites.map((repo:any)=>(
                        <li key={repo.id} className="profile-repo-item">
                            <p className="repo-name">{repo.repoName}</p>
                            {/* <p className="repo-id">{repo.repoId}</p> */}
                              <a
                                href={repo.htmlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="dashboard-repo-link"
                                >
                                View on GitHub
                                </a>

                        </li>
                    )).splice(0,5)}
                </ul>
            )
            }
        </div>
    </div>
</div>
  )
}
