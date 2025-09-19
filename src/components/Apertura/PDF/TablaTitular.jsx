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

const TablaPersona = props => {
    const classes = useStyles();

    const { persona } = props
    const { datosPersonales, datosContacto, tipo } = persona
    
    return (
        <>

{/* lugarResidencia: "Argentina"
sexo: "masculino" 

pais: "Argentina"
*/}



            <Row className="mt-4">
                <Col><Typography variant="h5">{tipo.replaceAll("_", "-")}:</Typography></Col>
            </Row>
            <Row>
                <Col className="mt-3">
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableBody>
                                <TableRow>
                                    <TableCell style={{"width":"30%"}}>Nombre/s y Apellido</TableCell>
                                    <TableCell colSpan="3">{datosPersonales.nombre} {datosPersonales.apellido}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>DNI / LE / LC</TableCell>
                                    <TableCell>{datosPersonales.tipoDocumento} {datosPersonales.documento}</TableCell>
                                    <TableCell style={{"width":"30%"}}>CUIT / CUIL</TableCell>
                                    <TableCell>{datosPersonales.tipoCodigoIdentificacion} {datosPersonales.codigoIdentificacion}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Extranjeros - CI / Pasaporte</TableCell>
                                    <TableCell> - </TableCell>
                                    <TableCell>Nacionalidad</TableCell>
                                    <TableCell>{datosPersonales.nacionalidad}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Fecha y Lugar de Nacimiento</TableCell>
                                    <TableCell colSpan="3">{datosPersonales.fechaNacimiento} - {datosPersonales.lugarNacimiento}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Domicilio Particular</TableCell>
                                    <TableCell colSpan="3">{datosContacto.direccion} {datosContacto.altura} - Dpto {datosContacto.departamento} - Piso {datosContacto.piso} - {datosContacto.localidad} - CP {datosContacto.codigoPostal}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell colSpan="3">{datosContacto.correoElectronico} {datosContacto.correoElectronico2} {datosContacto.correoElectronico3}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Teléfono Fijo</TableCell>
                                    <TableCell>{datosContacto.telefono}</TableCell>
                                    <TableCell>Teléfono Móvil</TableCell>
                                    <TableCell>{datosContacto.celular}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Condición ante IVA</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>Profesión</TableCell>
                                    <TableCell>{datosPersonales.ocupacion}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Estado Civil</TableCell>
                                    <TableCell>{datosPersonales.estadoCivil}</TableCell>
                                    <TableCell>Nombre/s y Apellido del cónyugue</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>DNI / LE / LC del Cónyugue</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>CUIT / CUIL</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                </Col>
            </Row>
            
        </>
    )
}

TablaPersona.propTypes = {

}

export default TablaPersona
