import React, {useEffect, useState} from 'react'

import Button from '@material-ui/core/Button';
import { IconButton } from '@material-ui/core';
import logo from './../../images/logo.png'
import GreenButton from './../Buttons/GreenButton'
import BlueButton from './../Buttons/BlueButton'
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import { useHistory } from "react-router-dom";

import {
    AppBar,
    Toolbar,
    Typography,
  } from "@material-ui/core";
 
import './style.css'
  
const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
}));

const Bar = ({loggedIn}) => {
  
    let history = useHistory(); 
    const classes = useStyles();

    // useEffect(() => {
    //   debugger
    //     if (token !== null) 
    //       setLoggedIn(true)

    // }, [token]);


    const cerrarSesion = () => {
      history.push('/login')
    }

    return (
            <AppBar style={{marginBottom : 50}} position="static" color="transparent">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                      <img src={logo} alt="Logo" width={120}/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                    </Typography>
                    <Button>INICIO</Button>
                    <Button>QUIENES SOMOS</Button>
                    <Button>SERVICIOS</Button>
                    {/* <Button>RESEARCH</Button>
                    <Button>OPERAR</Button>
                    <Button>P.U.C.</Button>
                    <Button>HECHOS RELEVANTES</Button> */}
                    
                    <BlueButton text="MI CUENTA"></BlueButton>
                    
                    {
                      loggedIn ? <Button onClick={cerrarSesion}>Cerrar Sesión</Button> : <GreenButton text="ABRIR CUENTA"></GreenButton>
                    }
                    
                </Toolbar>
            </AppBar>
    )
}


Bar.propTypes = {

}


export default Bar
