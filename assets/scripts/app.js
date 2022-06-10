import { config } from "./config.js";

const api = config.API_KEY;
const searchBtn = document.getElementsByClassName("search-btn");
const inputBox = document.getElementsByClassName("search-input");
// const getLocationBtn = document.getElementsByClassName("location-btn");

let lat = 0;
let lon = 1;
let temp;
let weather;
let weatherId;

// const getMyLocation = () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition((position) => {
//       lon = position.coords.longitude;
//       lat = position.coords.latitude;
//       console.log(lon, lat);
//     });
//   } else {
//     alert("Not able to get your current location");
//   }
// };

const getGeolocation = (city) => {
  return new Promise((resolve, reject) => {
    const call = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${api}`;
    fetch(call)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        lat = data[0].lat;
        lon = data[0].lon;
        resolve();
      });
  });
};

const getWeather = (lat, lon) => {
  return new Promise((resolve, reject) => {
    const call = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}`;
    fetch(call)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        temp = Math.round(data.main.temp - 273);
        weather = data.weather[0].main;
        weatherId = data.weather[0].id;
        resolve();
      });
  });
};

const displayWeatherInfo = (city, temp, weather) => {
  return new Promise((resolve, reject) => {
    const citySelect = document.querySelector(".display-city");
    const dateSelect = document.querySelector(".display-date");
    const weatherTempSelect = document.querySelector(".display-weather-temp");
    const weatherSelect = document.querySelector(".display-weather");
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("en-US", {
      month: "long",
    });
    const currentDay = currentDate.getUTCDate();
    const currentDayName = currentDate.toLocaleString("en-US", {
      weekday: "long",
    });

    citySelect.textContent = `${city.toUpperCase()}`;
    dateSelect.textContent = `${currentDayName.toLocaleUpperCase()} | 
      ${currentMonth.toUpperCase()} ${currentDay}`;
    weatherTempSelect.textContent = `${temp}\xB0 C`;
    weatherSelect.textContent = `${weather.toUpperCase()}`;
    getWeatherIcon(weatherId);
  });
};

const getWeatherIcon = (id) => {
  const weatherIcon = document.querySelector(".weather-icon");
  if (id > 199 && id < 233) {
    weatherIcon.innerHTML = '<i class="fa-solid fa-cloud-bolt fa-8x"></i>';
  } else if (id > 299 && id < 322) {
    weatherIcon.innerHTML = '<i class="fa-solid fa-cloud-rain fa-8x"></i>';
  } else if (id > 499 && id < 532) {
    weatherIcon.innerHTML =
      '<i class="fa-solid fa-cloud-showers-heavy fa-8x"></i>';
  } else if (id > 599 && id < 623) {
    weatherIcon.innerHTML = '<i class="fa-solid fa-snowflake fa-8x"></i>';
  } else if (id > 700 && id < 782) {
    weatherIcon.innerHTML = '<i class="fa-solid fa-cloud-fog fa-8x"></i>';
  } else if (id === 800) {
    weatherIcon.innerHTML = '<i class="fa-solid fa-sun fa-8x"></i>';
  } else if (id === 801) {
    weatherIcon.innerHTML = '<i class="fa-solid fa-cloud-sun fa-8x"></i>';
  } else {
    weatherIcon.innerHTML = '<i class="fa-solid fa-cloud fa-8x"></i>';
  }
};

async function displayDataHandler(city) {
  const getLocation = await getGeolocation(city);
  const weatherDisplay = await getWeather(lat, lon);
  const showInfo = await displayWeatherInfo(city, temp, weather);
}

window.addEventListener("load", () => {
  displayDataHandler("San Francisco");
});

searchBtn[0].addEventListener("click", () => {
  displayDataHandler(inputBox[0].value);
});

// getLocationBtn[0].addEventListener("click", getMyLocation);
