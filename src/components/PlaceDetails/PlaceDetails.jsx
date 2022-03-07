import React, {useState} from 'react';
import {Box, Typography, Card, CardMedia, CardContent} from '@material-ui/core';


import useStyles from './styles';

const PlaceDetails = ({user, locationHandleAdd, locationHandleRemove}) => {

  const classes = useStyles();

  const [nappi, setNappi] = useState(false)

  const handleAdd = () => {

    locationHandleAdd(user.id)

    setNappi(true)

  }

  const handleRemove = () => {

    locationHandleRemove(user.id)

    setNappi(false)

  }

  return (
      <Card elevation={6}>
  <CardMedia
      style={{height:250}}
      image={user.photo}
      title={user.name}
  />
  <CardContent>
  <Typography gutterBottom variant="h5">{user.name}</Typography>
    {!nappi && <button onClick={() => handleAdd()}>Valitse</button> }
    {nappi && <button onClick={() => handleRemove()}>Peruuta</button> }
    <Box display="flex" justifyContent="space-between">
    </Box>
  </CardContent>
     </Card>
  );
}

export default PlaceDetails;