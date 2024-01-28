import React from 'react';
import "./WeatherApp.css";
import tempImage from '../assets/temp.png';

const SunInfo = ({temp}) => {
  return (
    <div className="element">
        <img src={tempImage} alt="Sunrise" className="icon" />
        <span className='title'>feels like:</span>
        <span className='data'>{temp}</span>
    </div>
  );
};

export default SunInfo;