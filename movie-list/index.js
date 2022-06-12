const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')


function renderMovieList(data) {
  let rawHTML = ''
  // processing
  data.forEach((item) => {
    // title, image
    rawHTML += `
        <div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img
            src="${POSER_URL + item.image}"
            class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">
              More
            </button>
            <button class="btn btn-info btn-favorite" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `
  }
  paginator.innerHTML = rawHTML
}


function getMoviesByPage(page) {
  // 如果 filteredMovies 有長度，就給我 filteredMovies；如果 filteredMovies 是空陣列，就給我 movies。
  const data = filteredMovies.length ? filteredMovies : movies

  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}



function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios
    .get(INDEX_URL + id)
    .then(response => {
      const data = response.data.results
      console.log(data)
      modalTitle.innerText = data.title
      modalDate.innerText = 'Release date: ' + data.release_date
      modalDescription.innerText = data.description
      modalImage.innerHTML = `
      <img src="${POSER_URL + data.image}" alt="movie-poster" class="image-fluid">
      `
    })
}

function addToFavorite(id) {
  // function isMovieIdMatched(movie) {
  //   return movie.id === id
  // }
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)

  if (list.some(movie => movie.id === id)) {
    return alert('您已經收藏過這部電影囉')
  }

  list.push(movie)
  // const jsonString = JSON.stringify(list)
  // console.log('json string: ', jsonString)
  // console.log('json object: ', JSON.parse(jsonString))
  localStorage.setItem('favoriteMovies', JSON.stringify(list))


}


dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  // 如果未輸入，keyword.length的B布林直會為false，加上驚嘆號，會變成true。
  // if (!keyword.length) {
  //   return alert('Please enter valid string.')
  // }

  // 陣列操作三寶：map, filter, reduce
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword}，沒有符合的電影`)
  }


  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie)
  //   }
  // }


  renderPaginator(filteredMovies.length)
  // 把篩選後的資料交給 renderMovieList(filteredMovies)。
  // 重新呼叫 renderMovieList 會導致瀏覽器重新渲染 #data-panel 裡的 template，此時畫面上就只會出現符合搜尋結果的電影。
  renderMovieList(getMoviesByPage(1))
})




axios
  .get(INDEX_URL)
  .then((response) => {
    // Array(80)
    // for (const movie of response.data.results) {
    //   movies.push(movie)
    // }
    movies.push(...response.data.results)
    // console.log(response)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
  })
