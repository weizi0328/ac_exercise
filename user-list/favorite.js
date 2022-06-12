const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users/"

const users = JSON.parse(localStorage.getItem("favoriteUsers")) || []

const dataPanel = document.querySelector("#data-panel")

// const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")




// 綁定 data panel，(1) render 出 users' profile (2) 加到 favorite list
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-user")) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

function removeFromFavorite(id) {
  if (!users || !users.length) return

  const userIndex = users.findIndex(user => user.id === id)
  if (userIndex === -1) return

  users.splice(userIndex, 1)

  localStorage.setItem("favoriteUsers", JSON.stringify(users))

  renderUserList(users)
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
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">x</button>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = rawHTML
}

renderUserList(users)