import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


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


const TablaBancos = props => {
    const classes = useStyles();
    const { rows } = props
    
    return (
        <TableContainer component={Paper} className="mt-5">
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell><b>Tipo de Cuenta</b></TableCell>
                        <TableCell align="right"><b>Moneda</b></TableCell>
                        {/* <TableCell align="right"><b>Alias</b></TableCell> */}
                        <TableCell align="right"><b>CBU/CVU</b></TableCell>
                        {/* <TableCell align="right"><b>Nro. de Cuenta</b></TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.cbu}>
                            <TableCell component="th" scope="row">
                                {row.tipo  === "CAJA_AHORRO" ? "Caja de ahorro" : "Cuenta corriente"}
                            </TableCell>
                            <TableCell align="right">{row.moneda === "DOLAR" ? "U$D - Dolar Americano" : "$ - Pesos Argentino" }</TableCell>
                            {/* <TableCell align="right">{row.alias}</TableCell> */}
                            <TableCell align="right">{row.cbu}</TableCell>
                            {/* <TableCell align="right">{row.cuenta}</TableCell> */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

TablaBancos.propTypes = {

}

export default TablaBancos
