import React from 'react'
import PropTypes from 'prop-types'
import { Container, Col, Row } from 'react-bootstrap'
import { Field, Form, FormSpy } from 'react-final-form';
import RFTextField from './../../../modules/form/RFTextField';
import { Typography, TableRow, TableHead, TableBody, Table, Paper, TableCell, TableContainer } from '@material-ui/core';

const ObjetivoInversion = props => {
    return (
        <>
            <Row className="mt-3">
                <Col xs={12}>
                    <Typography><b>c) Objetivo de inversión</b></Typography>
                </Col>
            </Row>
            <Row className="mt-2">
                <Col>
                <TableContainer component={Paper}>
                        <Table aria-label="customized table">
                            <TableRow>
                                    <TableCell component="th" scope="row">Priorizo conservar el valor de mis activos a lo largo del tiempo (Riesgo Bajo a Medio)</TableCell>
                                    <TableCell align="center">
                                        <Field
                                            name="objetivoInversion"
                                            component="input"
                                            type="radio"
                                            value="OBJETIVO_RIESGO_BAJO_MEDIO"
                                        />
                                    </TableCell>
                            </TableRow>
                            <TableRow>
                                    <TableCell component="th" scope="row">Priorizo obtener una renta, que supere el valor de mis activos en el tiempo (Riesgo Alto)</TableCell>
                                    <TableCell align="center">
                                        <Field
                                            name="objetivoInversion"
                                            component="input"
                                            type="radio"
                                            value="OBJETIVO_RIESGO_ALTO"
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

ObjetivoInversion.propTypes = {

}

export default ObjetivoInversion
