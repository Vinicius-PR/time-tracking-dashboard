const dashboardData = document.querySelector('.dashboard-data')
const menuOptions = document.querySelector('.menu-options ul')
const buttons = document.querySelectorAll('.menu-options button')
const loading = document.querySelector('.loading')

// this time can be daily, weekly or monthly
let time = 'weekly'

function createCard(data, time) {
  const className = data.title.toLowerCase().replace(' ', '-')

  const mapText = {
    daily: 'Yesterday',
    weekly: 'Last Week',
    monthly: 'Last Month'
  }
  const previousText = mapText[time]

  const current = data.timeframes[time].current
  const previous = data.timeframes[time].previous
  const currentTimeText = current > 1 ? `${current}hrs` : `${current}hr`
  const previousTimeText = previous > 1 ? `${previous}hrs` : `${previous}hr`

  return `
    <article class="card ${className}">
      <div class="card-header">
        
      </div>

      <div class="card-content">
        <!-- This div card-absolute-effect exists only for design purposes. To create a diferent border effect. -->
        <div class="card-absolute-effect"></div>

        <div class="card-name text-preset-5-medium text-color-white">
          <p>${data.title}</p>
          <img src="./images/icon-ellipsis.svg" alt="">
        </div>
        <div class="card-time">
           <h2 class="current-time text-preset-1 text-color-white">
            ${currentTimeText}
          </h2 >
          <h3 class="previous-time text-preset-6 text-color-navy-200">
            ${previousText} - ${previousTimeText}
          </h3>
        </div>
      </div >
    </article >
  `
}

function hideLoading() {
  loading.style.display = 'none'
}

function showError(errorMessage) {
  return `
    <div class="error">
      <h2>Error. Didn't find the data. Try again later or contact support.</h2>
      <p>${errorMessage}</p>
    </div>
  `
}

async function loadData(time) {
  try {
    const response = await fetch('/data.json')

    if (!response.ok) {
      throw new Error('Failed to fecth the data')
    }

    const data = await response.json()

    const dashboardHtml = data.map((item) => {
      return createCard(item, time)
    })
    dashboardData.innerHTML = dashboardHtml.join('')
  } catch (error) {
    console.error('Error:', error)
    dashboardData.innerHTML = showError(error.message)
  } finally {
    hideLoading()
    buttons.forEach(btn => btn.disabled = false)
  }
}

menuOptions.addEventListener('click', (event) => {
  const button = event.target.closest('button')
  if (!button) return

  // Disabling the buttons
  buttons.forEach(btn => btn.disabled = true)

  // Removing the active class
  document.querySelectorAll('.menu-options button')
    .forEach(el => el.classList.remove('active'))

  // Adding the active class to the click one
  button.classList.add('active')

  time = button.dataset.value
  loadData(time)
})

loadData(time)