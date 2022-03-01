import React, {useEffect, useState} from 'react';
import {Grid, Typography, InputLabel, MenuItem, FormControl, Select}
from '@material-ui/core';

import PlaceDetails from '../../components/PlaceDetails/PlaceDetails'

import Image1 from '../../components/List/Images/Janne.JPG'

import Image2 from '../../components/List/Images/Kuva.jpg'

import useStyles from './styles';
import axios from 'axios';

const List = ({type, setType, rating, setRating}) => {

const classes = useStyles();
const [user, setUser] = useState('');
const [users, setUsers] = useState([]);

  useEffect(() => {

      const tokenObject = localStorage.getItem('token')

      if (tokenObject == null)
          return false

      let token = JSON.parse(tokenObject).token

      axios
          .get('http://localhost:8080/api/mapUsers',
              {headers: {Authorization: 'Bearer: ' + token}}
          ).then(response => {
          console.log('Kartan listaaminen onnistui!' + JSON.stringify(response.data))

          let arr = []

          response.data.userdata.forEach((element, index) => {

              if (element.kuva) {
                  arr.push({name: element.sahkoposti, photo: 'http://localhost:8080/' + element.kuva});
              } else {
                  arr.push({name: element.sahkoposti, photo: 'http://localhost:8080/uploads/default-user.png'});
              }


          });

          setUsers(arr)

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
          {users && users?.map(( user, i) => (
                <Grid item key={i} xs={12}>
                  <PlaceDetails user={user} />
        </Grid>
                ))}
        </Grid>
      </div>
  );
}

export default List;