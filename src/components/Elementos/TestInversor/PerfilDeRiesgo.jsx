import React from 'react'
import PropTypes from 'prop-types'
import { Container, Col, Row } from 'react-bootstrap'
import { Field, Form, FormSpy } from 'react-final-form';
import RFTextField from './../../../modules/form/RFTextField';
import { Typography, TableRow, Table, Paper, TableCell, TableContainer } from '@material-ui/core';

const PerfilDeRiesgo = props => {
    return (
        <>
            <Row className="mt-3">
                <Col xs={12}>
                    <Typography><b>e) Según cuestionario de Perfil de Riesgo del Inversor suscripto y teniendo en cuenta lo detallado considero que mi tolerancia al riesgo podría encuadrarse como:</b></Typography>
                </Col>
            </Row>
            <Row className="mt-2">
                <Col>
                <TableContainer component={Paper}>
                            <Table aria-label="customized table">
                                <TableRow>
                                        <TableCell component="th" scope="row">RB - Riesgo Bajo</TableCell>
                                        <TableCell align="center">
                                            <Field
                                                name="riesgoConsiderado"
                                                component="input"
                                                type="radio"
                                                value="BAJO"
                                            />
                                        </TableCell>
                                </TableRow>
                                <TableRow>
                                        <TableCell component="th" scope="row">RM - Riesgo Medio</TableCell>
                                        <TableCell align="center">
                                            <Field
                                                name="riesgoConsiderado"
                                                component="input"
                                                type="radio"
                                                value="MEDIO"
                                            />
                                        </TableCell>
                                </TableRow>
                                <TableRow>
                                        <TableCell component="th" scope="row">RA - Riesgo Alto</TableCell>
                                        <TableCell align="center">
                                            <Field
                                                name="riesgoConsiderado"
                                                component="input"
                                                type="radio"
                                                value="ALTO"
                                            />
                                        </TableCell>
                                </TableRow>
                            </Table>
                    </TableContainer>
                </Col>
            </Row>
        </>
    )
}

PerfilDeRiesgo.propTypes = {

}

export default PerfilDeRiesgo
