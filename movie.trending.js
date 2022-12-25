


const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=trending.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/tv?'+API_KEY;


const main = document.getElementById('main');
const form =  document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;



function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn()
    if(selectedGenre.length !=0){   
        selectedGenre.forEach(id => {
            const hightlightedTag = document.getElementById(id);
            hightlightedTag.classList.add('highlight');
        })
    }

}


getMovies(API_URL);

function getMovies(url) {
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        showMovies(data.results)
        
        
    })

}


function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const {title,poster_path, vote_average, overview, id} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
             <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">

            <div class="overview">
                <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
                <button class="know-more" id="${id}">Watch</button>
                </div>
               
                ${overview}
                
            </div>
        
        `

        main.appendChild(movieEl);

        document.getElementById(id).addEventListener('click', () => {
          console.log(id)
          openNav(movie)
        })
    })
}


const overlayContent = document.getElementById('overlay-content');
function openNav(movie) {
  let id = movie.id;
  fetch(BASE_URL + '/movie/'+id+'/videos?'+API_KEY).then(res => res.json()).then(videoData => {
    console.log(videoData);
    if(videoData){
      document.getElementById("myNav").style.width = "100%";
      if(videoData.results.length > 0){
        var embed = [];
        videoData.results.forEach((video, idx) => {
          let {name, key, site} = video

          if(site == 'YouTube'){
              
            embed.push(`
              <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          
          `)

            
          
          }
        })
        
        var content = `
        <h1 class="no-results">${movie.original_title}</h1>
        <br/>
        
        ${embed.join('')}
        <br/>

      
        
        `
        overlayContent.innerHTML = content;
        activeSlide=0;
        showVideos();
      }else{
        overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`
      }
    }
  })
}


/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

function showVideos(){
  let embedClasses = document.querySelectorAll('.embed');
  embedClasses.forEach((embedTag, idx) => {
    if(activeSlide == idx){
      embedTag.classList.add('show')

    }else{
      embedTag.classList.add('hide')
    }
  })

 
}


function getColor(vote) {
    if(vote>= 8){
        return 'green'
    }else if(vote >= 5){
        return "orange"
    }else{
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    if(searchTerm) {
        getMovies(searchURL+'&query='+searchTerm)
    }else{
        getMovies(API_URL);
    }

})
