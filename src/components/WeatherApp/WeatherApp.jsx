import React, { useState } from "react";
import "./WeatherApp.css";

import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";
import drizzle_icon from "../assets/drizzle.png";
import pressure_icon from "../assets/pressure.png";
const WeatherApp = () => {
  let api_key = "e4d474a322c0877f50ad1ce9bfa13d83";

  const [wicon, setWicon] = useState(cloud_icon);
  const search = async () => {
    const element = document.getElementsByClassName("cityInput");
    if (element[0].value === "") {
      return 0;
    }
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=Metric&appid=${api_key}`;

    let response = await fetch(url);
    let data = await response.json();
    const humidity = document.getElementsByClassName("humidity-percent");
    const wind = document.getElementsByClassName("wind-rate");
    const pressure = document.getElementsByClassName("pressure");
    const temperature = document.getElementsByClassName("weather-temp");
    const location = document.getElementsByClassName("weather-location");
    humidity[0].innerHTML = data.main.humidity + "%";
    wind[0].innerHTML = Math.floor(data.wind.speed) + "km/h";
    pressure[0].innerHTML = data.main.pressure + " hPA";
    temperature[0].innerHTML = Math.floor(data.main.temp) + "°C";
    location[0].innerHTML = data.name;

    if (data.weather[0].icon === "01d" || data.weather[0].icon === "01n") {
      setWicon(clear_icon);
    } else if (
      data.weather[0].icon === "02d" ||
      data.weather[0].icon === "02n"
    ) {
      setWicon(cloud_icon);
    } else if (
      data.weather[0].icon === "03d" ||
      data.weather[0].icon === "03n"
    ) {
      setWicon(drizzle_icon);
    } else if (
      data.weather[0].icon === "04d" ||
      data.weather[0].icon === "04n"
    ) {
      setWicon(drizzle_icon);
    } else if (
      data.weather[0].icon === "09d" ||
      data.weather[0].icon === "09n"
    ) {
      setWicon(rain_icon);
    } else if (
      data.weather[0].icon === "10d" ||
      data.weather[0].icon === "10n"
    ) {
      setWicon(rain_icon);
    } else if (
      data.weather[0].icon === "13d" ||
      data.weather[0].icon === "13n"
    ) {
      setWicon(snow_icon);
    } else {
      setWicon(clear_icon);
    }
  };
  return (
    <div className="container">
      <div className="top-bar">
        <input type="text" className="cityInput" placeholder="search" />
        <div
          className="search-icon"
          onClick={() => {
            search();
          }}
        >
          <img src={search_icon} alt="search" />
        </div>
      </div>
      <div className="weather-image">
        <img src={wicon} alt="cloud" />
      </div>
      <div className="weather-temp"></div>
      <div className="weather-location"></div>
      <div class="data-container">
        <div className="element">
          <img src={humidity_icon} alt="" className="icon" />
          <div claqssName="data">
            <div className="humidity-percent"></div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={wind_icon} alt="" className="icon" />
          <div claqssName="data">
            <div className="wind-rate"></div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
        <div className="element">
          <img src={pressure_icon} alt="" className="icon" />
          <div claqssName="data">
            <div className="pressure"></div>
            <div className="text">Pressure</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
