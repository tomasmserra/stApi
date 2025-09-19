import React, {useState} from 'react'
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'
import { Container, Col, Row } from 'react-bootstrap'
import { Field, Form, FormSpy } from 'react-final-form';
import RFTextField from '../../modules/form/RFTextField';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { aperturaService } from '../../services'
import { Accordion_deal } from '../Elementos'
import {    AhorrosDestinados, 
            AniosExperiencia, 
            ConocimientoInversiones, 
            HorizonteInversion, 
            ObjetivoInversion, 
            PerfilDeRiesgo } from '../Elementos/TestInversor'


const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '100%',
      },
    },
  }));


const Paso5 = props => {

    const classes = useStyles();
    const { handleNext, stepContent } = props

    const onSubmit = async values => {
        aperturaService.guardarPaso5(values)
        handleNext()
    }

    return (
        <>
            <Row className={classes.root}>
                <Col>
                    <Typography variant="h5" className="mb-2"><b>Documentos respaldatorios de fondos a invertir</b></Typography>  
                    <Typography className="mb-2">DDJJ SOBRE LICITUD Y ORIGEN DE FONDOS RES. 229/2011 U.I.F. 14/12/2011 -(LEY 25.246 y Modificatorias)</Typography>
                    <Typography className="mb-3">
                        A fin de clarificar las diferentes alternativas de inversión y los riesgos que conllevan las mismas, enumeramos los instrumentos plausibles de
                        ser operados a través de DEAL S.A., con un criterio de menor a mayor riesgo para el inversor.
                    </Typography>
                    
                    <Accordion_deal texto={"Mucho texto, meter en variable"} header={"Ver instrumentos de inversión"} />
                    </Col>
                    

            </Row>

            <Row>
                <Col className="mt-3">
                    <Divider className="mt-1 mb-4"/>
                    <Typography className="mb-3" variant="h4" ><b>Autoevaluación del inversor</b></Typography>
                </Col>
            </Row>

            

                <Form
                    onSubmit={onSubmit}
                    initialValues={stepContent}
                    render={({ handleSubmit }) => (
                    <form id="form-apertura" onSubmit={handleSubmit}>  
                        
                        <AniosExperiencia />
                        
                        <Divider className="mt-4 mb-2"/>

                        <ConocimientoInversiones />
                        
                        <Divider className="mt-4 mb-2"/>

                        <ObjetivoInversion />
                        
                        <Divider className="mt-4 mb-2"/>

                        <AhorrosDestinados />

                        <Divider className="mt-4 mb-2"/>

                        <HorizonteInversion />

                        <Divider className="mt-4 mb-2"/>

                        <PerfilDeRiesgo />

                        
                    </form>
                )}/>
        </>
    )
}

Paso5.propTypes = {

}

export default Paso5