var searchBtns = document.querySelector(".locations");
var cityInput = document.querySelector("#city-name");

const baseUrl = 'https://api.openweathermap.org';
const apiKey = '6c08e5624956619462f4e304a0abb23c';

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  
  itemsFromStorage.push(item);

  localStorage.setItem('cities', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  return JSON.parse(localStorage.getItem('cities')) || [];
}

function getWeather(lat, lon) {

}

function requestCoords(city) {
  
  fetch(`${baseUrl}/geo/1.0/direct?q=${city}&mode=json&limit=1&appid=${apiKey}`)
    .then(function (response) {
      var dataPromise = response.json();
      dataPromise.then(function(data) {
        getWeather(data[0].lat, data[0].lon);

        var newCity = {
          name: city,
          lat: data[0].lat,
          lon: data[0].lon
        };

        addItemToStorage(newCity);
      });
    });
}

function buttonClicked(e) {
  var className = e.target.className;

  if (e.target.tagName === 'BUTTON') {
    switch (className) {
      case 'search-button':
        requestCoords(cityInput.value);
        break;

      case 'city-button':
        getCoords('New York')
        break;
    }
  }
  
  cityInput.value = '';
}

searchBtns.addEventListener('click', buttonClicked);