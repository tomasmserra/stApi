import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Button, Box, Divider, makeStyles } from '@material-ui/core';
import { Container, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles({
    button: {
      background: '#39B54A',
      border: 0,
      borderRadius: 3,
      color: '#FFF',
      padding: '6px 30px',
      "&:hover": {
        textDecoration: 'none',
        color: '#FFF',
      },
    },
  });

const GraciasPorRegistrartePage = props => {
    const classes = useStyles();
    const { email }  = props.match.params
    const proveedor_email = email.match(/@(.*)/) ? "https://www." + email.match(/@(.*)/)[1] : null

    return (
        <>
        <Col xs={12} md={{ span: 6, offset: 3 }}>
            <Box boxShadow={2} pb={3}>
            <Box p={2} pt={4} pr={4} pl={4} className="text-center" >
                <Typography variant="h4">Verificación de email</Typography>
            </Box>
            <Container spacing={2}>
                    <Col xs={12} className="text-center">
                        <Typography variant="h5" className="mt-3 mb-3"  style={{color : "#2D9EE0"}}>¡Ya falta menos!</Typography>
                        <Typography paragraph={true}>Le enviamos un correo a <b>{email}</b> para que pueda validar su mail</Typography>
                        <Divider />
                        
                        <Row className="pt-3">
                            <Col>
                                <small>Si no lo ves en tu bandeja de entrada, revisá la carpeta de spam.</small>
                            </Col>
                        </Row>

                        <Row className="pt-3">
                            <Col>
                                <a href={proveedor_email} color="primary" target="_blank" className={classes.button}>Ir a mi email</a>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} className="pt-4">
                        <Divider />
                        <Box mt={2} className="text-center">
                        <Typography variant="h6">¿Ya tenes cuenta? <Link to="/login" color="primary">Iniciar sesión</Link></Typography>
                        </Box>
                    </Col>
                    
            </Container>
            </Box>
        </Col>
        </>
    )
}

GraciasPorRegistrartePage.propTypes = {

}

export default GraciasPorRegistrartePage
