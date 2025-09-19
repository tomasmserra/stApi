import React from 'react'
import PropTypes from 'prop-types'
import { Container, Col, Row } from 'react-bootstrap'
import { Field, Form, FormSpy } from 'react-final-form';
import RFTextField from './../../../modules/form/RFTextField';
import { Typography, TableRow, TableHead, TableBody, Table, Paper, TableCell, TableContainer } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';


const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);
  
  
  const useStyles = makeStyles({
    table: {
      minWidth: 700,
    },
  });

const ConocimientoInversiones = props => {
    const classes = useStyles();

    return (
        <>
            <Row className="mt-3">
                <Col xs={12}>
                    <Typography><b>b) Grado de conocimiento sobre inversiones (marcar el que considere correcto).</b></Typography>
                </Col>
            </Row>
            <Row className="mt-2">
                <Col>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell align="center">Limitado</StyledTableCell>
                                    <StyledTableCell align="center">Bueno</StyledTableCell>
                                    <StyledTableCell align="center">Amplio</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            
                            <StyledTableRow>
                                    <StyledTableCell component="th" scope="row">Bonos</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Field
                                            name="conocimientoBonos"
                                            component="input"
                                            type="radio"
                                            value="BONOS_LIMITADO"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Field
                                            name="conocimientoBonos"
                                            component="input"
                                            type="radio"
                                            value="BONOS_BUENO"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Field
                                            name="conocimientoBonos"
                                            component="input"
                                            type="radio"
                                            value="BONOS_AMPLIO"
                                        />
                                    </StyledTableCell>
                                    
                                </StyledTableRow>

                                <StyledTableRow>
                                    <StyledTableCell component="th" scope="row">Acciones</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Field
                                            name="conocimientoAcciones"
                                            component="input"
                                            type="radio"
                                            value="ACCIONES_LIMITADO"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Field
                                            name="conocimientoAcciones"
                                            component="input"
                                            type="radio"
                                            value="ACCIONES_BUENO"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Field
                                            name="conocimientoAcciones"
                                            component="input"
                                            type="radio"
                                            value="ACCIONES_AMPLIO"
                                        />
                                    </StyledTableCell>
                                    
                                </StyledTableRow>

                                <StyledTableRow>
                                    <StyledTableCell component="th" scope="row">Opciones</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Field
                                            name="conocimientoOpciones"
                                            component="input"
                                            type="radio"
                                            value="OPCIONES_LIMITADO"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Field
                                            name="conocimientoOpciones"
                                            component="input"
                                            type="radio"
                                            value="OPCIONES_BUENO"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Field
                                            name="conocimientoOpciones"
                                            component="input"
                                            type="radio"
                                            value="OPCIONES_AMPLIO"
                                        />
                                    </StyledTableCell>
                                    
                                </StyledTableRow>

                                <StyledTableRow>
                                    <StyledTableCell component="th" scope="row">Futuros</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Field
                                            name="conocimientoFuturos"
                                            component="input"
                                            type="radio"
                                            value="FUTUROS_LIMITADO"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Field
                                            name="conocimientoFuturos"
                                            component="input"
                                            type="radio"
                                            value="FUTUROS_BUENO"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Field
                                            name="conocimientoFuturos"
                                            component="input"
                                            type="radio"
                                            value="FUTUROS_AMPLIO"
                                        />
                                    </StyledTableCell>
                                    
                                </StyledTableRow>

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Col>
            </Row>
        </>
    )
}

ConocimientoInversiones.propTypes = {

}

export default ConocimientoInversiones
