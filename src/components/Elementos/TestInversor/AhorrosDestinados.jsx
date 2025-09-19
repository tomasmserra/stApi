import React from 'react'
import PropTypes from 'prop-types'
import { Container, Col, Row } from 'react-bootstrap'
import { Field, Form, FormSpy } from 'react-final-form';
import RFTextField from './../../../modules/form/RFTextField';
import { Typography, TableRow, TableHead, TableBody, Table, Paper, TableCell, TableContainer } from '@material-ui/core';


const AhorrosDestinados = props => {
    return (
        <>
            <Row className="mt-3">
                <Col xs={12}>
                    <Typography><b>d) Porcentaje de Ahorros destinados a inversiones:</b></Typography>
                </Col>
            </Row>
            <Row className="mt-2">
                <Col>
                    <TableContainer component={Paper}>
                                <Table aria-label="customized table">
                                <TableRow>
                                            <TableCell component="th" scope="row">Menos o igual al 25%</TableCell>
                                            <TableCell align="center">
                                                <Field
                                                    name="porcentajeAhorro"
                                                    component="input"
                                                    type="radio"
                                                    value="MENOS_IGUAL_25"
                                                />
                                            </TableCell>
                                    </TableRow>
                                    <TableRow>
                                            <TableCell component="th" scope="row">Entre el 25% y 50%</TableCell>
                                            <TableCell align="center">
                                                <Field
                                                    name="porcentajeAhorro"
                                                    component="input"
                                                    type="radio"
                                                    value="ENTRE_25_50"
                                                />
                                            </TableCell>
                                    </TableRow>
                                    <TableRow>
                                            <TableCell component="th" scope="row">Entre el 50% y 90%</TableCell>
                                            <TableCell align="center">
                                                <Field
                                                    name="porcentajeAhorro"
                                                    component="input"
                                                    type="radio"
                                                    value="ENTRE_50_90"
                                                />
                                            </TableCell>
                                    </TableRow>
                                    <TableRow>
                                            <TableCell component="th" scope="row">Superior o igual al 90%</TableCell>
                                            <TableCell align="center">
                                                <Field
                                                    name="porcentajeAhorro"
                                                    component="input"
                                                    type="radio"
                                                    value="IGUAL_MAYOR_90"
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

AhorrosDestinados.propTypes = {

}

export default AhorrosDestinados
