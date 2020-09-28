$(document).ready(function() {
    const baseurl = 'https://copper-cypress-bakery.glitch.me/movies';
    let localMovies = [];
    /** DATABASE SEED-EMPTY FUNCTIONS **/
        // SEED DATA TO GET FROM OMDB FOR DATABASE
    const seedList = [
        "American Psycho ",
        "Battle Royale",
        "Final Destination",
        "Crouching Tiger, Hidden Dragon",
        "Frequency",
        "Ginger Snaps",
        "Gladiator",
        "Road Trip",
        "X-Men",
        "The Cell",
        "Vanilla Sky",
        "Minority Report",
        "Crazy Rich Asians",
        "Girls Trip",
        "Trading Places",
        "Galaxy Quest",
        "Bridesmaids",
        "Happy Gilmore",
        "Step Brothers",
        "High Fidelity",
        "Napoleon Dynamite",
        "Three Amigos",
        "Blazing Saddles",
        "The Big Lebowski",
        "Gremlins",
        "The Naked Gun",
        "Airplane!",
        "This Is Spinal Tap",
        "Groundhog Day",
        "Get Out",
        "The Shining",
        "Saw",
        "The Witch",
        "The Babadook",
        "Carrie",
        "The Descent",
        "Hellraiser",
        "Scream",
        "The Goonies",
        "THE GREATEST SHOWMAN",
        "Moana",
        "DADDY DAY CARE",
        "Stand by Me",
        "Toy Story",
        "The Karate Kid",
        "Aladdin",
        "The Hunger Games",
        "Finding Nemo",
        "Home Alone",
        "Frozen",
        "The Terminator",
        "Apocalypse Now",
        "The Matrix",
        "Gladiator",
        "Die Hard",
        "Avengers Endgame",
        "Skyfall",
        "Iron Man",
        "300",
        "Speed",
        "Independence Day"
    ];

    const genres = [
        "Action",
        "Adventure",
        "Comedy",
        "Crime",
        "Drama",
        "Family",
        "Fantasy",
        "Historical",
        "Historical fiction",
        "Horror",
        "Magical realism",
        "Mystery",
        "Paranoid fiction",
        "Philosophical",
        "Political",
        "Romance",
        "Saga",
        "Satire",
        "Science fiction",
        "Social",
        "Speculative",
        "Thriller",
        "Urban",
        "Western",
        "Animation",
        "Video game",
        "Music"
    ];
    genres.sort();
    for (let genre of genres) {
        $("#genreSearchInput").append(`<option value="${genre}">${genre}</option>`);
    }
    $("#genreSearchInput").addClass("d-none");

    // MAKE REQUEST FROM OMDB API
    const getOmdb = (movie) => {
        const url = `http://www.omdbapi.com/?t=${movie}&apikey=${OMDbkey}&`
        return fetch(url)
            .then(response => response.json())
            .then(movieData => {
                return movieData;
            })
            .catch(error => console.log(error));
    }

    // SEED DATA WHEN NEEDED
    const seedData = () => {
        for (let movie of seedList) {
            getOmdb(movie).then((data) => {
                console.log("ombd", data)
                let newMovie = {
                    imdb: data.imdbID,
                    title: data.Title,
                    year: data.Year,
                    rated: data.Rated,
                    released: data.Released,
                    runtime: parseInt(data.Runtime),
                    genre: data.Genre.split(", "),
                    plot: data.Plot,
                    language: data.Language.split(", "),
                    poster: data.Poster,
                    rating: parseFloat(data.Ratings[0].Value.split("/")[0]),
                    director: data.Director,
                    actors: data.Actors
                }
                getYifyData(newMovie.imdb).then( (ytlink) => {
                    newMovie.trailer = ytlink;
                    createMovie(newMovie);
                });
                

            });
        }
    }

    // DELETES ALL THE MOVIES FROM OUR DATABASE
    const deleteAll = () => {
        fetch(baseurl)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            })
            .then((data) => {
                console.log("deleting data", data);
                for (let movie of data) {
                    deleteMovie(movie.id);
                }
                getDatabase();
            })
            .catch((error) => {
                console.warn("error", error);
            });
    }
    /** END DATABASE SEED-EMPTY COMMANDS **/

    /** GET MOVIES FROM DATABASE REQUESTS**/
        // SERVER REQUEST TO GET ALL MOVIES FROM DATABASE
    const getDatabase = () => {
            $("#database-list").html(loader);
            fetch(baseurl)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    return Promise.reject(response);
                })
                .then((data) => {
                    console.log("success");
                    localMovies = data;
                    $("#database-list").html("")
                    for (let movie of localMovies) {
                        createMovieCard(movie);
                    }
                })
                .catch((error) => {
                    console.warn("error", error);
                });
        }

    // SERVER REQUEST TO GET SPECIFIC MOVIE FROM DATABASE
    const getMovie = (id) => {
        return fetch(baseurl)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            })
            .then((data) => {
                for (let movie of data) {
                    if (movie.id == id) {
                        return movie;
                    }
                }
                console.log("success");
            })
            .catch((error) => {
                console.warn("error", error);
            });
    }
    /** END GET MOVIES REQUEST **/

    /** HELPER FUNCTIONS **/
        // DYNAMIC MOVIE CARD CREATED FROM MOVIE DATA
    const createMovieCard = (movie) => {
        $('#database-list').append(`
            <div class="card menu-view shadow-lg grow">
                <img class="card-img-top" src="${movie.poster}" alt="Card image cap" style="height:27rem">
                <iframe id="${movie.trailer}" 
                class="card-img-top d-none"
                src="" 
                name="youtube embed" allow="autoplay; encrypted-media" 
                allowfullscreen
                frameborder="0"
                ></iframe>

                <div class="card-body">
                    <div id="${movie.id}" class="list-group-item d-flex justify-content-between px-0">
                   
                        <h5 class="card-title">${movie.title}</h5>
                        <div class="hidden-list d-none float-right">
                            <button class="badge badge-pill badge-info editbtn  mx-1">Edit</button>
                            <button class="badge badge-pill badge-danger deletebtn  mx-1">Delete</button>
                            <button class="btn bg-transparent" data-dismiss="modal" aria-label="Close">
                            <i class="fas fa-chevron-down text-white"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-plots card-plot mb-2">
                        <p class="my-2 card-text ">
                            ${movie.plot.length <= 136 ? movie.plot : movie.plot.slice(0, 136) + "..."}
                        </p>
                    </div>
                    <p class="my-2 card-text card-plot-expanded d-none">${movie.plot}</p>
                    <div class="sub-content">
                        <ul class="list-inline">
                            <li class="list-inline-item movie-ratings">
                               <i class="fas fa-star"></i> <span class="rating-stars">${(movie.rating / 2).toFixed(1)}</span> 
                            </li>
                            <li class="list-inline-item sub-info"><i class="far fa-clock"></i> ${movie.runtime} min</li>
                            <li class="list-inline-item sub-info">${movie.year}</li>
                            <li class="list-inline-item sub-info"><span class="badge badge-dark">${movie.rated}</span></li>
                        </ul>
                        <div class="hidden-list list-group d-none">
                            <div class="list-group-item"><h5>Released:</h5><span class="sub-info"> ${movie.released}</span></div>
                            <hr>
                            <div class="list-group-item"><h5>Genre:</h5><span class="sub-info"> ${movie.genre}</span></div>
                            <hr>
                            <div class="list-group-item"><h5>Director:</h5><span class="sub-info"> ${movie.director}</span></div>
                            <hr>
                            <div class="list-group-item"><h5>Actors:</h5><span class="sub-info"> ${movie.actors}</span></div>
                            <hr>
                            <div class="list-group-item"><h5>Language:</h5><span class="sub-info"> ${movie.language}</span></div>                
                            
                        </div>
                    </div>   
                </div> 
            </div>
        `);
        }
    // CREATES A MOVIE OBJECT BASED ON FORM INPUTS
    const setMovieObj = () => {
        return {
            title: $("#title").val(),
            year: $("#year").val(),
            rated: $("#rated").val(),
            released: $("#released").val(),
            runtime: $("#runtime").val(),
            genre: $("#genre").val(),
            plot: $("#plot").val(),
            language: $("#language").val(),
            poster: $("#poster").val(),
            rating: $("#rating").val(),
            director: $("#director").val(),
            actors: $("#actors").val(),
            trailer: $("#youTubeCode").val()
        }
    }

    // LOADING SCREEN SPINNER
    const loader = `
        <div class="loader">
            <div class="d-flex justify-content-center">
                <div class="spinner-border text-light" role="status">
                <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    `

    $("#addMovieBtn").hover(
        function () {
            $(this).popover('toggle');
        },
        function () {
            $(this).popover('toggle');
        }
    )

    /** END HELPER FUNCTIONS**/

    /** CRUD - CREATE, READ, UPDATE, DELETE **/
        // CRUD CREATE A MOVIE ON DATABASE
    const createMovie = (movie) => {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movie),
            };
            fetch(baseurl, options)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    return Promise.reject(response);
                })
                .then(() => {
                    console.log("success");
                    getDatabase();
                })
                .catch((error) => {
                    console.warn("error", error);
                });
        }

    // CRUD DELETE MOVIE FROM DATABASE
    const deleteMovie = (id) => {
        let url = `${baseurl}/${id}`;
        fetch(url, {method: "DELETE"}).then(() => getDatabase());
    }

    // CRUD UPDATE MOVIE ON DATABASE
    const updateMovie = (id) => {
        const url = `${baseurl}/${id}`;
        const movie = setMovieObj()
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movie),
        };
        fetch(url, options)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            })
            .then((data) => {
                console.log("success");
                $("#formModal").modal("toggle");
                getDatabase();
            })
            .catch((error) => {
                console.warn("error", error);
            });
    }
    /** END CRUD **/


    /** FORM SPECIFIC VARS AND FUNCTIONS **/
        // FORM: RENDER THE MOVIE FORM FROM CALLBACK
    const loadCreateForm = () => {
            return fetch("_form.html")
                .then((response) => {
                    if (response.ok) {
                        return response.text();
                    }
                    return Promise.reject(response);
                })
                .catch((error) => {
                    console.warn("error", error);
                });
        }

    // FORM: CREATES THE SELECT VALUES FOR YEARS
    const yearsSelect = () => {
        let current = (new Date()).getFullYear();
        for (current; current >= 1900; current--) {
            $("#year").append(`<option value="${current}">${current}</option>`)
        }
    }

    // FORM: CREATES THE SELECT VALUES FOR GENRE
    const genreSelect = () => {
        for (let genre of genres) {
            $("#genre").append(`<option value="${genre}">${genre}</option>`);
        }
    }

    // FORM: CREATES THE SELECT VALUES FOR LANGUAGES
    const languageSelect = () => {
        const langs = [
            "English",
            "Spanish",
            "Mandarin",
            "Arabic",
            "Hindi",
            "Russian",
            "Japanese",
            "Bengali",
            "Indonesian"
        ]
        for (let lang of langs) {
            $("#language").append(`<option value="${lang}">${lang}</option>`)
        }
    }
    // FORM: SHOW CURRENT VALUE OF RATING SLIDER
    $(document).on("change", "#rating", function () {
        $("#currentRating").html($("#rating").val());
    })

    // FORM: SET THE INPUT SELECT VALUES FOR THE FORM
    const setSelectValues = () => {
        loadCreateForm().then(html => {
            $("#modalForm").html(html);
            yearsSelect();
            genreSelect();
            languageSelect();
        })
    }
    // FORM: UPDATES THE EDIT FORM VALUES TO THOSE OF THE CURRENT MOVIE
    const updateFormValues = (movie) => {
        $('input[name="currId"]').attr('value', movie.id);
        $("#title").val(movie.title);
        $("#year").val(movie.year);
        $("#rated").val(movie.rated);
        $("#released").val(movie.released);
        $("#runtime").val(movie.runtime);
        $("#genre").val(movie.genre);
        $("#plot").val(movie.plot);
        $("#language").val(movie.language);
        $("#poster").val(movie.poster);
        $("#rating").val(movie.rating);
        $("#director").val(movie.director);
        $("#actors").val(movie.actors);
        $("#youTubeCode").val(movie.trailer);
    }
    /** END FORM **/


    /** ONCLICK EVENTS **/
    // NEW MOVIE BUTTON ON CLICK DISPLAY THE CREATE MOVIE FORM MODAL
    $("#addMovieBtn").click(function () {
        setSelectValues();
        $('#formModalLongTitle').html("Add Movie");
        $("#formModal").modal("toggle");
    })

    // DELETE MOVIE BUTTON ON CLICK DISPLAY CONFIRM DELETE
    $(document).on('click', '.deletebtn', function () {
        $("#expandedModal").modal("toggle");
        const id = $(this).parent().parent()[0].id;
        const deleteTitle = $(this).parent().parent().children(".card-title").text();
        $("#deleteMovieModalLabel").html(deleteTitle);
        $("#deleteMovieModal").modal("toggle");
        // IF USER CLICKS CONFIRM DELETE, DELETE MOVIE
        $(".confirm-delete").click(function () {
            deleteMovie(id);
            $("#deleteMovieModal").modal("toggle");
        })
    });

    // EDIT MOVIE BUTTON ON CLICK DISPLAY THE UPDATE MOVIE FORM
    $(document).on('click', '.editbtn', function () {
        $("#expandedModal").modal("toggle");
        const id = $(this).parent().parent()[0].id;
        const updateTitle = $(this).parent().parent().children(".card-title").text();

        setSelectValues();
        getMovie(id).then(movie => {
            updateFormValues(movie);
            $('#createMovie').attr("id", "updateMovie");
            $('#formModalLongTitle').html(`Edit ${updateTitle}`);
        });
        setTimeout(() => {
            $("#formModal").modal("toggle");
        }, 200);
    });

    //EXPANDS MODAL INFORMATION
    $(document).on('click', '.menu-view', function () {
        let info = $(this).html();
        let expandedContent = $('#expandedContent');
        expandedContent.html(info);
        expandedContent.children("iframe").attr("src",`https://www.youtube.com/embed/${expandedContent.children("iframe")[0].id}?rel=0&modestbranding=1&autohide=1&showinfo=0&autoplay=1&mute=1`)
        expandedContent.children(".card-img-top").toggleClass("d-none");
        expandedContent.children(".card-body").children().first().children(".hidden-list").toggleClass("d-none");
        expandedContent.children(".card-body").children(".sub-content").children(".hidden-list").toggleClass("d-none");
        expandedContent.children(".card-body").children(".card-plot").toggleClass("d-none");
        expandedContent.children(".card-body").children(".card-plot-expanded").toggleClass("d-none");
        $('#expandedModal').modal("toggle");
    })

    $('#expandedModal').on('hidden.bs.modal', function () {
        $('#expandedContent').empty();
    })

    /** END ONCLICK **/


    /** ONSUBMIT EVENTS **/
    // CREATE MOVIE FORM ON SUBMIT
    $(document).on("submit", "#createMovie", function (event) {
        event.preventDefault();
        const movie = setMovieObj();
        createMovie(movie);
        $("#formModal").modal("toggle");
    });

    // EDIT MOVIE FORM ON SUBMIT
    $(document).on("submit", "#updateMovie", function (event) {
        event.preventDefault();
        const id = $('input[name="currId"]').val();
        updateMovie(id);
    });
    // SEARCH FORM ON SUBMIT
    $("#searchForm").on("submit", function (event) {
        event.preventDefault();
        movieSearch($("#searchField").val())
    })
    // SEARCH FORM SUBMITS ON KEYUP
    $("#searchField").on("keyup", function () {
        movieSearch($("#searchField").val());
    })
    $("#ratingSearchInput").on("change", function () {
        movieSearch($("#ratingSearchInput").val());
    })
    $("#genreSearchInput").on("change", function () {
        movieSearch($("#genreSearchInput").val());
    })
    /** END ONSUBMIT **/

    /** SEARCH FEATURE SECTION **/
        // SEARCH DATABASE
    const movieSearch = (searchInput) => {
            $("#database-list").html(loader);
            let movies = localMovies.filter((movie) => {
                if ($("#radioTitle").is(":checked")) {
                    if (movie.title.toLowerCase().includes(searchInput.toLowerCase())) {
                        return movie;
                    }
                }
                if ($("#radioGenre").is(":checked")) {
                    searchInput = $("#genreSearchInput").val();
                    for (let g of movie.genre) {
                        if (g.toLowerCase().includes(searchInput.toLowerCase())) {
                            return movie;
                        }
                    }
                }
                if ($("#radioRating").is(":checked")) {
                    searchInput = $("#ratingSearchInput").val();
                    if ((movie.rating / 2) >= parseInt(searchInput) && (movie.rating / 2) < (parseInt(searchInput) + 1)) {
                        return movie;
                    }
                }
            })
            $("#database-list").html("")
            if (movies.length > 0) {
                for (let movie of movies) {
                    createMovieCard(movie);
                }
            } else {
                $("#database-list").html("<h2 class='text-white'>No Movies Match Your Criteria</h2>")
            }

        }

    // SWAP SEARCH INPUT BASED ON RADIO BUTTON
    $("#radioRating").click(function () {
        if ($("#ratingSearchInput").hasClass("d-none")) {
            $("#ratingSearchInput").removeClass("d-none");
            if (!$("#searchField").hasClass("d-none")) {
                $("#searchField").addClass("d-none");
            }
            if (!$("#genreSearchInput").hasClass("d-none")) {
                $("#genreSearchInput").addClass("d-none");
            }
        }
    })
    // SWAP SEARCH INPUT BASED ON RADIO BUTTON
    $("#radioTitle").click(function () {
        if ($("#searchField").hasClass("d-none")) {
            $("#searchField").removeClass("d-none");
            getDatabase();
            if (!$("#ratingSearchInput").hasClass("d-none")) {
                $("#ratingSearchInput").addClass("d-none");
            }
            if (!$("#genreSearchInput").hasClass("d-none")) {
                $("#genreSearchInput").addClass("d-none");
            }
        }
    })

    // SWAP SEARCH INPUT BASED ON RADIO BUTTON
    $("#radioGenre").click(function () {
        if ($("#genreSearchInput").hasClass("d-none")) {
            $("#genreSearchInput").removeClass("d-none");
            if (!$("#ratingSearchInput").hasClass("d-none")) {
                $("#ratingSearchInput").addClass("d-none");
            }
            if (!$("#searchField").hasClass("d-none")) {
                $("#searchField").addClass("d-none");
            }
            ;
        }
    })
    /** END SEARCH FEATURE **/


    /** SORT FILTER **/

        // TITLE A-Z
    const titleAsc = () => {
            localMovies.sort((a, b) => (a.title > b.title) ? 1 : -1);
            $("#database-list").empty();
            for (let movie of localMovies) {
                createMovieCard(movie);
            }
        }

    $('#titleAZ').click(titleAsc);

    const titleDesc = () => {
        localMovies.sort((a, b) => (a.title < b.title) ? 1 : -1);
        $("#database-list").empty();
        for (let movie of localMovies) {
            createMovieCard(movie);
        }
    }

    $('#titleZA').click(titleDesc);

    // YEAR ASC
    const yearAsc = () => {
        localMovies.sort((a, b) => (a.year > b.year) ? 1 : -1);
        $("#database-list").empty();
        for (let movie of localMovies) {
            createMovieCard(movie);
        }
    }

    $('#yearUp').click(yearAsc);

    const yearDesc = () => {
        localMovies.sort((a, b) => (a.year < b.year) ? 1 : -1);
        $("#database-list").empty();
        for (let movie of localMovies) {
            createMovieCard(movie);
        }
    }

    $('#yearDown').click(yearDesc);

    getDatabase();

    /** Add Trailer Library **/

    const corsProxy = "https://cors-anywhere.herokuapp.com/";
    const getYifyData = (imdb) => {
        let yify = `https://yts.mx/api/v2/list_movies.json?query_term=${imdb}`;
        let url = corsProxy + yify;
        return fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            })
            .then(library => {
                return library.data.movies[0].yt_trailer_code;
            })
            .catch((error) => {
                console.warn("error", error);
            });

    }
    // TEST IF GETTING TRAILERS -- MIGHT NOT NEED
    const getTrailers = () => {
        for (let movie of localMovies) {
            getYifyData(movie.imdb).then(ytlink => {
                movie.trailer = ytlink;
            })
        }
    }
})