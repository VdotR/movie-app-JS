/*
 * Movie DB App Script
 * This script fetches movie data from the Movie DB API and displays it on a web page.
 * It includes functions to fetch movies, display them, and handle user interactions.
 * It follows MVC architecture
 */

// Constants
// const NUM_MOVIES_PER_PAGE = 20;
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
    totalPages : 0,
    tab: "home",
    // displayDetails: false,
    movieDetails: {}
}

// Controller
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

function loadMovieDetails(movieId) {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options)
    .then(res => res.json())
    .then(res => {
        console.log(res);
        enableBackDrop();
        state.movieDetails.poster_path = res.poster_path;
        state.movieDetails.title = res.title;
        state.movieDetails.overview = res.overview;
        state.movieDetails.genres = res.genres.map(genre => genre.name);
        state.movieDetails.vote_average = res.vote_average;
        state.movieDetails.production_companies = res.production_companies.map(company => company.logo_path)
        console.log(state.movieDetails);
        renderMovieDetails();
    })
    .catch(err => console.error(err));
}


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

// Movie Details
const backDrop = document.querySelector(".backdrop");
const movieDetailsContainer = document.querySelector(".movie-detail");
const closeBtn = document.querySelector(".close-btn");

function isBackDropEnabled() {
    return !backDrop.classList.contains("hidden");
}

function enableBackDrop() {
    backDrop.classList.remove("hidden");
}

function disableBackDrop() {
    backDrop.classList.add("hidden");
    renderMovieDetails(); // Clear the backdrop content
}

function handleHeader() {
    headerTabs.addEventListener("click", (e) => {
        if (e.target.id === "header-home") {
            state.tab = "home";
            
            // Reset selected-tab
            headerHome.classList.add("selected-tab");
            headerLiked.classList.remove("selected-tab");

            loadMovieData(); 
        } else if (e.target.id === "header-liked") {
            state.tab = "like";

            // Reset selected-tab
            headerLiked.classList.add("selected-tab");
            headerHome.classList.remove("selected-tab");
            renderView(); // Just need to render the view, no API call required
        }
    });
}

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

function handleBackDrop() {
    backDrop.addEventListener("click", (e) => {
        if (e.target.classList.contains("close-btn")) {
            console.log("Close button clicked");
            disableBackDrop();
        }
    });
}


function renderPagination() {
    pageNumber.innerHTML = `${state.page} / ${state.totalPages}`;
}


function checkMovieLikeStatus(movieId) {
    return state.likedMovies.find(movie => Number(movie.id) === Number(movieId)) ? true : false;
}

function makeMovieCard(movie) {
    return `<div class="movie-card" id="${movie.id}">
                <div class="movie-card-image">
                    <img src="https://image.tmdb.org/t/p/original/${movie.poster_path}" alt="${movie.title}" />
                </div>
                <h4 class="movie-card-title">${movie.title}</h4>
                <div class="movie-card-rating">
                    <div class="rating">
                        <i class="ion-ios-star"></i>
                        <span>${movie.vote_average}</span>
                    </div>
                    <div class="like-section">
                        <i class="like-icon ${checkMovieLikeStatus(movie.id) ? 'ion-ios-heart' : 'ion-ios-heart-outline'}"></i>
                    </div>
                </div>
            </div>`
}

function renderMovies() {
    let moviesHTML = "";
    if (state.tab === "home") {
        state.movies.forEach(movie => {
            moviesHTML += makeMovieCard(movie);
        });
    } else if (state.tab === "like") {
        state.likedMovies.forEach(movie => {
            moviesHTML += makeMovieCard(movie);
        });
    }
    
    moviesContainer.innerHTML = moviesHTML;
}

function makeMovieDetailGenresList(genres) {
}
function renderMovieDetails() {
    if (isBackDropEnabled()) {
        const movieDetailsHTML = `
            <button class="close-btn">x</button>
            <div class="movie-detail-info">
                <div class="movie-detail-poster">
                    <img src="https://image.tmdb.org/t/p/original/${state.movieDetails.poster_path}" alt="${state.movieDetails.title}" />
                </div>  
                <div class="movie-detail-nonposter">
                    <h2 class> ${state.movieDetails.title} </h2>
                    <div class="movie-detail-overview">
                        <h3>Overview</h3>
                        <p>${state.movieDetails.overview}</p>
                    </div>
                    <div class="movie-detail-genre-container">
                        <h3>Genres</h3>
                        <ul class="movie-detail-genres-list">
                            ${state.movieDetails.genres.map(genre => `<li class="movie-detail-genre">${genre}</li>`).join("\n")} 
                        </ul>
                    </div>
                    <div class="movie-detail-rating">
                        <h3>Rating</h3>
                        <i class="ion-ios-star"></i>
                        <span>${state.movieDetails.vote_average}</span>
                    </div>
                    <div class="production-companies">
                        <h3> Production Companies </h3>
                        <ul class="production-companies-list">
                            ${state.movieDetails.production_companies.map(company => `<li class="production-company"><img src="https://image.tmdb.org/t/p/original/${company}"/></li>`).join("\n")}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        movieDetailsContainer.innerHTML = movieDetailsHTML;
    } else {
        movieDetailsContainer.innerHTML = "";
    }
} 

function handleMovieContainer() {
    moviesContainer.addEventListener("click", (e) => {
        console.log("e.target: ", e.target);
        if (e.target.classList.contains("like-icon")) {
            const movieCard = e.target.closest(".movie-card");
            const movieId = movieCard.id;
            
            // Logic to handle unlike
            if (checkMovieLikeStatus(movieId)) {
                // Remove from liked movies
                state.likedMovies = state.likedMovies.filter(movie => Number(movie.id) !== Number(movieId));
                e.target.classList.remove("ion-ios-heart");
                e.target.classList.add("ion-ios-heart-outline");
            } 
            // Logic to handle like
            else {
                const movieTitle = movieCard.querySelector(".movie-card-title").innerText;
                const movieRating = movieCard.querySelector(".movie-card-rating span").innerText;
                const moviePoster = movieCard.querySelector(".movie-card-image img").src;

                // Add to liked movies
                state.likedMovies.push({
                    id: movieCard.id,
                    title: movieTitle,
                    vote_average: movieRating,
                    poster_path: moviePoster
                });
            }
            
            renderView(); // Re-render the view to show the updated liked movies
        }
        else if (e.target.classList.contains("movie-card-title")){
            const movieCard = e.target.closest(".movie-card");
            const movieId = movieCard.id;
            console.log("Clicked on title of Movie ID: ", movieId);
            // Logic to handle movie card title click
            // Load movie details
            loadMovieDetails(movieId);
        }
    });
}

// For now, every time we render View, we will make an API call to fetch the movies
function renderView() {
    renderPagination();
    renderMovies();
}

function init() {
    loadMovieData();
    handleHeader();
    handleFilter();
    handlePagination();
    handleMovieContainer();
    handleBackDrop();
}
//console.log(loadMovieDetails(950387))
init();

