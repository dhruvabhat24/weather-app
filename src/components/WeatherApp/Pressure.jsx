import React from "react";
import "./WeatherApp.css";
import pressure_icon2 from "../assets/pressure.svg";

const Pressure = ({ pressure }) => {
  return (
    <div className="element">
      <img src={pressure_icon2} alt="pressure" className="icon"/>
      <span className='title'>Pressure: </span>
      <span className='data'>{pressure}</span>
    </div>
  );
};

export default Pressure;