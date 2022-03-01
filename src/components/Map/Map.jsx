import React, {useState} from 'react';
import GoogleMapReact from 'google-map-react';
import {Paper, Typography, useMediaQuery} from '@material-ui/core';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import Rating from '@material-ui/lab/Rating';
import {Marker} from '@react-google-maps/api';

import useStyles from './styles';


const Map = ({setCoordinates, setBounds, coordinates, places, markers, setMarkers})=> {
const classes = useStyles();
const isDesktop = useMediaQuery('(min-width:600px)');


return (
     <div className={classes.mapContainer}>
       <h1>
         <span role="img" aria-label="tent">
           😍
         </span>
       </h1>
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
           onClick={(event) => {
             setMarkers(current => [
                 ...current,
               {
                 lat: event.latLng.lat(),
                 lng: event.latLng.lng(),
                 time: new Date(),
               },
             ]);
           }}
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
                         <Rating size="small" value={Number(place.rating)} readOnly />
                       </Paper>
               )}
             </div>
             ))}
         <LocationOnOutlinedIcon color="primary" font-size="large">
           <Paper>
             <Typography>Hanna</Typography>
           </Paper>
         </LocationOnOutlinedIcon>
         {markers.map((marker) => (
             <Marker
                 key={marker.time.toISOString()}
           position={{lat: marker.lat, lng: marker.lng}}
             />
             ))}
       </GoogleMapReact>
           </div>
       )
}

export default Map;