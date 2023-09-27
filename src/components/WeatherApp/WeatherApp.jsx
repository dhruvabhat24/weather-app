/* eslint-disable no-unused-vars */
import React from 'react'
import './WeatherApp.css'

import search_icon from '../../assets/search_icon.svg'
import clear_icon from '../../assets/clear_icon.svg'
import could_icon from '../../assets/cloud_icon.svg'
import rain_icon from '../../assets/rain_icon.svg'
import snow_icon from '../../assets/snow_icon.svg'
import wind_icon from '../../assets/wind_icon.svg'
// eslint-disable-next-line no-unused-vars
import humidity_icon from '../../assets/humidity_icon.svg'
const WeatherApp = () => {
  return (
    <div className='container'>
        <div className='top-bar'>
            <input type="text" className="cityInput" placeholder='search' />
            <div className='search-icon'>
                <img src={search_icon} alt="search" />
        </div>
    </div>
    </div>
  )
}

export default WeatherApp