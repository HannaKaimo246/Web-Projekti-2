import React from 'react';
import {Box, Typography,  Button, Card, CardMedia, CardContent} from '@material-ui/core';


import useStyles from './styles';

const PlaceDetails = ({place}) => {

  const classes = useStyles();

  return (
      <Card elevation={6}>
  <CardMedia
      style={{height:250}}
      image={place.photo}
      title={place.name}
  />
  <CardContent>
  <Typography gutterBottom variant="h5">{place.name}</Typography>
    <Box display="flex" justifyContent="space-between">
    </Box>
  </CardContent>
     </Card>
  );
}

export default PlaceDetails;