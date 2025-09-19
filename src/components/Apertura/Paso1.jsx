import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import { Container, Col, Row } from 'react-bootstrap'
import { makeStyles } from '@material-ui/core/styles';
import { Field, Form, FormSpy } from 'react-final-form';
import { Grid, MenuItem, Typography, Divider } from '@material-ui/core';
import { aperturaService } from '../../services'
import { DatosContacto, DatosPersonales, DatosFiscales } from './../Elementos'
import { validarForm } from './../../services'

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        width: '100%',
      },
    },
  }));

//Datos personales titular
const Paso1 = props => {
    const classes = useStyles();    

    const { handleNext, stepContent } = props
    const [initialValues, setInitialValues] = useState()

    const onSubmit = async values => {
        await aperturaService.guardarPaso1(values)
        handleNext()
    }

    
    
    useEffect(()=>{
        setInitialValues(   
                            stepContent.datosPersonales 
                            ? { ...stepContent.datosContacto, ...stepContent.datosPersonales }
                            : { esPep: "false", esFATCA: "false", declaraUIF: "false", lugarNacimiento: "Argentina", nacionalidad: "Argentina", pais: "Argentina", fechaNacimiento: "2000-01-01", altura: "-", piso: "-", departamento: "-"}
                        )
        
        console.log(initialValues)
    }, [stepContent])

    return (
        
        <>
            <Container className={classes.root} >
                    <Form
                        onSubmit={onSubmit}
                        initialValues={initialValues}
                        validate={validarForm}
                        render={({ handleSubmit }) => (
                        <form id="form-apertura" onSubmit={handleSubmit}>      
                            <Row>
                                <Col><Typography variant="h5">Datos Personales:</Typography></Col>
                            </Row>
                            <DatosPersonales/>

                            <Divider className="mb-3 mt-3" />
                            <Row>
                                <Col><Typography variant="h5">Datos de contacto:</Typography></Col>
                            </Row>
                            <DatosContacto/>

                            <Divider className="mb-3 mt-3" />
                            <Row className="mb-3">
                                <Col><Typography variant="h5">Datos fiscales:</Typography></Col>
                            </Row>
                            <DatosFiscales />
                            
                    </form>
                    )}/>
            </Container>
        </>
    )
}

Paso1.propTypes = {
    handleNext: PropTypes.func.isRequired,
}

export default Paso1
