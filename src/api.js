import axios from 'axios';

export default axios.create({
  baseURL: 'http://api.weatherapi.com/v1',
  headers: {
    key: 'a163d19271bb46faa76220341221907',
  },
});
