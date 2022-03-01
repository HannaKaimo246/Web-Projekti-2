import React from 'react';
import {Box, Typography, Card, CardMedia, CardContent} from '@material-ui/core';


import useStyles from './styles';

const PlaceDetails = ({user}) => {

  const classes = useStyles();

  return (
      <Card elevation={6}>
  <CardMedia
      style={{height:250}}
      image={user.photo}
      title={user.name}
  />
  <CardContent>
  <Typography gutterBottom variant="h5">{user.name}</Typography>
    <Box display="flex" justifyContent="space-between">
    </Box>
  </CardContent>
     </Card>
  );
}

export default PlaceDetails;