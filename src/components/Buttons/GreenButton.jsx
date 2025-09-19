import React from 'react'
import PropTypes from 'prop-types'
import { green, purple } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';

const ColorButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(purple[500]),
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[700],
      },
    },
  }))(Button);
  
  const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
  }));

const GreenButton = ({cerrarSesion, text }) => {
    const classes = useStyles();
    
    return (
        <ColorButton variant="contained" color="primary" className={classes.margin} onClick={cerrarSesion}>
            { text }
        </ColorButton>
    )
    
}

GreenButton.propTypes = {

}

export default GreenButton
