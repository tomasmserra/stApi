import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import { Typography, Button, Box, Divider } from '@material-ui/core';
import { Container, Col, Row } from 'react-bootstrap'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FolderIcon from '@material-ui/icons/Folder';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom'

const AperturaPersonaJuridicaPage = props => {
    
    return (
        <>

        <Col xs={12} md={{ span: 8, offset: 2 }}>
            <Box boxShadow={2} pb={3}>
            <Box p={2} pr={4} pl={4} mb={5} bgcolor="#EFEFEF" className="text-center">
                <Typography mt={2}>Cuenta empresa.</Typography>
            </Box>
            <Container spacing={2}>
                <Row>
                    <Col xs={12}>
                        <Typography paragraph={true}><b>Para realizar una apertura de tipo empresa descargue los siguientes archivos y envíelos a apertura@dealfs.com.ar</b></Typography>
                        <Divider></Divider>
                        <List dense={true} className="mt-4">
                            <ListItem>
                                <ListItemIcon>
                                    <FolderIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="PDF"
                                />
                                    <a target="_blank" href="https://dealfs.com.ar/wp-content/uploads/2018/11/P.FISICA-APERTURA-ALyC-y-FCI-ago2020.pdf">Descargar</a>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <FolderIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Otro archivo"
                                />
                                    <a target="_blank" href="https://dealfs.com.ar/wp-content/uploads/2018/11/P.FISICA-APERTURA-ALyC-y-FCI-ago2020.pdf">Descargar</a>
                            </ListItem>
                        </List>
                    </Col>
                    <Col xs={12} className="text-right mt-3" >
                        <Link to="/tipo-apertura" className="btn btn-secondary">Volver Atrás</Link>
                    </Col>
                    
                </Row>
            </Container>
            </Box>
        </Col>
        </>
    )
}

AperturaPersonaJuridicaPage.propTypes = {

}

export default AperturaPersonaJuridicaPage
