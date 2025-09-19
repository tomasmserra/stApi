import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '100%',
      },
    },
    table: {
        minWidth: 650,
      },
  }));


const TablaCotitulares = props => {
    const classes = useStyles();
    const { rows } = props
    
    return (
        <TableContainer component={Paper} className="mt-5">
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell><b>Nombre</b></TableCell>
                        <TableCell align="right"><b>Apellido</b></TableCell>
                        <TableCell align="right"><b>Tipo Documento</b></TableCell>
                        <TableCell align="right"><b>Nro. Documento</b></TableCell>
                        <TableCell align="right"><b>Fecha Nacimiento</b></TableCell>
                        {/* <TableCell align="right"><b>Acciones</b></TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        rows.length > 0 ? rows.map((row) => {
                            return <TableRow key={row.nombre || row.datosPersonales.nombre}>
                                <TableCell component="th" scope="row">
                                    {row.nombre || row.datosPersonales.nombre}
                                </TableCell>
                                <TableCell align="right">{row.apellido || row.datosPersonales.apellido}</TableCell>
                                <TableCell align="right">{row.tipoDocumento || row.datosPersonales.tipoDocumento}</TableCell>
                                <TableCell align="right">{row.documento || row.datosPersonales.documento}</TableCell>
                                <TableCell align="right">{row.fechaNacimiento || row.datosPersonales.fechaNacimiento}</TableCell>
                                {/* <TableCell align="right">{row.alias}</TableCell> */}
                                {/* <TableCell align="right"><DeleteIcon /></TableCell> */}
                                {/* <TableCell align="right">{row.cuenta}</TableCell> */}
                            </TableRow>
                            }
                        )
                        :
                        <TableRow>
                            <TableCell colSpan="5" className="text-center">
                                Aún no ha agregado ningún cotitular
                            </TableCell>
                        </TableRow>
                    
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

TablaCotitulares.propTypes = {

}

export default TablaCotitulares
