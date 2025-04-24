/*
 * Movie DB App Script
 * This script fetches movie data from the Movie DB API and displays it on a web page.
 * It includes functions to fetch movies, display them, and handle user interactions.
 * It follows MVC architecture
 */

// Constants
const NUM_MOVIES_PER_PAGE = 20;
const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMGFjODk0NmYyMGJhZDllYWE0ZWU5OGFhZDkxYTBlNSIsIm5iZiI6MTY5NTc5NDI1OS40OTQwMDAyLCJzdWIiOiI2NTEzYzQ1MzA0OTlmMjAwYWJiY2RiNjMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.B9sk5tEzxU694-hrdT_vfMh9NGTi4GOBFK-9Z1WsvmA";
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

// Model
state = {
    movies : [],
    likedMovies : [],
    filter : "popular",
    page : 1,
    totalPages : 0
}

// Controller

// View
// Get all HTML elements
// Header elements
const headerTabs = document.querySelector(".header-tab");
const headerHome = document.querySelector("#header-home");
const headerLiked = document.querySelector("#header-liked");

// Select Filter
const filterSelect = document.querySelector("#filter-category");

// Pagination elements
const pagination = document.querySelector("#pagination");
const paginationNext = document.querySelector("#next-btn");
const paginationPrev = document.querySelector("#prev-btn");
const pageNumber = document.querySelector("#page-number");

// Movie Container
const moviesContainer = document.querySelector("#movies-container");

headerTabs.addEventListener("click", (e) => {
    if (e.target.id === "header-home") {
        console.log("Home");
    } else if (e.target.id === "header-liked") {
        console.log("Liked");
    }
});

function handleFilter() {
    filterSelect.addEventListener("change", (e) => {
        const selectedFilter = e.target.value;
        state.filter = selectedFilter;
        state.page = 1; // Reset page to 1 when filter changes per requirements
        loadMovieData();
        console.log("Selected filter:", state.filter);
    });
}

function handlePagination() {
    paginationNext.addEventListener("click", () => {
        if (state.page < state.totalPages) {
            state.page++;
            loadMovieData();
        }
    });

    paginationPrev.addEventListener("click", () => {
        if (state.page > 1) {
            state.page--;
            loadMovieData();
        }
    });
}


function loadPagination() {
    pageNumber.innerHTML = `${state.page} / ${state.totalPages}`;
}

function loadMovieData() {
    console.log("Loading movies...");
    console.log(`Current Filter: ${state.filter}`);
    fetch(`https://api.themoviedb.org/3/movie/${state.filter}?language=en-US&page=${state.page}`, options)
        .then(res => res.json())
        .then(res => {
            console.log(res)
            state.movies = res.results;
            state.totalPages = res.total_pages; 
            renderView(); 
        })
    .catch(err => console.error(err));
}



function loadMovies() {

    let moviesHTML = "";
    state.movies.forEach(movie => {
        moviesHTML += `
            <div class="movie-card">
            <div class="movie-card-image">
                <img src="https://image.tmdb.org/t/p/original/${movie.poster_path}" alt="${movie.title}" />
            </div>
            <h4 class="movie-card-title">${movie.title}</h4>
            <div class="movie-card-rating">
                <div class="rating">
                    <i class="icon ion-md-star rating-icon"></i>
                    <span>${movie.vote_average}</span>
                </div>
                <div>
                    <i class="like-icon icon ion-md-heart-empty"></i>
                </div>
            </div>
        </div>
        `;
    });
    moviesContainer.innerHTML = moviesHTML;
}

// For now, every time we render View, we will make an API call to fetch the movies
function renderView() {
    loadPagination();
    loadMovies();
}

function init() {
    loadMovieData();
    handleFilter();
    handlePagination();
}

init();

// Testing

function generateMovieCards() {
    const moviesContainer = document.getElementById('movies-container');
    
    // Clear any existing content
    moviesContainer.innerHTML = '';
    
    // Sample movie titles
    const sampleTitles = [
        "Inception", "The Dark Knight", "Pulp Fiction", "The Godfather",
        "Interstellar", "The Matrix", "Parasite", "Avengers: Endgame",
        "The Lion King", "Fight Club", "Forrest Gump", "Goodfellas",
        "The Shawshank Redemption", "Titanic", "Jurassic Park", 
        "Star Wars", "The Avengers", "Avatar", "Joker", "Toy Story"
    ];
    
    // Sample HTML for 20 cards
    let cardsHTML = '';
    
    for (let i = 0; i < 20; i++) {
        // Generate random rating between 6.0 and 9.5
        const rating = (Math.random() * 3.5 + 6.0).toFixed(1);
        
        cardsHTML += `
        <div class="movie-card">
            <div class="movie-card-image">
                <img src="https://cdn11.bigcommerce.com/s-yzgoj/images/stencil/1280x1280/products/2920525/5964222/MOVAJ2095__61756.1679606794.jpg?c=2" alt="${sampleTitles[i]} Poster">
            </div>
            <h4 class="movie-card-title">${sampleTitles[i]}</h4>
            <div class="movie-card-rating">
                <div class="rating">
                    <i class="ion-ios-infinite-outline"></i>
                    <span>${rating}</span>
                </div>
                <div>
                    <i class="like-icon icon ion-ios-heart-empty"></i>
                </div>
            </div>
        </div>`;
    }
    
    // Add all cards to container
    moviesContainer.innerHTML = cardsHTML;
}

// Call the function to generate cards
//generateMovieCards();
