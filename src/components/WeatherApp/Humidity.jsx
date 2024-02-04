import React from "react";
import "./WeatherApp.css";
import humidity_icon2 from "../assets/humidity.svg";

const Humidity = ({ humidity }) => {
  return (
    <div className="element">
      <img src={humidity_icon2} alt="humidity" className="icon"/>
      <span className='title'>Humidity:</span>
      <span className='data'>{humidity}</span>
    </div>
  );
};

export default Humidity;