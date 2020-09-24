$(document).ready(function() {

    const baseurl = 'https://copper-cypress-bakery.glitch.me/movies';
    let localMovies = [];
    /** DATABASE SEED-EMPTY FUNCTIONS **/
        // SEED DATA TO GET FROM OMDB FOR DATABASE
    const seedList = [
            "CITIZEN KANE ",
            "CASABLANCA",
            "THE GODFATHER",
            "GONE WITH THE WIND",
            "WIZARD OF OZ",
            "THE GRADUATE",
            "PSYCHO",
            "nightmare on elm street",
            "Friday the 13th",
            "kill bill",
            "king kong",
            "taxi driver",
            "the conjuring",
            "due date",
            "the hangover",
            "jaws",
            "clockwork orange",
            "hot tub time machine",
            "back to the future",
            "the sandlot",
            "pulp fiction",
            "forrest gump",
            "american pie",
            "fight club",
            "donnie darko",
            "mr. deeds",
            "hot chick",
            "ip man",
            "the girl next door",
            "goodfellas",
            "rocky",
            "fanasia",
            "network",
            "apocalypse now"
        ];

    // MAKE REQUEST FROM OMDB API
    const getOmdb =(movie) => {
        const url =`http://www.omdbapi.com/?t=${movie}&apikey=${OMDbkey}&`
        return fetch(url)
            .then(response => response.json())
            .then(movieData => {
                return movieData;
            })
            .catch(error => console.log(error));
    }

    // SEED DATA WHEN NEEDED
    const seedData = ()=>{
        for(let movie of seedList){
            getOmdb(movie).then((data)=>{
                console.log("ombd",data)
                let newMovie = {
                    title: data.Title,
                    year:  data.Year,
                    rated: data.Rated,
                    released: data.Released,
                    runtime: parseInt(data.Runtime),
                    genre: data.Genre.split(", "),
                    plot: data.Plot,
                    language: data.Language.split(", "),
                    poster: data.Poster,
                    rating: parseFloat(data.Ratings[0].Value.split("/")[0]),
                    director: data.Director,
                    actors: data.Actors,
                }
                createMovie(newMovie);
            });
        }
    }

    // DELETES ALL THE MOVIES FROM OUR DATABASE
    const deleteAll = () =>{
        fetch(baseurl)
            .then((response)=> {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            })
            .then( (data)=> {
                console.log("deleting data",data);
                for (let movie of data){
                    deleteMovie(movie.id);
                }
                getDatabase();
            })
            .catch( (error) =>{
                console.warn("error", error);
            });
    }
    /** END DATABASE SEED-EMPTY COMMANDS **/

    /** GET MOVIES FROM DATABASE REQUESTS**/
        // SERVER REQUEST TO GET ALL MOVIES FROM DATABASE
    const getDatabase =() => {
            $("#database-list").html(loader);
            fetch(baseurl)
                .then((response)=> {
                    if (response.ok) {
                        return response.json();
                    }
                    return Promise.reject(response);
                })
                .then( (data)=> {
                    console.log("success");
                    localMovies = data;
                    $("#database-list").html("")
                    for(let movie of localMovies){
                        createMovieCard(movie);
                    }
                })
                .catch( (error) =>{
                    console.warn("error", error);
                });
        }

    // SERVER REQUEST TO GET SPECIFIC MOVIE FROM DATABASE
    const getMovie = (id) => {
        return fetch(baseurl)
            .then((response)=> {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            })
            .then( (data)=> {
                for (let movie of data) {
                    if (movie.id == id) {
                        console.log(movie);
                        return movie;
                    }
                }
                console.log("success");
            })
            .catch( (error) =>{
                console.warn("error", error);
            });
    }
    /** END GET MOVIES REQUEST **/

    /** HELPER FUNCTIONS **/
        // DYNAMIC MOVIE CARD CREATED FROM MOVIE DATA
    const createMovieCard = (movie) =>{
            $('#database-list').append(`
            <div class="card menu-view shadow-lg ">
                <img class="card-img-top" src="${movie.poster}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <p class="card-text card-plot">
                        ${ movie.plot.length <= 136 ? movie.plot : movie.plot.slice(0,136)+"..." }
                    </p>
                    <p class="card-text card-plot-expanded d-none">
                        ${ movie.plot }
                    </p>
                    <div class="sub-content">
                        <ul class="list-inline">
                            <li class="list-inline-item movie-ratings">
                               <i class="fas fa-star"></i> <span class="rating-stars">${(movie.rating/2).toFixed(1)}</span> 
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
                            <div id="${movie.id}" class="list-group-item">
                                <button class="badge badge-pill badge-dark editbtn">Edit</button>
                                <button class="badge badge-pill badge-dark deletebtn">Delete</button>
                            </div>
                        </div>
                    </div>   
                </div> 
            </div>
        `);
        }
    // CREATES A MOVIE OBJECT BASED ON FORM INPUTS
    const setMovieObj = ()=>{
        return {
            title: $("#title").val(),
            year:  $("#year").val(),
            rated: $("#rated").val(),
            released: $("#released").val(),
            runtime: $("#runtime").val(),
            genre: $("#genre").val(),
            plot: $("#plot").val(),
            language:$("#language").val(),
            poster: $("#poster").val(),
            rating: $("#rating").val(),
            director: $("#director").val(),
            actors: $("#actors").val()
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
    const createMovie = (movie)=>{
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movie),
            };
            fetch(baseurl, options)
                .then((response)=> {
                    if (response.ok) {
                        return response.json();
                    }
                    return Promise.reject(response);
                })
                .then( ()=> {
                    console.log("success");
                    getDatabase();
                })
                .catch( (error) =>{
                    console.warn("error", error);
                });
        }

    // CRUD DELETE MOVIE FROM DATABASE
    const deleteMovie = (id)=>{
        let url = `${baseurl}/${id}`;
        fetch(url,{method: "DELETE"}).then(()=> getDatabase());
    }

    // CRUD UPDATE MOVIE ON DATABASE
    const updateMovie =(id) => {
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
            .then((response)=> {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            })
            .then( (data)=> {
                console.log("success");
                $("#formModal").modal("toggle");
                getDatabase();
            })
            .catch( (error) =>{
                console.warn("error", error);
            });
    }
    /** END CRUD **/


    /** FORM SPECIFIC VARS AND FUNCTIONS **/
        // FORM: RENDER THE MOVIE FORM FROM CALLBACK
    const loadCreateForm = ()=>{
            return fetch("_form.html")
                .then((response)=> {
                    if (response.ok) {
                        return response.text();
                    }
                    return Promise.reject(response);
                })
                .catch( (error) =>{
                    console.warn("error", error);
                });
        }

    // FORM: CREATES THE SELECT VALUES FOR YEARS
    const yearsSelect = ()=>{
        let current = (new Date()).getFullYear();
        for (current; current>= 1900; current-- ){
            $("#year").append(`<option value="${current}">${current}</option>`)
        }
    }

    // FORM: CREATES THE SELECT VALUES FOR GENRE
    const genreSelect = ()=>{
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
        for(let genre of genres) {
            $("#genre").append(`<option value="${genre}">${genre}</option>`)
        }
    }

    // FORM: CREATES THE SELECT VALUES FOR LANGUAGES
    const languageSelect = ()=>{
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
        for(let lang of langs){
            $("#language").append(`<option value="${lang}">${lang}</option>`)
        }
    }
    // FORM: SHOW CURRENT VALUE OF RATING SLIDER
    $(document).on("change","#rating",function () {
        $("#currentRating").html($("#rating").val());
    })

    // FORM: SET THE INPUT SELECT VALUES FOR THE FORM
    const setSelectValues = ()=>{
        loadCreateForm().then( html=>{
            $("#modalForm").html(html);
            yearsSelect();
            genreSelect();
            languageSelect();
        })
    }
    // FORM: UPDATES THE EDIT FORM VALUES TO THOSE OF THE CURRENT MOVIE
    const updateFormValues =(movie) => {
        $('input[name="currId"]').attr('value',movie.id);
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
    }
    /** END FORM **/


    /** ONCLICK EVENTS **/
    // NEW MOVIE BUTTON ON CLICK DISPLAY THE CREATE MOVIE FORM MODAL
    $("#addMovieBtn").click(function (){
        setSelectValues();
        $('#formModalLongTitle').html("Add Movie");
        $("#formModal").modal("toggle");
    })

    // GET ENTIRE CARD ON CLICK;
    // const deleteTitle = $(this).parent().siblings();

    // DELETE MOVIE BUTTON ON CLICK DISPLAY CONFIRM DELETE
    $(document).on('click','.deletebtn',function(){
        $("#expandedModal").modal("toggle");
        const id = $(this).parent()[0].id;
        console.log(id)
        const deleteTitle = $(this).parent().siblings(".card-body").children(".card-title");
        $("#deleteMovieModalLabel").html( deleteTitle);
        $("#deleteMovieModal").modal("toggle");
        // IF USER CLICKS CONFIRM DELETE, DELETE MOVIE
        $(".confirm-delete").click(function () {
            deleteMovie(id);
            $("#deleteMovieModal").modal("toggle");
        })
    });

    // EDIT MOVIE BUTTON ON CLICK DISPLAY THE UPDATE MOVIE FORM
    $(document).on('click','.editbtn',function() {
        $("#expandedModal").modal("toggle");
        const id = $(this).parent()[0].id;
        console.log(id)
        setSelectValues();
        getMovie(id).then(movie => {
            updateFormValues(movie);
            $('#createMovie').attr("id","updateMovie");
            $('#formModalLongTitle').html("Update Movie");
        });
        setTimeout(()=>{
            $("#formModal").modal("toggle");
        },200);
    });

    //EXPANDS MODAL INFORMATION
    $(document).on('click', '.menu-view', function () {
        let info = $(this).html();
        let expandedContent = $('#expandedContent');
        expandedContent.html(info);
        expandedContent.children(".card-body").children(".sub-content").children(".hidden-list").toggleClass("d-none");
        expandedContent.children(".card-body").children(".card-plot").toggleClass("d-none");
        expandedContent.children(".card-body").children(".card-plot-expanded").toggleClass("d-none");
        $('#expandedModal').modal("toggle");
    })

    /** END ONCLICK **/


    /** ONSUBMIT EVENTS **/
    // CREATE MOVIE FORM ON SUBMIT
    $(document).on("submit","#createMovie",function (event){
        event.preventDefault();
        const movie = setMovieObj();
        createMovie(movie);
        $("#formModal").modal("toggle");
    });

    // EDIT MOVIE FORM ON SUBMIT
    $(document).on("submit","#updateMovie",function (event){
        event.preventDefault();
        const id = $('input[name="currId"]').val();
        updateMovie(id);
    });
    // SEARCH FORM ON SUBMIT
    $("#searchForm").on("submit",function (event) {
        event.preventDefault();
        movieSearch($("#searchField").val())
    })
    // SEARCH FORM SUBMITS ON KEYUP
    $("#searchField").on("keyup",function () {
        movieSearch($("#searchField").val());
    })
    /** END ONSUBMIT **/

    /** SEARCH FEATURE SECTION **/
        // SEARCH DATABASE
    const movieSearch = (searchInput)=>{
            $("#database-list").html(loader);
            let movies = localMovies.filter((movie)=> {
                if ( $("#radioTitle").is(":checked")) {
                    if (movie.title.toLowerCase().includes(searchInput.toLowerCase())) {
                        return movie;
                    }
                }
                if ( $("#radioGenre").is(":checked")){
                    for (let g of movie.genre){
                        if (g.toLowerCase().includes(searchInput.toLowerCase())) {
                            return movie;
                        }
                    }
                }
                if ($("#radioRating").is(":checked")){
                    searchInput = $("#ratingSearchInput").val();
                    if((movie.rating/2) >= parseFloat(searchInput) ){
                        return movie;
                    }
                }
            })
            $("#database-list").html("")
            for(let movie of movies){
                createMovieCard(movie);
            }
        }

    // SWAP SEARCH INPUT BASED ON RADIO BUTTON
    $("#radioRating").click(function () {
        if($("#ratingSearchInput").hasClass("d-none")){
            $("#ratingSearchInput, #searchField").toggleClass("d-none");
        }

    })
    // SWAP SEARCH INPUT BASED ON RADIO BUTTON
    $("#radioTitle, #radioGenre").click(function () {
        if($("#searchField").hasClass("d-none")){
            $("#ratingSearchInput, #searchField").toggleClass("d-none");
        }

    })
    /** END SEARCH FEATURE **/

    /** SORT FILTER **/

        // TITLE A-Z
    const titleAsc = ()=>{
            localMovies.sort((a,b) => (a.title > b.title) ? 1 : -1);
            $("#database-list").empty();
            for(let movie of localMovies){
                createMovieCard(movie);
            }
        }

    $('#titleAZ').click(titleAsc);

    const titleDesc = () =>{
        localMovies.sort((a,b) => (a.title < b.title) ? 1 : -1);
        $("#database-list").empty();
        for(let movie of localMovies){
            createMovieCard(movie);
        }
    }

    $('#titleZA').click(titleDesc);

    // YEAR ASC
    const yearAsc = ()=>{
        localMovies.sort((a,b) => (a.year > b.year) ? 1 : -1);
        $("#database-list").empty();
        for(let movie of localMovies){
            createMovieCard(movie);
        }
    }

    $('#yearUp').click(yearAsc);

    const yearDesc = ()=>{
        localMovies.sort((a,b) => (a.year < b.year) ? 1 : -1);
        $("#database-list").empty();
        for(let movie of localMovies){
            createMovieCard(movie);
        }
    }

    $('#yearDown').click(yearDesc);

    getDatabase();



})