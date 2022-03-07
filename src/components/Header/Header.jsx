import React, {useState} from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box
} from '@material-ui/core';

import useStyles from './styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import { Autocomplete } from '@react-google-maps/api';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

const AddLocation = () => {

  let ownUser = document.getElementById('nimimerkki').value;

  let circle =
    {
      id: 1,
      name: ownUser,
      latitude: 60.192059,
      longitude: 24.945831,
      circle: {
        options: {
          strokeColour: 'red',
        },
        radius: 5000

      },
    }

  console.log(circle.name);

}

const Header = ({setCoordinates}) => {
  const classes = useStyles();
  const [AutoComplete, setAutoComplete] = useState(null);

  const onLoad = (AutoC) => setAutoComplete(AutoC);

const onPlaceChanged = () => {

  const lat = AutoComplete.getPlace().geometry.location.lat();
  const lng = AutoComplete.getPlace().geometry.location.lng();

  setCoordinates({lat, lng});

}


  return (
<AppBar position="static" id="appBar">
  <Toolbar className={classes.toolbar}>
    <Typography variant="h4" className={classes.title}>
          Chat Kartta
    </Typography>
    <Box display="flex">
      <Typography variant="h5" className={classes.title}>
        Etsi
      </Typography>
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <div className={classes.search}>
<div className={classes.searchIcon}>
<SearchIcon />
</div>
          <InputBase placeholder="Search..." classes={{root: classes.search}} />
        </div>
      </Autocomplete>
      <Button class="btn btn-primary" type="submit">
        Etsi
      </Button>
    </Box>
  </Toolbar>
</AppBar>

    );
}

export default Header;