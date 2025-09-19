import React from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box, Button } from '@material-ui/core'
import img from '../../../images/pdf_back_logo.png'
import CajaFirma from './CajaFirma';
import TablaNombreCuit from './TablaNombreCuit';

const DeclaracionJurada = props => {

    const { persona } = props
    const { datosPersonales, datosContacto, tipo } = persona

    return (
        <>
                <Row className="pb-5">
                    <Col xs={12}>
                        <TablaNombreCuit datosPersonales={datosPersonales}/>
                    </Col>
                
                    <Col className="text-center mt-4" xs={12}>
                        <Typography><b>DECLARACIÓN JURADA SOBRE LA CONDICIÓN DE PERSONA EXPUESTA POLÍTICAMENTE</b></Typography>
                    </Col>

                    <Col className="mt-3" xs={12}>
                        <p>
                            Declaro bajo juramento que los datos consignados en la presente son correctos, completos y fiel expresión de la verdad y que [ ]SI [ ]NO me encuentro incluido y/o alcanzado dentro de la “Nómina de Funciones de Personas Expuestas Políticamente” aprobada porla Unidad de Información Financiera, que he leído. En caso afirmativo indicar detalladamente el motivo: <b>MOTIVO</b>
                        </p>
                        <p>
                            Además, asumo el compromiso de informar cualquier modificación que se produzca a este respecto, dentro de los treinta (30) días de ocurrida, mediante la presentación de una nueva declaración jurada. Declaración de PEP: www.dealfs.com.ar/PEP.
                        </p>
                    </Col>

                    <Col className="text-center mt-4 mb-4" xs={12}>
                        <Typography><b>FATCA: DECLARACIÓN JURADA SOBRE LA CONDICIÓN DE U.S. PERSON</b></Typography>
                    </Col>
                
                    <Col className="mb-4" xs={12}>
                        <p>
                            Declaro bajo juramento que los datos consignados en la presente son correctos, completos y fiel expresión de la verdad y que [ ]SI [ ]NO me encuentro incluido y/o alcanzado dentro del concepto "US Person". En caso afirmativo indicar el motivo:<b>MOTIVO</b>
                        </p>
                        <p>
                            Además, asumo el compromiso de informar cualquier modificación que se produzca a este respecto, dentro de los treinta (30) días de ocurrida, mediante la presentación de una nueva declaración jurada
                        </p>
                    </Col>
                

                    <Col xs={12}>
                        <Box border={1} p={3}>El Cliente que sea considerado US PERSON, bajo los parámetros indicados anteriormente, y a los efectos de dar acabado cumplimiento con la “Foreign Account Tax Compliance Act” (FATCA) de los Estados Unidos de América, acepta dispensar a DEAL S.A. de la obligación de mantener el secreto establecido en el artículo 53 de la Ley de Mercado de Capitales N° 26.831. El Cliente US PERSON, en consecuencia presta expresa conformidad y autoriza a DEAL S.A. a remitir al correspondiente organismo gubernamental de contralor de los Estados Unidos de América, la “Internal Revenue Service” (IRS), la información del Cliente, que fuera requerida a fin de cumplir con la normativa estadounidense referida. A estos efectos, una persona será considerada US Person, cuando reúna alguna de las siguientes características: Persona nacida en los Estados Unidos; con nacionalidad estadounidense (incluyendo casos de doble nacionalidad); con domicilio en Estados Unidos y/o P.O. Box en Estados Unidos; poseedor de una “Green Card” o Tarjeta de residencia permanente en Estados Unidos; con residencia fiscal en Estados Unidos; que mantenga alguna oficina, sucursal, planta, establecimiento y/o alguna otra sede comercial dentro de los Estados Unidos; ó con residencia o un domicilio legal o de inscripción dentro de los Estados Unidos. En el caso de reunir alguna/s de las característica/s antes mencionadas se deberá presentar: un Formulario W9 del IRS; un Formulario W8 del IRS; u otro tipo de prueba documentaria que demuestre que dicho titular de cuenta no es una persona estadounidense. U.S. PERSON. DISPENSA DE LA OBLIGACIÓN DE SECRETO. El Cliente que sea considerado US PERSON, bajo los parámetros indicados anteriormente, y a los efectos de dar acabado cumplimiento con la “Foreign Account Tax Compliance Act” (FATCA) de los Estados Unidos de América, acepta dispensar a DEAL S.A. de la obligación de mantener el secreto establecido en el artículo 53 de la Ley de Mercado de Capitales N° 26.831. El Cliente US PERSON, en consecuencia presta expresa conformidad y autoriza a DEAL S.A. a remitir al correspondiente organismo gubernamental de contralor de los Estados Unidos de América, la “Internal Revenue Service” (IRS), la información del Cliente, que fuera requerida a fin de cumplir con la normativa estadounidense referida.</Box>
                    </Col>
                
                    <Col className="text-center mt-5 mb-4" xs={12}>
                        <Typography><b>DDJJ SUJETO OBLIGADO: CONFORME LEY 25.246 Y MODIFICATORIAS</b></Typography>
                    </Col>
                
                    <Col className="mb-2" xs={12}>
                        <p>Por medio de la presente, y en cumplimiento de lo establecido por la Resolución 229/2011 de la Unidad de Información Financiera referida a Encubrimiento y Lavado de Efectivos de Origen Delictivo, él/la que suscribe declara bajo juramento que los datos consignados en la presente son correctos, completos y fiel expresión a la verdad; y que [ ]SI [ ]NO se encuentra alcanzado como Sujeto Obligado conforme el artículo 20 de la ley 25.246 y modificatorias (este artículo ha sido modificado por el artículo 15 de la Ley 26.683).</p>
                    </Col>
                
                
                    <Col xs={12}>
                        <Box border={1} p={3}>En caso de estar alcanzado como Sujeto Obligado y en cumplimiento con lo establecido en el artículo 18 (inciso H) de la Resolución 229/2011 de la Unidad de Información Financiera, el abajo firmante declara bajo juramento que da debida observancia a las disposiciones vigentes en materia de prevención del Lavado de Activo y Financiación del Terrorismo, por lo cual: Tiene conocimiento del alcance y propósitos establecidos en la Ley 25.246 y modificatorias, y de las resoluciones emitidas por la Unidad de Información Financiera (UIF), y cumple con la mencionada normativa; tiene conocimiento de la responsabilidad, como sujeto obligado, a informar a la UIF la existencia de operaciones sospechosas; se encuentra inscripto como Sujeto Obligado ante la UIF acompañando copia de dicha inscripción. </Box>
                    </Col>
                

                    <CajaFirma />
                
                </Row>
        </>
    )
}

DeclaracionJurada.propTypes = {

}

export default DeclaracionJurada
