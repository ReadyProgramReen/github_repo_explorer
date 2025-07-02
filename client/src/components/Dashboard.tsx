import {useEffect,useState} from 'react'
 
import './Dashboard.css'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


export default function Dashboard() {

// define the shape of the favorite object 
interface Favorite{
    id: string,
    repoId: string,
    repoName: string,
    userId: number,
    createdAt : string,
}

    const [favorites, setFavorites] = useState<Favorite[]>([])

    //assess the user data 
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    //access navigator
    const navigate = useNavigate();


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


    //log the user out by clearing local storage 
    const handleLogout = ()=>{
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    }

  return (
    <div>

        {/* navbar */}
        <nav className='navbar'>
        <ul>
            <li><Link to= "/Dashboard">Dashboard</Link></li>
            <li><Link to= "/Profile">Profile</Link></li>
            <li><Link to= "/" onClick={handleLogout}>Logout</Link></li>
        </ul>      
        </nav>

        <div className='dashboard-container'>
        <h1>Dashboard</h1>
        <p>Welcome to your GitHub Repo Explorer dashboard</p>

        <h1>Welcome back {user.email ? `, ${user.email.split("@")[0]}`:""}</h1>


        {/* //display faviorites repos */}
        <h2>Your Favorite Repositories</h2>

        {favorites.length === 0 ? (
        <p>You have no favorites saved yet.</p>
        ) : (
       <ul>
  {favorites.map((repo: any, index: number) => (
    <li key={index} style={{ 
      border: "1px solid #ccc", 
      borderRadius: "6px", 
      padding: "1rem", 
      marginBottom: "1rem", 
      listStyle: "none"
    }}>
      <h3>{repo.repoName}</h3>
      <p><strong>Repo ID:</strong> {repo.repoId}</p>
      <p><strong>Added on:</strong> {new Date(repo.createdAt).toLocaleDateString()}</p>
      <button 
        onClick={() => handleRemove(repo.id)} 
        style={{ backgroundColor: "#dc3545", color: "white", padding: "0.5rem 1rem", border: "none", borderRadius: "4px", cursor: "pointer" }}
      >
        Remove
      </button>
    </li>
  ))}
</ul>

        )}



        </div>
    </div>
  )
}
