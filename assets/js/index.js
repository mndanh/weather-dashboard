
const apiKey = 'd980b371060fdb69f0d0b9ea00e4dc4f';

/*
 Issue 1: You ned to make multiple fetch calls!

 Geocoding API is needed for lat and lon 
 5 Day / 3 Hour Forecast will provide 5 day forecast, but w/ 8 forecasts per day
 
 Multiple Fetch calls can be made in either of these ways below:

 1. Stacked then() blocks 

 */ 
 function saveCity(city) {
   let cities = JSON.parse(localStorage.getItem('cities')) || [];
   // Check if city already exists
   if (!cities.includes(city)) {
       // Add new city and remove oldest if more than 10
       cities.push(city);
       if (cities.length > 10) {
           cities.shift();
       }
       localStorage.setItem('cities', JSON.stringify(cities));
       displaySavedCities();
   }
}

function displaySavedCities() {
   let cities = JSON.parse(localStorage.getItem('cities')) || [];
   let cityContainer = document.getElementById('savedCities');
   cityContainer.innerHTML = ''; // Clear existing buttons
   cities.forEach(city => {
       let button = document.createElement('button');
       button.textContent = city;
       button.className = 'city-button';
       button.addEventListener('click', () => {
           fetchCityWeather(city);
       });
       cityContainer.appendChild(button);
   });
}

function fetchCityWeather(city) {
   fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`)
       .then(resp => resp.json())
       .then(data => {
           if (data.length > 0) {
               let lat = data[0].lat;
               let lon = data[0].lon;
               currentWeather(lat, lon, city);
               forecastWeather(lat, lon);
               saveCity(city);
           } else {
               alert('City not found');
           }
       });
}

 function currentWeather(lat, lon, city)
 {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    .then( function(resp) {
     return resp.json()
    })
    .then( function(data){
       console.log(data);
      let h2 = document.createElement("h2");
      h2.textContent = `${city} (${dayjs().format('MM/DD/YYYY')})`;

      let icon = document.createElement("img");
      icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      icon.alt = data.weather[0].description;

      let temp = document.createElement("p");
      temp.textContent = `Temp: ${data.main.temp} F`;

      let wind = document.createElement("p");
      wind.textContent = `Wind: ${data.wind.speed} MPH`;

      let humidity = document.createElement("p");
      humidity.textContent = `Humidity: ${data.main.humidity} %`;

      let currentWeatherContainer = document.getElementById("currentWeather");
            currentWeatherContainer.innerHTML = ''; // Clear previous weather data
            currentWeatherContainer.append(h2, icon, temp, wind, humidity);
    })
 }

function forecastWeather(lat, lon) {
   fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
       .then(function(resp) {
           return resp.json();
       })
       .then(function(data) {
           let forecastContainer = document.getElementById("forecastData");
           forecastContainer.innerHTML = ''; // Clear previous forecast data

           for (let i = 0; i < data.list.length; i = i + 8) {
               let info = data.list[i];
               let [date, time] = info.dt_txt.split(' ');
               let formattedDate = dayjs(date).format('MM/DD/YYYY');

               let card = document.createElement("div");
               card.className = 'forecast-card';

               let h3 = document.createElement("h3");
               h3.textContent = `(${formattedDate})`;

               let icon = document.createElement("img");
               icon.src = `https://openweathermap.org/img/wn/${info.weather[0].icon}.png`;
               icon.alt = info.weather[0].description;

               let temp = document.createElement("p");
               temp.textContent = `Temp: ${info.main.temp} F`;

               let wind = document.createElement("p");
               wind.textContent = `Wind: ${info.wind.speed} MPH`;

               let humidity = document.createElement("p");
               humidity.textContent = `Humidity: ${info.main.humidity} %`;

               card.append(h3, icon, temp, wind, humidity);
               forecastContainer.appendChild(card);
           }
       });
}

 document.getElementById("submit").addEventListener("click", function(e){
    e.preventDefault();

    let city = document.getElementById("cityName").value;
    fetchCityWeather(city);
    

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`)
 .then( function(resp) {
  return resp.json()
 })
 .then( function(data){
    // console.log(data);
    currentWeather(data[0].lat, data[0].lon, city);
    forecastWeather(data[0].lat, data[0].lon);
  // return the data from this fetch call to the next fetch call
 // return data // lat and lon
 })
 })

 document.addEventListener("DOMContentLoaded", displaySavedCities);
