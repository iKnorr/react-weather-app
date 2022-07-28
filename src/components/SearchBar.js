import React, { useState } from 'react';

import './SearchBar.css';

const SearchBar = props => {
  const [inputValue, setInputValue] = useState('');

  const onChangeInputHandler = e => {
    setInputValue(e.target.value);
  };

  const onSubmitHandler = e => {
    e.preventDefault();
    props.onSubmit(inputValue);

    setInputValue('');
  };

  return (
    <div className="search-bar">
      <form onSubmit={onSubmitHandler}>
        <input
          type="text"
          placeholder="Enter Location"
          value={inputValue}
          onChange={onChangeInputHandler}
          autoFocus
        />
      </form>
    </div>
  );
};

export default SearchBar;
