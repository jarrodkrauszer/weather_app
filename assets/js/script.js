var searchBtns = document.querySelector(".locations");
var cityInput = document.querySelector("#city-name");
var weatherSection = document.querySelector('#weather-forecast');
var fiveDay = document.querySelector('.five-day');

const baseUrl = 'https://api.openweathermap.org/data/2.5';
const apiKey = '6c08e5624956619462f4e304a0abb23c';

function displaySavedCities() {
  var citiesList = document.querySelector('.cities');
  var citiesFromStorage = getItemsFromStorage();

  citiesList.innerHTML = '';

  citiesFromStorage.forEach(function(city) {
    var cityEl = document.createElement('button');
    var cityName = document.createTextNode(city);

    cityEl.className = 'city-button';

    cityEl.appendChild(cityName);
    citiesList.appendChild(cityEl);
  });
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  if(!itemsFromStorage.includes(item)) {
    itemsFromStorage.push(item);

    localStorage.setItem('cities', JSON.stringify(itemsFromStorage));
  }
  
}

function getItemsFromStorage() {
  return JSON.parse(localStorage.getItem('cities')) || [];
}

function getForecast(lat, lon) {
  // fiveDay.innerHTML = '';

  fetch(`${baseUrl}/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
  .then(function (response) {
    return response.json();
  }).then(function(data) {
    data.list.forEach(function(day) {
      if(day.dt_txt.includes('12:00:00')) {
        console.log(day);
        // fiveDay.innerHTML += `<div class="day">
        // <h4>${new Date(day.dt * 1000).toLocaleDateString()}</h4>
        // <img
        //   src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png"
        //   alt="Weather Icon"
        // />
        // <p>Temp: ${day.main.temp}<span> &#8457;</span></p>
        // <p>Wind: ${day.wind.speed}<span> MPH</span></p>
        // <p>Humidity: ${day.main.humidity}<span>%</span></p>
        // </div>`;  
      }
    })
  });
}

function getWeather(city) {
  
  fetch(`${baseUrl}/weather?q=${city}&units=imperial&appid=${apiKey}`)
    .then(function (response) {
      return response.json();
    }).then(function(data) {

      getForecast(data.coord.lat, data.coord.lon);
      weatherSection.classList.remove('hidden');

      var cityNameEl = document.querySelector('#city-date');
      var todaysIconEl = document.querySelector('#todays-icon');
      var todaysTempEl = document.querySelector('#todays-temp');
      var todaysWindEl = document.querySelector('#todays-wind');
      var todaysHumidityEl = document.querySelector('#todays-humidity');

      var timeFormatted = new Date(data.dt * 1000).toLocaleDateString();

      cityNameEl.innerText = `${data.name}  (${timeFormatted})`
      todaysIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
      todaysTempEl.innerText = data.main.temp;
      todaysWindEl.innerText = data.wind.speed;
      todaysHumidityEl.innerText = data.main.humidity;

      addItemToStorage(city);
      displaySavedCities();
    });
}

function buttonClicked(e) {
  var className = e.target.className;

  if (e.target.tagName === 'BUTTON') {
    switch (className) {
      case 'search-button':
        getWeather(cityInput.value);
        break;

      case 'city-button':
        getWeather(e.target.textContent)
        break;
    }
  }
  
  cityInput.value = '';
}

searchBtns.addEventListener('click', buttonClicked);
window.addEventListener('load', displaySavedCities);