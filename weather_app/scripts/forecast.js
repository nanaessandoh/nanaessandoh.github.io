class Forecast {
  constructor() {
    this.apiKey = "R38hBD8omwfEVu6S8eYrHD9hcngZGQOG";
    this.weatherURI =
      "https://dataservice.accuweather.com/currentconditions/v1/";
    this.cityURI =
      "https://dataservice.accuweather.com/locations/v1/cities/search";
  }

  async updateCity(city) {
    // Get City Details
    const cityDetails = await this.getCity(city);

    // Get the weather details from the city using the Key
    const weather = await this.getWeather(cityDetails.Key);

    return {
      cityDetails: cityDetails,
      weather: weather,
    };

    // Object shorthand notation return {cityDetails, waeather};
  }

  // Get City Details
  async getCity(city) {
    const query = `?apikey=${this.apiKey}&q=${city}`;

    const response = await fetch(this.cityURI + query);
    // turn response into data
    const data = await response.json();
    console.log(data);

    return data[0];
  }

  async getWeather(cityKey) {
    const query = `${cityKey}?apikey=${this.apiKey}`;

    const response = await fetch(this.weatherURI + query);
    // turn response into data

    const data = await response.json();
    console.log(data);

    return data[0];
  }
}
