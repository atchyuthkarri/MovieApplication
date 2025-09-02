const API_KEY = "1b43baa4"; // Your OMDb API Key
const SEARCH_API = `https://www.omdbapi.com/?apikey=${API_KEY}&s=`;

// DOM elements
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

// Color ratings based on IMDb rating
const getClassByRate = (vote) => {
  if (!vote || vote === "N/A") return "red";
  const rating = parseFloat(vote);
  if (rating >= 7.5) return "green";
  else if (rating >= 5) return "orange";
  else return "red";
};

// Display movies on the page
const showMovies = (movies) => {
  main.innerHTML = "";

  if (!movies || movies.length === 0) {
    main.innerHTML = "<p style='color:white; text-align:center;'>No movies found.</p>";
    return;
  }

  movies.forEach((movie) => {
    const { Title, Poster, imdbID } = movie;

    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");

    // Fetch movie details for rating & plot
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`)
      .then((res) => res.json())
      .then((data) => {
        const { imdbRating, Plot } = data;

        movieElement.innerHTML = `
          <img src="${Poster !== "N/A" ? Poster : 'https://via.placeholder.com/300x450'}" alt="${Title}" />
          <div class="movie-info">
            <h3>${Title}</h3>
            <span class="${getClassByRate(imdbRating)}">${imdbRating}</span>
          </div>
          <div class="overview">
            <h3>Overview</h3>
            ${Plot !== "N/A" ? Plot : "No overview available."}
          </div>
        `;

        main.appendChild(movieElement);
      });
  });
};

// Fetch movies by search term
const getMovies = async (searchTerm) => {
  try {
    const res = await fetch(SEARCH_API + encodeURIComponent(searchTerm));
    const data = await res.json();
    showMovies(data.Search);
  } catch (err) {
    main.innerHTML = "<p style='color:white; text-align:center;'>Failed to load movies. Try again later.</p>";
    console.error(err);
  }
};

// Default movies (popular movies are not provided by OMDb, so we can show "Batman")
getMovies("Batman");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  if (searchTerm && searchTerm !== "") {
    getMovies(searchTerm);
    search.value = "";
  }
});