import React from "react";
import "./WeatherApp.css";
import wind_icon2 from "../assets/wind.svg";

const WindSpeed = ({ windSpeed }) => {
  return (
    <div className="element">
      <img src={wind_icon2} alt="wind" className="icon"/>
      <span className='title'>Wind Speed:</span>
      <span className='data'>{windSpeed}</span>
    </div>
  );
};

export default WindSpeed;