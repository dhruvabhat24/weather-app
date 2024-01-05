import React, { useEffect, useState } from "react";
import "./WeatherApp.css";

import search_icon from "../assets/search.png";
import search_icon2 from "../assets/search.svg";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import wind_icon2 from "../assets/wind.svg";
import humidity_icon from "../assets/humidity.png";
import humidity_icon2 from "../assets/humidity.svg";
import drizzle_icon from "../assets/drizzle.png";
import pressure_icon from "../assets/pressure.png";
import pressure_icon2 from "../assets/pressure.svg";
const WeatherApp = () => {
  let api_key = "e4d474a322c0877f50ad1ce9bfa13d83";

  const [wicon, setWicon] = useState(cloud_icon);

  const setIconWithIconID = (iconID) => {
    if (iconID === "01d" || iconID === "01n") {
      setWicon(clear_icon);
    } else if (iconID === "02d" || iconID === "02n") {
      setWicon(cloud_icon);
    } else if (iconID === "03d" || iconID === "03n") {
      setWicon(drizzle_icon);
    } else if (iconID === "04d" || iconID === "04n") {
      setWicon(drizzle_icon);
    } else if (iconID === "09d" || iconID === "09n") {
      setWicon(rain_icon);
    } else if (iconID === "10d" || iconID === "10n") {
      setWicon(rain_icon);
    } else if (iconID === "13d" || iconID === "13n") {
      setWicon(snow_icon);
    } else {
      setWicon(clear_icon);
    }
  };

  const search = async () => {
    const element = document.getElementsByClassName("cityInput");
    if (element[0].value === "") {
      return 0;
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=Metric&appid=${api_key}`;

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

    setIconWithIconID(data.weather[0].icon);
  };

  const showWeatherCurrentLocation = async () => {
    const geolocation = navigator.geolocation;
    if (!geolocation) return;

    geolocation.getCurrentPosition(async (position) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=Metric&appid=${api_key}`;
      const response = await fetch(url);
      const data = await response.json();

      const humidityElement = document.querySelector(".humidity-percent");
      const windElement = document.querySelector(".wind-rate");
      const pressureElement = document.querySelector(".pressure");
      const temperatureElement = document.querySelector(".weather-temp");
      const locationElement = document.querySelector(".weather-location");

      humidityElement.innerText = data.main.humidity + "%";
      windElement.innerText = Math.floor(data.wind.speed) + "km/h";
      pressureElement.innerText = data.main.pressure + " hPA";
      temperatureElement.innerText = Math.floor(data.main.temp) + "°C";
      locationElement.innerText = data.name;

      setIconWithIconID(data.weather[0].icon);
    });
  };

  useEffect(() => {
    showWeatherCurrentLocation();
  });

  return (
    <div className="container">
      <div className="top-bar">
        <input type="text" className="cityInput" placeholder="Search" />
        <div
          className="search-icon"
          onClick={() => {
            search();
          }}
        >
          <img src={search_icon2} alt="search" />
        </div>
      </div>

      <div className="main-info">
        <div>
          <div className="weather-image">
            <img src={wicon} alt="cloud" />
          </div>
          <div className="weather-info">
            <div className="weather-temp"></div>
            <div className="weather-location"></div>
          </div>
        </div>

        <div className="data-container">
          <div className="element">
            <img src={humidity_icon2} alt="" className="icon" />
            <div className="data">
              <div className="humidity-percent"></div>
              <div className="text">Humidity</div>
            </div>
          </div>
          <div className="element">
            <img src={wind_icon2} alt="" className="icon" />
            <div className="data">
              <div className="wind-rate"></div>
              <div className="text">Wind Speed</div>
            </div>
          </div>
          <div className="element">
            <img src={pressure_icon2} alt="" className="icon" />
            <div className="data">
              <div className="pressure"></div>
              <div className="text">Pressure</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
