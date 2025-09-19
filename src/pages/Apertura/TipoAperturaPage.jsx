import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import { Typography, Button, Box, Divider } from '@material-ui/core';
import { Container, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useHistory } from "react-router-dom";

const TipoAperturaPage = props => {
    let history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token == null) 
            history.push('/login')
          
    }, []);

    return (
        <>

        <Col xs={12} md={{ span: 8, offset: 2 }}>
            <Box boxShadow={2} pb={3}>
            <Box p={2} pr={4} pl={4} mb={5} bgcolor="#EFEFEF" className="text-center">
                <Typography mt={2}>Elija el tipo de cuenta que desea abrir.</Typography>
            </Box>
            <Container spacing={2}>
                <Row>
                    <Col xs={12} sm={6} className="text-center">
                        <Typography><b>Persona Física</b></Typography>
                        <Divider></Divider>
                        <Link to="/apertura/persona-fisica"><Button className="btn-deal-success mt-3">Iniciar onboarding</Button></Link>
                    </Col>
                    <Col xs={12} sm={6} className="text-center">
                        <Typography><b>Persona Jurídica</b></Typography>
                        <Divider></Divider>
                        <Link to="/apertura/persona-juridica"><Button className="btn-deal-success mt-3">Iniciar onboarding</Button></Link>
                    </Col>
                </Row>
            </Container>
            </Box>
        </Col>
        </>
    )
}

TipoAperturaPage.propTypes = {

}

export default TipoAperturaPage
