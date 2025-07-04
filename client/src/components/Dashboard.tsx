import {useEffect,useState} from 'react'
import './Dashboard.css'
import Navbar from './Navbar';
import type { Favorite} from '../types/types.ts';


export default function Dashboard() {

// define the shape of the favorite object 


    const [favorites, setFavorites] = useState<Favorite[]>([])

    //assess the user data 
    const user = JSON.parse(localStorage.getItem("user") || "{}");



    //fetched faviorites  
    useEffect(()=>{
        const fetchFavorites = async ()=>{
            try {
                //get user token from local storage 
                const token = localStorage.getItem("token")
                //fetch all the users favorite repo
                const response = await fetch("http://localhost:9000/favorite",{
                    headers:{
                        Authorization : `Bearer ${token}`,
                    },
                });

                //check for errors in the fetch
                if(!response.ok){
                    throw new Error ('Failed to fetch favorite')
                }
            
                const data = await response.json();
                setFavorites(data.favorites);
                console.log("data:",data);

            } catch (error) {
                console.error("Failed to fetch favorites:", error);
                
            }
        };

        fetchFavorites();

    },[])

    //remove favorite repo from db 
    const handleRemove = async (id: string) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`http://localhost:9000/favorite/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to remove favorite");
    }

    // Refresh favorites in UI
    setFavorites(prev => prev.filter(repo => repo.id !== id));
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
};



  return (
    <div>

        {/* navbar */}
        <Navbar/>

        <div className='dashboard-container'>
          <div className="dashboard-header">
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Welcome to your GitHub Repo Explorer dashboard</p>
            <p className="dashboard-welcome">
            Welcome back{user.email ? `, ${user.email.split("@")[0]}` : ""}
            </p>
        </div>


        {/* //display faviorites repos */}
        <h2>Your Favorite Repositories</h2>

        {favorites.length === 0 ? (
        <p>You have no favorites saved yet.</p>
        ) : (
       <ul className='repo-list'>
    {favorites.map((repo: any) => (
    <li key={repo.id} className="repo-item">
      <div>
        <p className="repo-name">{repo.repoName}</p>
        <p className="repo-id">{repo.repoId}</p>
      </div>
      <button
        className="delete-button"
        onClick={() => handleRemove(repo.id)}
      >
        Delete
      </button>
    </li>
  ))}
</ul>

        )}



        </div>
    </div>
  )
}
