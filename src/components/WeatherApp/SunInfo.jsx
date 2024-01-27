import React from 'react';
import "./WeatherApp.css";
import sunriseImage from '../assets/sunrise.png';
import sunsetImage from '../assets/sunset.png';

const SunInfo = ({ sunrise, sunset }) => {
  return (
    <div className="element">
        <img src={sunriseImage} alt="Sunrise" className="icon" />
        <span className='title'>Sunrise:</span>
        <span className='data'>{sunrise}</span>
        <img src={sunsetImage} alt="Sunset" className="icon" />
        <span className='title'>Sunset:</span>
        <span className='data'>{sunset}</span>
    </div>
  );
};

export default SunInfo;