import React from 'react'
import PropTypes from 'prop-types'
import { blue } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';

const ColorButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(blue[500]),
      backgroundColor: blue[500],
      '&:hover': {
        backgroundColor: blue[700],
      },
    },
  }))(Button);
  
  const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
  }));

const GreenButton = props => {
    const classes = useStyles();
    return (
        <ColorButton variant="contained" color="primary" className={classes.margin}>
            { props.text }
        </ColorButton>
    )
}

GreenButton.propTypes = {

}

export default GreenButton
