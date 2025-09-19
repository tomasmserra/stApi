import React from 'react'
import PropTypes from 'prop-types'
import { Container, Col, Row } from 'react-bootstrap'
import { Field, Form, FormSpy } from 'react-final-form';
import RFTextField from './../../../modules/form/RFTextField';
import { Typography, TableRow, Table, Paper, TableCell, TableContainer } from '@material-ui/core';

const HorizonteInversion = props => {
    return (
        <>
            <Row className="mt-3">
                <Col xs={12}>
                    <Typography><b>e) Horizonte de Inversión Promedio</b></Typography>
                </Col>
            </Row>
            <Row className="mt-2">
                <Col>
                <TableContainer component={Paper}>
                            <Table aria-label="customized table">
                                <TableRow>
                                        <TableCell component="th" scope="row">De Corto Plazo (hasta un año)</TableCell>
                                        <TableCell align="center">
                                            <Field
                                                name="horizonteInversion"
                                                component="input"
                                                type="radio"
                                                value="CORTO_PLAZO"
                                            />
                                        </TableCell>
                                </TableRow>
                                <TableRow>
                                        <TableCell component="th" scope="row">De Mediano Plazo (entre un año y dos)</TableCell>
                                        <TableCell align="center">
                                            <Field
                                                name="horizonteInversion"
                                                component="input"
                                                type="radio"
                                                value="MEDIANO_PLAZO"
                                            />
                                        </TableCell>
                                </TableRow>
                                <TableRow>
                                        <TableCell component="th" scope="row">De Largo Plazo (superior a dos años)</TableCell>
                                        <TableCell align="center">
                                            <Field
                                                name="horizonteInversion"
                                                component="input"
                                                type="radio"
                                                value="LARGO_PLAZO"
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

HorizonteInversion.propTypes = {

}

export default HorizonteInversion
