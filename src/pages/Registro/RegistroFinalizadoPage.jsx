import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import { Typography, CircularProgress, Box, Divider, makeStyles } from '@material-ui/core';
import { authenticationService } from '../../services'
import { Container, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const PENDIENTE = "pendiente"
const VALIDACION_FALLIDA = "validacion_fallida"
const VALIDACION_EXITOSA = "validacion_exitosa"

const useStyles = makeStyles({
    button: {
      background: '#39B54A',
      border: 0,
      borderRadius: 3,
      color: '#FFF',
      padding: '6px 30px',
      marginTop: '10px',
      "&:hover": {
        textDecoration: 'none',
        color: '#FFF',
      },
    },
  });


const RegistroFinalizadoPage = props => {
    const classes = useStyles();
    const { email, token }  = props.match.params
    const [ estadoValidacionCuenta, setEstadoValidacionCuenta] = useState(PENDIENTE)

    useEffect(() => {
        validarCuenta(token, email)
    }, [token, email]);

    const validarCuenta = (token, email) =>
    {
        authenticationService.validarRegistro(token, email)
        .then(
            response => {
                debugger
                if (response.exitosa) {
                    localStorage.setItem("token", response.token);
                    setEstadoValidacionCuenta(VALIDACION_EXITOSA)
                }
                else
                {
                    setEstadoValidacionCuenta(VALIDACION_FALLIDA)
                }
            },
            error => {
                debugger
                // setSubmitting(false);
                // setStatus(error);
            }
        );
    }

    const renderSwitchMessage = (estadoValidacionCuenta) => {
        switch(estadoValidacionCuenta) {
            case PENDIENTE:
              return <CircularProgress color="secondary" />;
            case VALIDACION_FALLIDA:
              return <Typography paragraph={true}>No pudimos validar tu cuenta</Typography>;
            case VALIDACION_EXITOSA:
              return <Typography paragraph={true}>A continuación le vamos a solicitar sus datos para poder abrir cuenta como persona <b>física o jurídica</b>.</Typography>;
            default:
              return 'Ha ocurrido un error';
          }
    }

    return (
        <Col xs={12} md={{ span: 6, offset: 3 }}>
            <Box boxShadow={2} pb={3}>
            <Box p={2} pt={4} pr={4} pl={4} className="text-center" >
                <Typography variant="h4">Registro</Typography>
            </Box>
            <Container spacing={2} className="text-center">
                    <Col xs={12}>
                        <Typography variant="h5" className="mt-3 mb-3"  style={{color : "#2D9EE0"}}>¡Gracias por registrarse!</Typography>
                        
                        {renderSwitchMessage(estadoValidacionCuenta)}                        
                        
                        <Divider />
                    </Col>
                    <Col xs={12} className="mt-4 mb-3">
                        <Link to="/tipo-apertura" className={classes.button}>Iniciar onboarding</Link>
                    </Col>
                    
                    
            </Container>
            </Box>
        </Col>
    )
}

RegistroFinalizadoPage.propTypes = {

}

export default RegistroFinalizadoPage
