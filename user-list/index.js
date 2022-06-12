const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users/"
const USERS_PER_PAGE = 20

const users = []
let filteredUsers = []

const dataPanel = document.querySelector("#data-panel")
// const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")

const pagination = document.querySelector("#pagination")


// 綁定 Search Input Form 的點擊事件，觸發搜尋功能
searchInput.addEventListener("input", function onSearchInputInput(event) {
  const keyword = searchInput.value.trim().toLowerCase()

  filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(keyword) ||
    user.surname.toLowerCase().includes(keyword)
  )

  renderPagination(filteredUsers.length)
  renderUserList(filteredUsers)
})


// 綁定 Search 按鈕的點擊事件，觸發搜尋功能
// searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
//   event.preventDefault()
//   const keyword = searchInput.value.trim().toLowerCase()

//   // let filteredUsers = []  
//   // for (const user of users) {
//   //   if (user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword)) {
//   //     filteredUsers.push(user)
//   //   }
//   // }

//   filteredUsers = users.filter(user => 
//     user.name.toLowerCase().includes(keyword) ||
//     user.surname.toLowerCase().includes(keyword)
//   )

//   if (filteredUsers.length === 0) {
//     return alert(`Cannot find the user with keyword: ${keyword}`)
//   }

//   renderUserList(filteredUsers)
// })


// 綁定 data panel，(1) render 出 users' profile (2) 加到 favorite list
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-user")) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id))
  }
})


// 綁定 pagination 監聽器
pagination.addEventListener("click", function onPaginationClicked(event) {
  if (event.target.tagName !== "A") return
  const page = Number(event.target.dataset.page)
  renderUserList(getUsersByPage(page))
})


function renderPagination(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  let rawHTML = ""

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  pagination.innerHTML = rawHTML
}


function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * USERS_PER_PAGE
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}


function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteUsers")) || []
  const user = users.find(user => user.id === id)

  if (list.some(user => user.id === id)) {
    return alert("The user has been already added to your favorite list!")
  }

  list.push(user)
  localStorage.setItem("favoriteUsers", JSON.stringify(list))
}


function showUserModal(id) {
  const modalName = document.querySelector("#user-modal-name")
  const modalGender = document.querySelector("#user-modal-gender")
  const modalAge = document.querySelector("#user-modal-age")
  const modalRegion = document.querySelector("#user-modal-region")
  const modalBirthday = document.querySelector("#user-modal-birthday")
  const modalEmail = document.querySelector("#user-modal-email")
  const modalImage = document.querySelector("#user-modal-image")

  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data
      modalName.innerText = "Name: " + data.name + " " + data.surname
      modalGender.innerText = "Gender: " + data.gender
      modalAge.innerText = "Age: " + data.age
      modalRegion.innerText = "Region: " + data.region
      modalBirthday.innerText = "Birthday: " + data.birthday
      modalEmail.innerText = "Email: " + data.email
      modalImage.innerHTML = `<img src="${data.avatar}" alt="profile-image" class="image-fluid">`
    })
}


function renderUserList(data) {
  let rawHTML = ""

  data.forEach((item) => {
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src="${item.avatar}" class="card-img-top" alt="User's photo">
            <div class="card-body">
              <h5 class="card-title">${item.name} ${item.surname}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-user" data-bs-toggle="modal"
                data-bs-target="#user-modal" data-id="${item.id}">Profile</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = rawHTML
}


// API 請求資料
axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results)
    renderPagination(users.length)
    renderUserList(getUsersByPage(1))
  })
  .catch((err) => console.log(err))

