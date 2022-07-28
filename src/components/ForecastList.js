import React from 'react';

import './ForecastList.css';

const ForecastList = props => {
  const weekday = data => {
    const weekdays = props.weekdaysArr;

    return weekdays[new Date(data).getDay()];
  };

  const list = props.forecastData.map(data => {
    return (
      <div key={data.date_epoch} className="daily">
        <h3>{weekday(data.date)}</h3>
        <img src={data.day.condition.icon} />
        <div className="temps-day">
          <span className="temp">{Math.round(data.day.maxtemp_c)}°</span>
          <span className="temp min">{Math.round(data.day.mintemp_c)}°</span>
        </div>
      </div>
    );
  });

  return <div className="list">{list}</div>;
};

export default ForecastList;
