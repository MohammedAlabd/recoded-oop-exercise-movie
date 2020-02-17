const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185'
const BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780'
let urlB 
class App {
  static run() {
    APIService.fetchMovie(634)
      .then(movie => Page.renderMovie(movie))

    APIService.fetchActors(634)
      .then(array =>array.forEach(obj=>Page.renderActors(obj)))
  }
}

class APIService {

  static fetchMovie(movieId) {
    const url = APIService._constructUrl(`movie/${movieId}`)
    return fetch(url)
      .then(res => res.json())
      .then(json => new Movie(json))
  }

  static  _constructUrl(path) {
    return `${TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`
  }

  static fetchActors(movieId){
    const url = APIService._constructUrl(`movie/${movieId}/credits`)
    return fetch(url)
      .then(res => res.json())
      .then(json => {
        let actorsArray = []
        for(let i = 0; i <= 3; i++){
          let actor = new Actor(json.cast[i])
          actorsArray.push(actor)
        }
        return actorsArray
      })
  }
}

class Page {
  static backdrop = document.getElementById('movie-backdrop')
  static title = document.getElementById('movie-title')
  static releaseDate = document.getElementById('movie-release-date')
  static runtime = document.getElementById('movie-runtime')
  static overview = document.getElementById('movie-overview')

  static renderMovie(movie) {
    Page.backdrop.src = BACKDROP_BASE_URL + movie.backdropPath
    Page.title.innerText = movie.title
    Page.releaseDate.innerText = movie.releaseDate
    Page.runtime.innerText = movie.runtime + " minutes"
    Page.overview.innerText = movie.overview
  }

  static renderActors (actor) {
    const card = document.createElement("li")
    document.querySelector(".list-unstyled").appendChild(card)
    card.setAttribute("class","card")
    card.setAttribute("class","col-md-3")
    card.insertAdjacentHTML('beforeend',' <img src="..." class="card-img-top" alt="..."> <div class="card-body"> <h5 class="card-title"> </h5> <h3 class="card-text"></h3> </div> ');
    card.querySelector(".card-img-top").setAttribute("src",PROFILE_BASE_URL + actor.picPath)
    card.querySelector(".card-title").innerHTML = actor.name
    card.querySelector(".card-text").innerHTML = actor.character
  }
}

class Actor {
  constructor(json){
    this.id = json.id
    this.name = json.name
    this.character = json.character
    this.picPath = json.profile_path
  }
}

class Movie {
  constructor(json) {
    this.id = json.id
    this.title = json.title
    this.releaseDate = json.release_date
    this.runtime = json.runtime
    this.overview = json.overview
    this.backdropPath = json.backdrop_path
  }
}

document.addEventListener("DOMContentLoaded", App.run);
