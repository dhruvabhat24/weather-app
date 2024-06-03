import React, { useEffect, useState, useCallback, useRef } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import "./WeatherApp.css";
import search_icon2 from "../assets/search.svg";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import drizzle_icon from "../assets/drizzle.png";
import Humidity from "./Humidity";
import WindSpeed from "./WindSpeed";
import Pressure from "./Pressure";
import SunInfo from "./SunInfo";
import TempInfo from "./TempInfo";
import { ToastContainer, toast } from "react-toastify";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const WeatherApp = () => {
  const api_key = process.env.REACT_APP_API_KEY;
  const api_key2 = process.env.REACT_APP_WEATHERBIT_API_KEY;
  const [wicon, setWicon] = useState(cloud_icon);
  const [is24HourFormat, setIs24HourFormat] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tempData, setTemp] = useState({
    temp: "",
  });
  const [sunInfoData, setSuninfo] = useState({
    sunriseTime: "",
    sunsetTime: "",
  });
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
  // eslint-disable-next-line
  const [lastSixDaysData, setLastSixDaysData] = useState([]);

  const element = useRef();

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      search();
    }
  };

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

  const downloadReport = async () => {
    try {
      const cityName = element.current.value;

      if (!cityName) {
        console.error("City name is not provided.");
        return;
      }

      const lastSixDaysData = await fetchLastSixDaysWeather(cityName);

      const docDefinition = {
        content: [
          { text: "Weather Report", fontSize: 16, bold: true },
          { text: `City Name: ${cityName}`, margin: [0, 5, 0, 5] },
          {
            style: "tableExample",
            table: {
              headerRows: 1,
              widths: ["*", "*"],
              body: [
                ["Date", "Temperature"],
                ...lastSixDaysData.map((day) => [
                  day.valid_date || "Unknown",
                  `${day.temp}°C` || "Unknown",
                ]),
              ],
            },
          },
        ],
        // additional PDF styles if needed
        styles: {
          tableExample: {
            margin: [0, 5, 0, 15],
          },
        },
      };

      // create a PDF document and trigger download
      pdfMake.createPdf(docDefinition).download("weather_report.pdf");
    } catch (error) {
      console.error("Error fetching last six days weather:", error);
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
    if (element.current.value === "") {
      return 0;
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${element.current.value}&units=Metric&appid=${api_key}`;

    try {
      let response = await fetch(url);

      if (response.status === 404) {
        toast.error("City not found!");
        return;
      }

      let data = await response.json();

      setWeatherData({
        humidity: data.main.humidity + "%",
        windSpeed: Math.floor(data.wind.speed) + "km/h",
        pressure: data.main.pressure + " hPA",
        temperature: Math.floor(data.main.temp) + "°C",
        location: data.name,
        timezone: data.timezone,
        currentTime: formatDateTime(new Date(data.dt * 1000), is24HourFormat),
        currentDate: new Date(data.dt * 1000).toLocaleDateString(),
        currentDay: new Date(data.dt * 1000).toLocaleDateString("en-US", {
          weekday: "long",
        }),
      });
      setSuninfo({
        sunriseTime: "6:45",
        sunsetTime: "6:10",
      });
      setTemp({
        temp: "4°C",
      });

      setIconWithIconID(data.weather[0].icon);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const fetchLastSixDaysWeather = async (cityName) => {
    const apiKey = api_key2;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    try {
      setLoading(true);
      const coordUrl = `https://api.weatherbit.io/v2.0/current?city=${cityName}&key=${apiKey}`;
      const coordResponse = await fetch(coordUrl, { headers });

      if (!coordResponse.ok) {
        throw new Error(
          `Failed to fetch coordinates. Status: ${coordResponse.status}`,
        );
      }

      const coordData = await coordResponse.json();

      if (
        !coordData ||
        !coordData.data ||
        !coordData.data[0] ||
        !coordData.data[0].lat ||
        !coordData.data[0].lon
      ) {
        throw new Error("Coordinates not available in the response.");
      }

      const location = {
        lat: coordData.data[0].lat,
        lon: coordData.data[0].lon,
      };

      // Step 2: Fetch last six days weather based on coordinates
      const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${location.lat}&lon=${location.lon}&key=${apiKey}`;
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch weather data. Status: ${response.status}`,
        );
      }

      const data = await response.json();

      if (data.data && data.data.length >= 7) {
        const lastSixDaysWeather = data.data.slice(1, 7);
        setLastSixDaysData(lastSixDaysWeather);

        return lastSixDaysWeather;
      } else {
        throw new Error("Unexpected response format from the weather API.");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    } finally {
      setLoading(false);
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

        setWeatherData({
          humidity: data.main.humidity + "%",
          windSpeed: Math.floor(data.wind.speed) + "km/h",
          pressure: data.main.pressure + " hPA",
          temperature: Math.floor(data.main.temp) + "°C",
          location: data.name,
          timezone: data.timezone,
          currentTime: new Date(data.dt * 1000).toLocaleTimeString(),
          currentDate: new Date(data.dt * 1000).toLocaleDateString(),
          currentDay: new Date(data.dt * 1000).toLocaleDateString("en-US", {
            weekday: "long",
          }),
        });

        setIconWithIconID(data.weather[0].icon);

        //personalize below as you want

        // const sunResponse = await fetch('here set the url you want to get info');
        // const sunData = await sunResponse.json();
        // setSuninfo({
        //   sunriseTime: sunData.results.sunrise,
        //   sunsetTime: sunData.results.sunset,
        // });
        setSuninfo({
          sunriseTime: "",
          sunsetTime: "",
        });
        setTemp({
          temp: "",
        });
        // after that delet below
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
        <input
          type="text"
          className="cityInput"
          placeholder="Search"
          onKeyDown={handleKeyPress}
          ref={element}
        />
        <div
          className="search-icon"
          onClick={() => {
            search();
          }}
        >
          <img src={search_icon2} alt="search" />
        </div>

        <div className="report-buttons">
          <button
            onClick={() => fetchLastSixDaysWeather(element.current.value)}
          >
            Fetch Report
          </button>
          <button onClick={downloadReport}>Download Report</button>
        </div>
      </div>
      <div className="loading">{loading && <p>Loading...</p>}</div>

      <div className="main-info">
        {/* Left Side Icons */}
        <div className="city-info">
          <div className="weather-image">
            <img src={wicon} alt="cloud" />
          </div>
          <div className="weather-info">
            <div className="weather-temp data">{weatherData.temperature}</div>
            <div className="weather-location data">{weatherData.location}</div>
            <div className="weather-time data">
              <button className="time-format-button" onClick={toggleTimeFormat}>
                Toggle Time Format
              </button>
              <br />
              <br />
              <p className="time">{weatherData.currentTime}</p>
            </div>
            <div className="weather-date title">{weatherData.currentDate}</div>
            <div className="weather-day title">{weatherData.currentDay}</div>
          </div>
        </div>

        {/* Middle Side Icons */}
        <div className="weather-data">
          <Humidity humidity={weatherData.humidity} />
          <WindSpeed windSpeed={weatherData.windSpeed} />
          <Pressure pressure={weatherData.pressure} />
        </div>

        {/* Right Side Icons */}
        <div className="sun-temp-info">
          <TempInfo temp={tempData.temp} />
          <SunInfo
            sunrise={sunInfoData.sunriseTime}
            sunset={sunInfoData.sunsetTime}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default WeatherApp;
