import React, {useEffect, useState} from 'react';
import { Grid, Typography, InputLabel, MenuItem, FormControl, Select}
from '@material-ui/core';

import PlaceDetails from '../PlaceDetails/PlaceDetails';
import Image1 from './Images/Janne.JPG';
import Image2 from './Images/Kuva.jpg';

import useStyles from './styles';
import axios from 'axios';

const people =[
  {name: 'Hanna', photo: Image2},
  {name: 'Rickey', photo: Image1},
  {name: 'Michael'},
  {name: 'John'},
  {name: 'Rickey'},
  {name: 'Michael'}
]


const List = ({type, setType, rating, setRating}) => {

const classes = useStyles();
const [user, setUser] = useState('');
const [users, setUsers] = useState([]);

  useEffect(() => {


    let userObject = {

      nimimerkki: user

    }

    console.log('effect')
    axios
    .get('http://localhost:3001/kayttaja?nimimerkki=' + userObject.nimimerkki)
    .then(response => {
      console.log('Listaaminen onnistui!')
      setUsers(response.data)
    })

  }, [])



  return (
      <div className={classes.container}>
        <Typography variant="h4">Chatissa olevat ihmiset:</Typography>
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
          {people?.map(( user, i) => (
                <Grid item key={i} xs={12}>
                  <PlaceDetails user={user} />
        </Grid>
                ))}
        </Grid>
      </div>
  );
}

export default List;