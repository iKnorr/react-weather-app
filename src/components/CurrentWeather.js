// import axios from 'axios';
import api from '../api';
import React, { useEffect, useState } from 'react';

// const APIkey = 'd38a5836b054d71acf063bd137a131d4';

const CurrentWeather = props => {
  const [data, setData] = useState({});
  useEffect(() => {
    const getWeather = async () => {
      const response = await api.get(`/forecast.json?&q=london&days=3`);
      // `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${APIkey}`

      setData({
        city: response.data.location.name,
        country: response.data.location.country,
        currentCondition: response.data.current.condition.text,
      });
      // const responseLoc = await axios.get(
      //   `api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`
      // );
      // console.log(responseLoc);
    };
    getWeather();
  }, []);

  return (
    <div>
      <h2>
        {data.city}, {data.country}
      </h2>
      <h2>{data.currentCondition}</h2>
    </div>
  );
};

export default CurrentWeather;
