import { createContext, useState, useEffect, useContext } from 'react';
import './App.css'

const routers = [
  {
    url: '/',
    component: <Home />,
  },
  {
    url: '/movies',
    component: <Movies />,
  },
  {
    url: '/series',
    component: <Series />,
  },
  {
    url: '/bookmarks',
    component: <Bookmarks />,
  },
]

const notFound = {
  component: <NotFound />
}




function getPage(url) {
  return routers.findLast(x => url.startsWith(x.url)) ?? notFound
}


const PageContext = createContext(null);

function App() {
  const [url, setUrl] = useState(location.hash.substring(1) || '/')
  const [data, setData] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState({});


  useEffect(() => {
    window.addEventListener("hashchange", () => {
      setUrl(location.hash.substring(1));
    });
    fetch("/data/data.json")
    .then((response) => response.json())
    .then((data) => setData(data));
  }, []);

  const page = getPage(url)

  const placeholder =
    url === "/movies"
      ? "Search for movies"
      : url === "/series"
      ? "Search for TV series"
      : url === "/bookmarks"
      ? "Search for bookmarked shows"
      : "Search for Movies or TV Series";


  return (
    <div className='container'>
      <header>
        <a href="#/"><img src="/public/img/movie-logo.svg" alt="" /></a>
        <div className='menu'>
          <a href="#/"><img src="/public/img/home-icon.svg" alt="" /></a>
          <a href="#/movies"><img src="/public/img/movies-icon.svg" alt="" /></a>
          <a href="#/series"><img src="/public/img/series-icon.svg" alt="" /></a>
          <a href="#/bookmarks"><img src="/public/img/bookmark.svg" alt="" /></a>
        </div>
        <img src="/public/img/user-icon.svg" alt="" />
      </header>
       <div className='search'>
          <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder={placeholder}/>
       </div>
    <PageContext.Provider value={{data, search, setSelected, selected, bookmarks, setBookmarks}}>
      {page.component}
    </PageContext.Provider>
    </div>
  )
}

function Home() {
  const {data, search, setSelected, selected , bookmarks, setBookmarks}  = useContext(PageContext);

  const filteredData = data.filter((x) =>
    search === "" || x.title.toLowerCase().includes(search.toLowerCase())
  );
  
  function handleClick(movie) {
    if (bookmarks.includes(movie)) {
      setBookmarks(bookmarks.filter(item => item !== movie));
    } else {
      setBookmarks([...bookmarks, movie]);
    }
    setSelected((prev) => ({
      ...prev,
      [movie]: !prev[movie], 
    }));
  }
  return(
    <>
      {search === "" && (
        <>
          <h2>Trending</h2>
          <div className='trend-list'>
            {data
              .filter(x => x.trending)
              .map((x, i) => (
                <div className='trend-card'  key={i}>
                  <img src={x.image} onClick={()=> window.location.href = x.trailer}/>
                  <button onClick={()=> handleClick(x.title)}><img src={
                        selected[x.title] 
                          ? "/public/img/ticket-active-icon.png" 
                          : "/public/img/ticket-icon.png"
                      } className='trend-ticket-img' alt="" /></button>

                  <div className="card-overlay" >
                    <div className='type-info'>
                      <span>{new Date(x.release_date).getFullYear()}</span>
                      <img src={
                        x.type === "movie"
                          ? "/public/img/movies-icon.svg" 
                          : "/public/img/series-icon.svg"
                      } alt="" />
                      <span>{x.type}</span>
                      <span>{x.age_rating.split("-")[0]}</span>
                    </div>
                    <h3>{x.title}</h3>
                  </div>
                </div>

              ))}
          </div>    
        </>    
      )}
      <h2>{search === "" ? 
          "Recommended for you" : 
          `Found ${filteredData.length} result${
            filteredData.length !== 1 ? "s" : ""
          } for '${search}'`
          }
      </h2>
      <div className='card-list'>
        {filteredData
          .map((x, i) => 
          <div className='card' key={i}>
            <img src={x.image} onClick={()=> window.location.href = x.trailer}/>
            <button onClick={()=> handleClick(x.title)}><img src={selected[x.title] ? "/public/img/ticket-active-icon.png" : "/public/img/ticket-icon.png"} className='ticket-img' alt="" /></button>

            <div className="card-text" >
              <div className="card-context" >
              <span>{new Date(x.release_date).getFullYear()}</span>
              {x.type === 'movie' ? 
              (
                <div>
                  <img src="/public/img/movies-icon.svg" alt="" />
                  <span>{x.type}</span>
                </div>
              ) : (
                <div>
                  <img src="/public/img/series-icon.svg" alt="" />
                  <span>{x.type}</span>
                </div>
              )}
              <span>{x.age_rating.split('-')[0]}</span>
              </div>  
              <h3>{x.title}</h3>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
function Movies() {
  const { data, search } = useContext(PageContext);

  const filteredData = data.filter((x) =>
    search === "" || x.title.toLowerCase().includes(search.toLowerCase())
  );
  return(
    <>
      <h2>{search === "" ? 
          "Movies" : 
          `Found ${filteredData.length} result${
            filteredData.length !== 1 ? "s" : ""
          } for '${search}'`
          }
      </h2>
      <div className='movies'>
      {filteredData
        .filter(x => x.type === "movie")
        .map((x,i) => 
          <div className='card' key={i}>
            <img src={x.image}  onClick={()=> window.location.href = x.trailer}/>
            <div className="card-text">
              <div className="card-context">
              <span>{new Date(x.release_date).getFullYear()}</span>
              {x.type === 'movie' ? 
              (
                <div>
                  <img src="/public/img/movies-icon.svg" alt="" />
                  <span>{x.type}</span>
                </div>
              ) : (
                <div>
                  <img src="/public/img/series-icon.svg" alt="" />
                  <span>{x.type}</span>
                </div>
              )}
              <span>{x.age_rating.split('-')[0]}</span>
              </div>  
              <h3>{x.title}</h3>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
function Series() {
  const { data, search } = useContext(PageContext);

  const filteredData = data.filter((x) =>
    search === "" || x.title.toLowerCase().includes(search.toLowerCase())
  );
  return(
    <>
      <h2>{search === "" ? 
          "TV Series" : 
          `Found ${filteredData.length} result${
            filteredData.length !== 1 ? "s" : ""
          } for '${search}'`
          }
      </h2>
      <div className='series'>
      {filteredData
        .filter(x => x.type === "series")
        .map((x,i) => 
          <div className='card' key={i}>
            <img src={x.image} onClick={()=> window.location.href = x.trailer}/>
            <div className="card-text">
              <div className="card-context">
              <span>{new Date(x.release_date).getFullYear()}</span>
              {x.type === 'movie' ? 
              (
                <div>
                  <img src="/public/img/movies-icon.svg" alt="" />
                  <span>{x.type}</span>
                </div>
              ) : (
                <div>
                  <img src="/public/img/series-icon.svg" alt="" />
                  <span>{x.type}</span>
                </div>
              )}
              <span>{x.age_rating.split('-')[0]}</span>
              </div>  
              <h3>{x.title}</h3>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
function Bookmarks() {
  const {data, bookmarks, search} = useContext(PageContext);

  const bookmarkedMovies = data.filter(movie => bookmarks.includes(movie.title));
  return(
    <>
     <h2>{search === "" ? 
          "Bookmarks" : 
          `Found ${bookmarkedMovies.length} result${
            bookmarkedMovies.length !== 1 ? "s" : ""
          } for '${search}'`
          }
      </h2>
      <div className='bookmarked-list'>
        {bookmarkedMovies.length === 0 ? (
          <p>No bookmarked movies yet.</p> 
        ) : (
          bookmarkedMovies.map((movie, i) => (
            <div className='card' key={i}>
              <img src={movie.image} alt="" onClick={()=> window.location.href = x.trailer} />
              <div className="card-text">
                <div className="card-context">
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                  <div>
                    <img
                      src={movie.type === 'movie' ? "/public/img/movies-icon.svg" : "/public/img/series-icon.svg"}
                      alt={movie.type}
                    />
                    <span>{movie.type}</span>
                  </div>
                  <span>{movie.age_rating.split('-')[0]}</span>
                </div>  
                <h3>{movie.title}</h3>
              </div>
            </div>
          ))
        )}
      </div>

    </>
  )
}
function NotFound(){
  return(
    <></>
  )
}







export default App
