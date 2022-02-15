import React, {useState} from 'react';
import { Grid, Typography, InputLabel, MenuItem, FormControl, Select}
from '@material-ui/core';

import PlaceDetails from '../PlaceDetails/PlaceDetails';
import Image1 from './Images/Janne.JPG';
import Image2 from './Images/Kuva.jpg';

import useStyles from './styles';

const List = () => {
const classes = useStyles();
const [type, setType] = useState('restaurants');
const [rating, setRating] = useState('');


const places = [
  {name: 'Lauri', photo: Image1},
  {name: 'Hanna', photo: Image2},
  {name: 'Kaija'}
]

  return (
      <div className={classes.container}>
        <Typography variant="h4">People in Chat:</Typography>
        <FormControl className={classes.formControl}>
          <InputLabel>Type</InputLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <MenuItem value="restaurants">Restaurants</MenuItem>
            <MenuItem value="hotels">Hotels</MenuItem>
            <MenuItem value="attractions">Attractions</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel>Rating</InputLabel>
          <Select value={rating} onChange={(e) => setRating(e.target.value)}>
            <MenuItem value={0}>All</MenuItem>
            <MenuItem value={3}>Above 3.0</MenuItem>
            <MenuItem value={4}>Above 4.0</MenuItem>
            <MenuItem value={4.5}>Above 4.5</MenuItem>
          </Select>
        </FormControl>
        <Grid container spacing={3} className={classes.list}>
          {places?.map(( place, i) => (
                <Grid item key={i} xs={12}>
                  <PlaceDetails place={place} />
        </Grid>
                ))}
        </Grid>
      </div>
  );
}

export default List;