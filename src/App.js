import React, { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import ForecastList from './components/ForecastList';
// import axios from 'axios';
import api from './api';
import dayImage from './images/day2.jpg';
import nightImage from './images/night3.jpg';
import { ImSpinner2 } from 'react-icons/im';
import './App.css';
import axios from 'axios';

//openweathermap
const APIkey = '4739904bd0e17a0b10ab5e88b48f19b7';

//weatherapi
// const APIkey = 'a163d19271bb46faa76220341221907';

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
  const [current, setCurrent] = useState({});
  const [currentDate, setCurrentDate] = useState('');
  const [weekday, setWeekday] = useState('');
  const [currentCondition, setCurrentCondition] = useState({});
  const [error, setError] = useState(null);
  const [locData, setLocData] = useState({});

  const settingState = response => {
    setData(response.data);
    setCurrent(response.data.current);
    setCurrentDate(
      new Date(response.data.current.last_updated)
        .toLocaleTimeString()
        .slice(0, 5)
    );
    setWeekday(weekdays[new Date(response.data.current.last_updated).getDay()]);
    setCurrentCondition(response.data.current.condition);
    setForecastData(response.data.forecast.forecastday);
  };

  useEffect(() => {
    try {
      const fetchLocation = async () => {
        const responseIP = await api.get(`/ip.json?&q=auto:ip`);
        const response = await api.get(
          `/forecast.json?&q=${responseIP.data.city}&days=3`
        );
        settingState(response);
      };
      fetchLocation();
    } catch (err) {
      setError(err);
    }
  }, []);

  const onSearchSubmit = async loc => {
    try {
      const response = await api.get(`/forecast.json?&q=${loc}&days=3`);
      console.log(response.data);
      settingState(response);
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
                <h1 className="temperature">{Math.round(current.temp_c)}°C</h1>
                <div className="info-wrapper">
                  <span className="info feels-like">
                    Feels like: {Math.round(current.feelslike_c)}°C
                  </span>
                  <span className="info cloud">
                    Precipitation: {current.precip_mm}/mm
                  </span>
                  <span className="info humidity">
                    Humidity: {current.humidity}%
                  </span>
                  <span className="info wind">
                    Wind: {Math.round(current.wind_kph)}km/h
                  </span>
                </div>
              </div>
            </div>
            <div className="content-right">
              {data.location ? (
                <p className="city">{data.location.name}</p>
              ) : null}
              <div className="last-updated">
                <span className="weekday">{weekday}</span>
                <span>{currentDate}</span>
              </div>
              <div className="current">
                <img className="img-weather" src={currentCondition.icon} />
                <p>{currentCondition.text}</p>
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
        current.is_day === 0
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
