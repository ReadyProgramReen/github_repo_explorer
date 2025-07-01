import {useEffect,useState} from 'react'
 
import './Dashboard.css'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


export default function Dashboard() {
    const [favorites, setFavorites] = useState([])

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
            <li key={index}>{repo.repoName}</li>
            ))}
        </ul>
        )}



        </div>
    </div>
  )
}
