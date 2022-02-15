import React from 'react';
import {Autocomplete} from '@react-google-maps/api';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Box,
  Grid,
} from '@material-ui/core';

import useStyles from './styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';


const AddLocation = () => {

  console.log('TESTING');

}

const Header = () => {
  const classes = useStyles();

  return (
<AppBar position="static">
  <Toolbar className={classes.toolbar}>
    <Typography variant="h4" className={classes.title}>
          Chat people locations
    </Typography>
    <Box display="flex">
      <Typography variant="h5" className={classes.title}>
          Add new location
      </Typography>
      <Input type="text" className={classes.title} placeholder="nimimerkki" id="nimimerkki">
      </Input>
      <Button class="btn btn-primary" type="submit" onClick={AddLocation}>
        Add
      </Button>
      <Typography variant="h5" className={classes.title}>
        Search
      </Typography>
      <Input type="text" className={classes.title} placeholder="nimimerkki" id="nimimerkki2">
      </Input>
      <Button class="btn btn-primary" type="submit" onClick={AddLocation}>
        Search
      </Button>
    </Box>
  </Toolbar>
</AppBar>

    );
}

export default Header;