import React, { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import ForecastList from './components/ForecastList';
import api from './api';
import dayImage from './images/day.jpg';
import nightImage from './images/night.jpg';
import { ImSpinner2 } from 'react-icons/im';

import './App.css';

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const App = () => {
  const [data, setData] = useState({});
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(null);

  const settingState = response => {
    setData({
      city: response.location.name,
      country: response.location.country,
      temp: response.current.temp_c,
      feelslike: response.current.feelslike_c,
      humidity: response.current.humidity,
      precip: response.current.precip_mm,
      wind: response.current.wind_kph,
      date: new Date(response.current.last_updated)
        .toLocaleTimeString()
        .slice(0, 5),
      currentCondition: response.current.condition.text,
      icon: response.current.condition.icon,
      code: response.current.condition.code,
      weekday: weekdays[new Date(response.current.last_updated).getDay()],
      isDay: response.current.is_day,
    });
    setForecastData(response.forecast.forecastday);
  };

  useEffect(() => {
    try {
      const localWeather = async () => {
        const responseIP = await api.get(`/ip.json?&q=auto:ip`);
        const response = await api.get(
          `/forecast.json?&q=${responseIP.data.city}&days=3`
        );
        settingState(response.data);
      };
      localWeather();
    } catch (err) {
      setError(err);
    }
  }, []);

  const onSearchSubmit = async loc => {
    try {
      const response = await api.get(`/forecast.json?&q=${loc}&days=3`);
      console.log(response.data);
      settingState(response.data);
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  const getContent = () => {
    if (data) {
      return (
        <React.Fragment>
          <div className="wrapper">
            <div className="content-left">
              <div>
                <h1 className="temperature">{Math.round(data.temp)}°C</h1>
                <div className="info-wrapper">
                  <span className="info feels-like">
                    Feels like: {Math.round(data.feelslike)}°C
                  </span>
                  <span className="info cloud">
                    Precipitation: {data.precip}/mm
                  </span>
                  <span className="info humidity">
                    Humidity: {data.humidity}%
                  </span>
                  <span className="info wind">
                    Wind: {Math.round(data.wind)}km/h
                  </span>
                </div>
              </div>
            </div>
            <div className="content-right">
              <div className="city-country">
                <p className="city">{data.city},</p>
                <p className="country">{data.country}</p>
              </div>
              <div className="last-updated">
                <span className="weekday">{data.weekday}</span>
                <span>{data.date}</span>
              </div>
              <div className="current">
                <img className="img-weather" src={data.icon} alt={data.code} />
                <p>{data.currentCondition}</p>
              </div>
            </div>
          </div>
          <ForecastList forecastData={forecastData} weekdaysArr={weekdays} />
        </React.Fragment>
      );
    } else {
      return (
        <div className="loading">
          <ImSpinner2 className="spinner" />
          <h2>Results are loading...</h2>
        </div>
      );
    }
  };

  const getErrorView = () => {
    return (
      <div className="error-message">
        <h2>Upps, something went wrong 😱. Please try another Location.</h2>
      </div>
    );
  };

  return (
    <div
      className="container"
      style={
        data.isDay === 0
          ? {
              backgroundImage: `linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.3),
            rgba(0, 0, 0, 0.3)
          ),url(${nightImage})`,
            }
          : {
              backgroundImage: `linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.3),
            rgba(0, 0, 0, 0.3)
          ),url(${dayImage})`,
            }
      }
    >
      <SearchBar onSubmit={onSearchSubmit} />
      {!error ? getContent() : getErrorView()}
    </div>
  );
};

export default App;
