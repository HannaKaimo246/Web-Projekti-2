import React from 'react';
import GoogleMapReact from 'google-map-react';
import {Paper, Typography, useMediaQuery} from '@material-ui/core';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import Rating from '@material-ui/lab/Rating';

import useStyles from './styles';


const Map = ({setCoordinates, setBounds, coordinates, places, weatherData})=> {
const classes = useStyles();
const isDesktop = useMediaQuery('(min-width:600px)');

const coords = [60.192059, 24.945831]


  return (
     <div className={classes.mapContainer}>
       <GoogleMapReact
           bootstrapURLKeys={{ key:'AIzaSyDkaIAq2l6wA4bJYafEwzPCREl8ZG8O6XY'}}
       defaultCenter={coordinates}
       center={coordinates}
       defaultZoom= {14}
       margin={[50,50,50,50]}
       options={''}
       onChange={(e) => {
       setCoordinates({lat: e.center.lat, lng: e.center.lng});
       setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw});
       }}
           onChildClick={''}
         >
         {places?.map((place, i) => (
             <div
                 className={classes.markerContainer}
                 lat={Number(place.latitude)}
                 lng={Number(place.longitude)}
                 key={i}
             >  {
               !isDesktop ? (
                   <LocationOnOutlinedIcon color="primary" fontSize="large" />
                   ) : (
                       <Paper elevation={3} className={classes.paper}>
                          <Typography className={classes.typography} gutterBottom>
                            {place.name}
                          </Typography>
                         <Rating size="small" value={Number(place.rating)} readOnly/>
                       </Paper>
               )}
             </div>
             ))}
         {weatherData?.list?.map((data, i) => (
             <div key={i} lat={data.coords.lat} lng={data.coords.lng}>
               <img height="70px" src={`http://openweathermap.org/img/wn/10d@2x}.png`}
               alt="sääikonit"/>
             </div>
         ))}
         <LocationOnOutlinedIcon color="primary" font-size="large" position={setBounds} >
           <Paper>
         <Typography>Hanna</Typography>
           </Paper>
         </LocationOnOutlinedIcon>
       </GoogleMapReact>
           </div>
       )
}

export default Map;