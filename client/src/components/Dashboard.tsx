import {useEffect,useState} from 'react'
import './Dashboard.css'
import Navbar from './Navbar';
import type { Favorite} from '../types/types.ts';


export default function Dashboard() {



    const [favorites, setFavorites] = useState<Favorite[]>([])
    //search Github username input
    const [searchTerm, setSearchTerm] = useState("");
    //store the list of github repo we get back from the db
    const [repos, setRepo] = useState([]);
    //repo page tracker 
    const [currentPage, setCurrentPage] = useState(1);
    const repoPerPage = 5;

    //fetch repo from github api 
    const handleSearch = async()=>{
      console.log("clicked to search")
      //MAKE sure the user is not earching an empty field
      if(!searchTerm.trim()) return;

      try {
        const response = await fetch(`https://api.github.com/users/${searchTerm}/repos`)

        //if fetch failed
        if(!response.ok){
          throw new Error("Failed to fetch repositories")
        }

        //parse reponse 
        const data = await response.json();
        //set the data in the repo state 
        setRepo(data);
        console.log("repo data:",repos)
        
        //catch errors
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
    };


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

        {/* Github search form */}
        <form className="search-form">
          <input 
          type="text"
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
          placeholder='Search Github username'
          className='search-input'
          />
          <button type='button' onClick={handleSearch}  className='search-button'>
           Search 
          </button >
        </form>

        {/* display the list of the searched user repo */}
          {repos.slice((currentPage - 1)* repoPerPage, currentPage * repoPerPage)
          .map((repo:any)=>(
            <div key={repo.id}>
              <h3>{repo.name}</h3>
              <a href={repo.html_url} target='_blank' rel="noopener noreferrer">View on GitHub </a>
              <button onClick={()=>handleAddToFavorites(repo)}>Add to Favorites</button>
            </div>

          ))}
        
        {/* pagination page control   */}
        <div className='pagination-controls'>
          <button onClick={()=>setCurrentPage((prev)=>Math.max(prev-1,1))}
            disabled = {currentPage === 1}
            >Previous</button>
            <span>Page {currentPage}</span>
            <button onClick = {()=>setCurrentPage((prev)=> prev < Math.ceil(repos.length /repoPerPage)? prev+1: prev)}
            disabled ={currentPage === Math.ceil(repos.length/repoPerPage)}
            >
              Next
            </button>

        </div>


        {/* //display faviorites repos */}
      <div className='my-fav-repos'>
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
    </div>
  )
}
