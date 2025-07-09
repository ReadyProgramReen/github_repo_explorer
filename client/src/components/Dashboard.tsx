import {useEffect,useState} from 'react'
import './Dashboard.css'
import Navbar from './Navbar';
import type { Favorite} from '../types/types.ts';


export default function Dashboard() {



    const [favorites, setFavorites] = useState<Favorite[]>([])
    //search Github username input
    const [searchTerm, setSearchTerm] = useState("");
    //Track loading state
    const [loading, setLoading] = useState(false)
    //store the list of github repo we get back from the db
    const [repos, setRepo] = useState([]);
    //search repo page tracker for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const repoPerPage = 5;
    //favorite repo page tracker for pagimation
    const [favoriteCurrentPage, setFavoriteCurrentPage]= useState(1);
    const favoritesPerPage  = 5
    //UI message 
    const [feedbackMessage, setFeedbackMessage] = useState("");


    //fetch repo from github api 
    const handleSearch = async()=>{
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
        // console.log("repo data:",repos)
        
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
                // console.log("data:",data);

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

  //add a new favorite repo from search github api results
  const handleAddToFavorites = async(repo:any)=>{
    
    try {
      //get access to token
      const token = localStorage.getItem("token");

      //if token doesnt exist , throw error
      if(!token){
        console.error("No token found, User might not be logged in .")
        return;
      }
      
      //chekc if repo already exits in favorite db 
      const alreadyAdded = favorites.some(fav=>(
        fav.repoId === repo.full_name
      ));

      //log that the repo already exist in favorites
      if(alreadyAdded){
        console.log("This repository is already in your favorites");
        return ;
      }

      //turn loading tracker on so user knows to wait for data
      setLoading(true);
      //POST req " add new fav"
      const response = await fetch("http://localhost:9000/favorite",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization : `Bearer ${token}` ,
        },
        body:JSON.stringify({
          repoId: repo.full_name,
          repoName : repo.name,
          htmlUrl:repo.html_url,
        })
      })

      //toggle loading status off since fetch is completed (either with an error or a successful)
      setLoading(false)

      //check if data was ok in http object
      if(!response.ok){
        throw new Error("Failed to add favorite");
      }

       //store the new fav in object
    const newFavorite = {
      repoId: repo.full_name,
      repoName: repo.name,
      htmlUrl:repo.html_url,
      id: crypto.randomUUID(),
      userId: user?.id,         
      createdAt: new Date().toISOString()
    }

    setFavorites((prev)=>[newFavorite,...prev])


    //clear the list of repo that is displayed in the ui
    setRepo([]);

    
      //log successful add
      console.log("Favorite added successfully:",newFavorite,);
      setFeedbackMessage("Favorite Added Successfully")
      setTimeout(() => setFeedbackMessage(""), 3000);


     
      
    } catch (error) {
      console.error("Error adding favorite:", error)
      setFeedbackMessage("Failed to add repository")
      setTimeout(() => setFeedbackMessage(""), 3000);

      
    } 

  }



  return (
    <div>

        {/* navbar */}
        <Navbar/>

        <div className='dashboard-container'>
        <div className="dashboard-header">
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Welcome to your GitHub Repo Explorer dashboard</p>
            
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

        {/*Show loding message then show the Feedback message */}
{loading ? <p>Loading.....</p> :  feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}

        {/* display the list of the searched user repo */}
          {repos.slice((currentPage - 1)* repoPerPage, currentPage * repoPerPage)
          .map((repo:any)=>(
            <div key={repo.id}>
              <h3>{repo.name}</h3>
              <a href={repo.html_url} target='_blank' rel="noopener noreferrer">View on GitHub </a>
              <button onClick={()=>handleAddToFavorites(repo)}>Add to Favorites</button>
            </div>

          ))}
        
        {/* pagination page control for search*/}
        {repos.length>0 &&
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
        }

        {/* //display faviorites repos */}
      <div className='my-fav-repos'>
        <h2>Your Favorite Repositories</h2>

        {favorites.length === 0 ? (
        <p>You have no favorites saved yet.</p>
        ) : (

    <>
       <ul className='repo-list'>
    {favorites.slice((favoriteCurrentPage-1)* favoritesPerPage,favoriteCurrentPage * favoritesPerPage )
    .map((repo: any) => (
    <li key={repo.id} className="repo-item">
      <div><a href={repo.htmlUrl}
        target="_blank"
        rel="noopener noreferrer"
        >
        <p className="repo-name">{repo.repoName}</p>
        <p className="repo-id">{repo.repoId}</p>
        </a>
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

        {/* pagination page control  for favorites*/}
      {favorites.length > 5 &&
        <div className='pagination-controls'>
          <button onClick={()=>setFavoriteCurrentPage((prev)=>Math.max(prev-1,1))}
            disabled = {favoriteCurrentPage === 1}
            >Previous</button>
            <span>Page {favoriteCurrentPage}</span>
            <button onClick = {()=>setFavoriteCurrentPage((prev)=> prev < Math.ceil(favorites.length /favoritesPerPage)? prev+1: prev)}
            disabled ={favoriteCurrentPage === Math.ceil(favorites.length/favoritesPerPage)}
            >
              Next
            </button>

        </div>
      }  
</>

  )}

      </div>




        </div>
    </div>
  )
}
