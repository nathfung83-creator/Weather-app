let weather = {
  apiKey: "4125b2e1fb8ae0fb38dc2e0e1dd1083e",
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found please check spelling.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data))
      .catch((error) => console.error("Weather fetch failed:", error));
  },
  displayWeather: function (data) {
    const name = data.city.name;
    const timezone = data.city.timezone;
    
    const currentWeather = data.list[0];
    const { icon, description } = currentWeather.weather[0];
    const { temp, humidity } = currentWeather.main;
    const { speed } = currentWeather.wind;
    const { dt } = currentWeather;

    
    const localTime = new Date((dt + timezone - 240) * 1000);
    const hours = String(localTime.getUTCHours()).padStart(2, '0');
    const minutes = String(localTime.getUTCMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    // uses api to find i think
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = Math.round(temp) + "°C";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + " km/h";
    document.querySelector(".time").innerText = "Time: " + timeString;

    
    let forecastHTML = "";
    const forecastIndices = [8, 16, 24, 32]; 

    forecastIndices.forEach((index) => {
      if (data.list[index]) {
        const item = data.list[index];
        const itemDate = new Date((item.dt + timezone) * 1000);
        const dayName = itemDate.toLocaleDateString('en-US', { weekday: 'short' });
        const itemTemp = Math.round(item.main.temp);
        const itemIcon = item.weather[0].icon;

        forecastHTML += `
          <div class="forecast-item">
            <span>${dayName}</span>
            <img src="https://openweathermap.org/img/wn/${itemIcon}.png" width="35" />
            <span>${itemTemp}°C</span>
          </div>
        `;
      }
    });

    document.querySelector(".forecast-list").innerHTML = forecastHTML;
    document.querySelector(".weather").classList.remove("loading");
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      weather.search();
    }
  });

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      //finding location i think this is how it works
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      weather.fetchWeatherByCoords(lat, lon);
    },
    (error) => {
      
      console.log("Geolocation permission denied or unavailable. Loading default city.");
      weather.fetchWeather("Santa Clara");
    }
  );
} else {

  weather.fetchWeather("Santa Clara");
}