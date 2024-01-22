import React, { useEffect, useState, useCallback } from "react";
import "./WeatherApp.css";
import search_icon2 from "../assets/search.svg";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon2 from "../assets/wind.svg";
import humidity_icon2 from "../assets/humidity.svg";
import drizzle_icon from "../assets/drizzle.png";
import pressure_icon2 from "../assets/pressure.svg";

const WeatherApp = () => {
  const api_key = process.env.REACT_APP_API_KEY;
  const [wicon, setWicon] = useState(cloud_icon);
  const [is24HourFormat, setIs24HourFormat] = useState(true);
  const [weatherData, setWeatherData] = useState({
    humidity: "",
    windSpeed: "",
    pressure: "",
    temperature: "",
    location: "",
    currentTime: "",
    currentDate: "",
    currentDay: "",
  });

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

  const formatDateTime = (date, is24HourFormat) => {
    try {
      const options = {
        hour: "numeric",
        minute: "numeric",
        hour12: !is24HourFormat,
      };

      return date.toLocaleString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const toggleTimeFormat = () => {
    setIs24HourFormat((prevFormat) => !prevFormat);
    setWeatherData((prevData) => ({
      ...prevData,
      currentTime: formatDateTime(new Date(), !is24HourFormat),
    }));
  };

  const search = async () => {
    const element = document.getElementsByClassName("cityInput");
    if (element[0].value === "") {
      return 0;
    }
  
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=Metric&appid=${api_key}`;
  
    try {
      let response = await fetch(url);
      let data = await response.json();
  
      console.log("Weather API response:", data);
  
      setWeatherData({
        humidity: data.main.humidity + "%",
        windSpeed: Math.floor(data.wind.speed) + "km/h",
        pressure: data.main.pressure + " hPA",
        temperature: Math.floor(data.main.temp) + "°C",
        location: data.name,
        timezone: data.timezone,
        currentTime: formatDateTime(new Date(data.dt * 1000), is24HourFormat),
        currentDate: new Date(data.dt * 1000).toLocaleDateString(),
        currentDay: new Date(data.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
      });
  
      setIconWithIconID(data.weather[0].icon);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const showWeatherCurrentLocation = useCallback(async () => {
    const geolocation = navigator.geolocation;
    if (!geolocation) return;
  
    geolocation.getCurrentPosition(async (position) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=Metric&appid=${api_key}`;
  
      try {
        const response = await fetch(url);
        const data = await response.json();
  
        console.log("Weather API response:", data);
  
        setWeatherData({
          humidity: data.main.humidity + "%",
          windSpeed: Math.floor(data.wind.speed) + "km/h",
          pressure: data.main.pressure + " hPA",
          temperature: Math.floor(data.main.temp) + "°C",
          location: data.name,
          timezone: data.timezone,
          currentTime: new Date(data.dt * 1000).toLocaleTimeString(),
          currentDate: new Date(data.dt * 1000).toLocaleDateString(),
          currentDay: new Date(data.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
        });
  
        setIconWithIconID(data.weather[0].icon);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    });
  }, [api_key]);
  

  useEffect(() => {
    showWeatherCurrentLocation();
  }, [showWeatherCurrentLocation]);

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
            <div className="weather-temp">{weatherData.temperature}</div>
            <div className="weather-location">{weatherData.location}</div>
            <div className="weather-time">
            <button className="time-format-button" onClick={toggleTimeFormat}>Toggle Time Format</button>
              <p></p>{weatherData.currentTime}</div>
            <div className="weather-date">{weatherData.currentDate}</div>
            <div className="weather-day">{weatherData.currentDay}</div>
          </div>
        </div>

        <div className="data-container">
          <div className="element">
            <img src={humidity_icon2} alt="" className="icon" />
            <div className="data">
              <div className="humidity-percent">{weatherData.humidity}</div>
              <div className="text">Humidity</div>
            </div>
          </div>
          <div className="element">
            <img src={wind_icon2} alt="" className="icon" />
            <div className="data">
              <div className="wind-rate">{weatherData.windSpeed}</div>
              <div className="text">Wind Speed</div>
            </div>
          </div>
          <div className="element">
            <img src={pressure_icon2} alt="" className="icon" />
            <div className="data">
              <div className="pressure">{weatherData.pressure}</div>
              <div className="text">Pressure</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;