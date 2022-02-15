import axios from "axios";

const URL = 'https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary';

export const getPlacesData = async (sw, ne) => {
  try {
const { data: {data} } = await axios.get(URL, {
      params: {
        bl_latitude: sw.lat,
        tr_latitude: ne.lat,
        bl_longitude: sw.lng,
        tr_longitude: ne.lng
      },
      headers: {
        'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
        'x-rapidapi-key': '7725da6bdemshf33c4f644fb298fp1e7fb2jsn50bb917e5c14'
      }
    });

return data;
  } catch (error) {
console.log(error);
  }
}

export const getWeatherData = async (lat, lng) => {
  try {
    if(lat && lng) {
      const {data} = await axios.get(
          'https://community-open-weather-map.p.rapidapi.com/find', {
            params: {lng: lng, lat: lat},
            headers: {
              'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
              'x-rapidapi-key': '7725da6bdemshf33c4f644fb298fp1e7fb2jsn50bb917e5c14'
            }
          });
      return data;
    }
  }catch (error) {
    console.log(error);
  }
};


