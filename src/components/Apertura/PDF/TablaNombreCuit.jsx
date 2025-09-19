import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import { Col, Row } from 'react-bootstrap'
import { TableRow, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
      "& .MuiTableCell-root": {
        border: "2px solid #CCC"
      }
    },
  });

const TablaNombreCuit = props => {
    const { datosPersonales } = props
    const classes = useStyles();
    return (
        <>
            <Row>
                <Col className="mt-3">
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableBody>
                                <TableRow>
                                    <TableCell style={{"width":"30%"}}>Nombre/s y Apellido</TableCell>
                                    <TableCell colSpan="3">{datosPersonales.nombre} {datosPersonales.apellido}</TableCell>
                                    <TableCell style={{"width":"30%"}}>CUIT/CUIL</TableCell>
                                    <TableCell colSpan="3">{datosPersonales.codigoIdentificacion}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                </Col>
            </Row>
            
        </>
    )
}

TablaNombreCuit.propTypes = {

}

export default TablaNombreCuit
