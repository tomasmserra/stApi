import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Container, Col, Row } from 'react-bootstrap'
import { Typography, Divider, Box, Button } from '@material-ui/core'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import CajaFirma from './CajaFirma'
import img from '../../../images/pdf_back_logo.png'

import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
      "& .MuiTableCell-root": {
        border: "2px solid #CCC"
      }
    },
    dealBgLogo: {
        backgroundImage: `url(${img})`,
        backgroundPosition: 'center', 
        backgroundSize: 'cover', 
        backgroundRepeat: 'no-repeat',
    }
  });

const PerfilDelInversor = props => {
    const classes = useStyles();
    const { perfilDeRiesgo } = props

    debugger
    return (
        <>
                <Row>
                    <Col className="text-center mt-5 mb-4">
                        <Typography paragraph="true"><b>PERFIL DE RIESGO DEL INVERSOR</b></Typography>
                        <Typography>(CONFORME RES. GRAL. CNV N° 612 Y NORMAS N.T. 2013)</Typography>
                    </Col>
                </Row>

                <Row>
                    <Col className={classes.dealBgLogo}>
                        <p>A fin de clarificar las diferentes alternativas de inversión y los riesgos que conllevan las mismas, enumeramoslos instrumentos plausibles de ser operados a través de DEAL S.A., con un criterio de menor a mayor riesgo para el inversor</p>

                        <p>1. Compra y/o Venta de Títulos Públicos Nacionales, Provinciales y Municipales (incluye letras y Bonos)</p>
                        <p>2. Compra y/o Venta de Letras del Banco Central de la República Argentina.</p>
                        <p>3. Compra y/o Venta de Fideicomisos Financieros.</p>
                        <p>4. Compra y/o Venta de Obligaciones Negociables.</p>
                        <p>5. Colocaciones en Fondos Comunes de Inversión de Renta Fija</p>
                        <p>6. Caución Colocadora</p>
                        <p>7. Compra y/o venta de Cheques de pago diferido</p>
                        <p>8. Préstamo Colocador</p>
                        <Divider className="mb-3 mt-3" />
                        <p>9. Compra y/o venta de Acciones ordinarias y preferidas</p>
                        <p>10. Colocaciones en Fondos Comunes de Inversión de Renta Variable</p>
                        <p>11. Compra y/o Venta de Acciones negociadas según mandato en mercados del exterior</p>
                        <p>12. Préstamo Tomador</p>
                        <Divider className="mb-3 mt-3" />
                        <p>13. Compra y/o venta de Futuros A) de Títulos Públicos B) de monedas C) de Títulos Privados D) de metales o productos agropecuarios</p>
                        <p>14. Compra y/o venta de Opciones de títulos privados y públicos</p>
                        <p>15. Caución Tomadora y compra de activos de cualquier naturaleza con apalancamiento sobre garantía de dicho activo y/u otros</p>
                        <p>16. Préstamo Tomador con Venta en Corto</p>

                        <p><b>NOTA Apalancamiento</b>: relación entre el capital invertido en su cuenta comitente y el crédito contraído con DEAL S.A. por compra de activos o retiros de dinero posteriores financiados con Caución Tomadora y no por venta de Activos. El incremento de apalancamiento aumenta los riesgos, ya que provoca mayor exposición a la insolvencia o incapacidad de atender deudas contraídas.</p>
                        <p>RB - RIESGO BAJO, aquel que opera losinstrumentos comprendidos entren el n°1 y el nro°8</p>
                        <p>RM - RIESGO MEDIO, aquel que opera los instrumentos comprendidos entre el nro°1 y el nro°12</p>
                        <p>RA - RIESGO ALTO, aquel que opera los instrumentos comprendidos entre el nro°1 y el nro°16</p>

                        <p>
                            <b>NOTA:</b> Ninguno de los perfiles asegura rendimientos de ningún tipo y cuantía ya que lasinversiones están sujetas a las fluctuaciones de las condiciones y precios de mercado. Asimismo en ningún caso,se garantiza la protección del valor aportado a la cuenta comitente.
                        </p>
                    </Col>
                </Row>

                <Row className="hoja6">
                    <CajaFirma />
                </Row>

                <Row>
                    <Col className={classes.dealBgLogo} >
                        <Row className="pageBreak">
                            <Col className="text-center mt-5 mb-4">
                                <Typography paragraph="true"><b>AUTOEVALUACIÓN DEL INVERSOR</b></Typography>
                            </Col>
                        </Row>

                        <Row>
                            <Col>a) Años de Experiencia:</Col>
                        </Row>


                        <Row className="mt-3 text-center">
                            <Col>
                                <p>En Bonos: <b>{ perfilDeRiesgo.experienciaBonos }</b></p>
                            </Col>
                            <Col>
                                <p>En Acciones: <b>{ perfilDeRiesgo.experienciaAcciones }</b></p>
                            </Col>
                            <Col>
                                <p>En Opciones: <b>{ perfilDeRiesgo.experienciaOpciones }</b></p>
                            </Col>
                            <Col>
                                <p>En Futuros: <b>{ perfilDeRiesgo.experienciaFuturos }</b></p>
                            </Col>
                        </Row>



                        <Row className="mt-4">
                            <Col>b) Grado de conocimiento sobre Inversiones (indicar con una cruz el casillero que considere correcto):</Col>
                        </Row>

                        <Row className="mt-3 text-center">
                            <Col>
                                    <Table className={classes.table} size="small" aria-label="a dense table">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Bonos</TableCell>
                                                <TableCell> { perfilDeRiesgo.conocimientoBonos} </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Acciones</TableCell>
                                                <TableCell> { perfilDeRiesgo.conocimientoAcciones} </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Opciones</TableCell>
                                                <TableCell> { perfilDeRiesgo.conocimientoOpciones} </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Futuros</TableCell>
                                                <TableCell> { perfilDeRiesgo.conocimientoFuturos} </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    {/* <Table className={classes.table} size="small" aria-label="a dense table">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell style={{"width":"30%"}}></TableCell>
                                                <TableCell style={{"width":"30%"}}>Limitado</TableCell>
                                                <TableCell style={{"width":"30%"}}>Bueno</TableCell>
                                                <TableCell style={{"width":"30%"}}>Amplio</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Bonos</TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Acciones</TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Opciones</TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Futuros</TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table> */}
                            </Col>
                        </Row>
                        

                        <Row className="mt-4">
                            <Col>c) Objetivo de Inversión:</Col>
                        </Row>

                        <Row className="mt-3 text-center">
                            <Col>
                                    <Table className={classes.table} size="small" aria-label="a dense table">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Priorizo conservar el valor de mis activos a lo largo del tiempo (Riesgo Bajo a Medio)</TableCell>
                                                <TableCell><b>{perfilDeRiesgo.objetivoInversion === "OBJETIVO_RIESGO_BAJO_MEDIO" ? "X" : ""}</b></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Priorizo obtener una renta, que supere el valor de mis activos en el tiempo (Riesgo Alto)</TableCell>
                                                <TableCell><b>{perfilDeRiesgo.objetivoInversion !== "OBJETIVO_RIESGO_BAJO_MEDIO" ? "X" : ""}</b></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                            </Col>
                        </Row>

                        <Row className="mt-4">
                            <Col>d) Porcentaje de Ahorros destinado a Inversiones: <b>{perfilDeRiesgo.porcentajeAhorro.replaceAll("_", " ").toLowerCase()}</b></Col>
                        </Row>

                        {/* <Row className="mt-3 text-center">
                            <Col>
                                    <Table className={classes.table} size="small" aria-label="a dense table">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Menor o igual a 25%</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Entre 25% y 50%</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Entre 50% y 90%</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Superior o igual al 90%</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                            </Col>
                        </Row> */}

                        <Row className="mt-4">
                            <Col>e) Horizonte de Inversión Promedio: <b>{perfilDeRiesgo.horizonteInversion.replaceAll("_", " ").toLowerCase()}</b></Col>
                        </Row>

                        {/* <Row className="mt-3 text-center">
                            <Col>
                                    <Table className={classes.table} size="small" aria-label="a dense table">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>DE CORTO PLAZO (hasta un año)</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>DE MEDIANO PLAZO (entre un año y dos)</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>DE LARGO PLAZO (superior a dos años)</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                            </Col>
                        </Row> */}

                        



                        <Row className="mt-4">
                            <Col>f) Según cuestionario de Perfil de Riesgo del Inversor suscripto y teniendo en cuenta lo detallado considero que mi tolerancia al riesgo podría encuadrarse como:</Col>
                        </Row>

                        <Row className="mt-3 text-center">
                            <Col>
                                    <Table className={classes.table} size="small" aria-label="a dense table">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>RB - RIESGO BAJO</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>RM - RIESGO MEDIO</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>RA - RIESGO ALTO</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                            </Col>
                        </Row>


                        <Row className="hoja6">
                            <CajaFirma />
                        </Row>
                    </Col>
                </Row>

        </>
    )
}

PerfilDelInversor.propTypes = {

}

export default PerfilDelInversor
