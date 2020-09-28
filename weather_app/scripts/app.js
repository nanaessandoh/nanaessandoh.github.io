const cityForm = document.querySelector(".change-location"); // You can use form since its the only form in the dom
const card = document.querySelector(".card");
const details = document.querySelector(".details");
const time = document.querySelector("img.time");
const icon = document.querySelector(".icon img");
const body = document.querySelector("body");

// Create a forcast object
const forecast = new Forecast();

const updateUI = (data) => {
  // retreive data into constants
  
  // const cityDetails = data.cityDetails;
  // const weather = data.weather;

  // Destructure properties
  const { cityDetails, weather } = data; // same as above

  // update details template
  details.innerHTML = `           
    <h5 class="my-3">${cityDetails.EnglishName}</h5>
    <div class="my-3">${weather.WeatherText}</div>
    <div class="display-4 my-4">
      <span>${weather.Temperature.Metric.Value}</span>
      <span>&deg;C</span>
    </div>`;

  // Update the night/day & icon miages
  const iconSrc = `img/icons/${weather.WeatherIcon}.svg`;
  icon.setAttribute("src", iconSrc);

  let timeSrc = null;
  if (weather.IsDayTime) {
    timeSrc = "img/day.svg";
    if (body.classList.contains("night")) {
      body.classList.remove("night");
      body.classList.add("day");
    } else {
      body.classList.add("day");
    }
  } else {
    timeSrc = "img/night.svg";
    if (body.classList.contains("day")) {
      body.classList.remove("day");
      body.classList.add("night");
    } else {
      body.classList.add("night");
    }
  }

  time.setAttribute("src", timeSrc);

  // Remove d-none class if present
  if (card.classList.contains("d-none")) {
    card.classList.remove("d-none");
  }
};

cityForm.addEventListener("submit", (e) => {
  // Prevent Default Action
  e.preventDefault();

  // Get city from input
  const city = cityForm.city.value.trim();

  // reset the from
  cityForm.reset();

  //update the UI with new city
  forecast
    .updateCity(city)
    .then((data) => {
      updateUI(data);
    })
    .catch((error) => {
      console.log(error);
    });

  // set city data into local storage
  localStorage.setItem("city", city);
});

// Update to last city searched - City name is stored in browser local storage
if (localStorage.getItem("city")) {
  forecast
    .updateCity(localStorage.getItem("city"))
    .then((data) => {
      updateUI(data);
    })
    .catch((error) => {
      console.log(error);
    });
}
