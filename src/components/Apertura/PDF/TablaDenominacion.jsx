import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
      "& .MuiTableCell-root": {
        border: "2px solid #CCC"
      }
    },
  });

const TablaDenominacion = props => {
    const classes = useStyles();
    
    return (
        <>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableBody>
                        <TableRow>
                            <TableCell style={{"width":"30%"}}>Denominación de la cuenta Comitente</TableCell>
                            <TableCell colSpan="3"></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Domicilio de la Cuenta Comitente</TableCell>
                            <TableCell colSpan="3"></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Fecha de Apertura</TableCell>
                            <TableCell></TableCell>
                            <TableCell style={{"width":"30%"}}>Número de Cuenta</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
        </>
    )
}

TablaDenominacion.propTypes = {

}

export default TablaDenominacion
