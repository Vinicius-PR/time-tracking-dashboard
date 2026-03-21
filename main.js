const dashboardData = document.querySelector('.dashboard-data')
const menuOptions = document.querySelector('.menu-options ul')

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

  return `
    <div class="card ${className}">
      <div class="card-header">
        
      </div>

      <div class="card-content">
        <!-- This div card-absolute-effect exists only for design purposes. To create a diferent border effect. -->
        <div class="card-absolute-effect"></div>

        <div class="card-name text-preset-5-medium text-color-white">
          <p>${data.title}</p>
          <img src="./images/icon-ellipsis.svg" alt="">
        </div>
        <h2 class="current-time text-preset-1 text-color-white">
          ${data.timeframes[time].current}hrs
        </h2 >
        <h3 class="previous-time text-preset-6 text-color-navy-200">
          ${previousText} - ${data.timeframes[time].previous}hrs
        </h3>
      </div >
    </div >
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
    console.error(error)
  }
}

menuOptions.addEventListener('click', (event) => {
  const li = event.target.closest('li')
  if (!li) return

  // Removing the active class
  document.querySelectorAll('.menu-options li')
    .forEach(el => el.classList.remove('active'))

  // Adding the active class to the click one
  li.classList.add('active')

  time = li.dataset.value
  loadData(time)
  console.log(time)
})

loadData(time)