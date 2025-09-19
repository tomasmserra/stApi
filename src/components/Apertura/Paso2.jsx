import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import { Container, Col, Row } from 'react-bootstrap'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Divider, Box, Button } from '@material-ui/core'
import { aperturaService } from '../../services'
import { Field, Form, FormSpy } from 'react-final-form';
import { DatosPersonales, DatosContacto, DatosFiscales } from './../Elementos'
import { TablaCotitulares } from './'
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

//Datos personales cotitulares
const Paso2 = props => {
    const classes = useStyles();    

    const { handleNext, stepContent } = props
    
    const [ cotitulares, setCotitulares] = useState([])
    const [ formVisible, setFormVisible] = useState(false)

    const verFormularioCotitulares = () => { setFormVisible(true)}
    
    const noAgregarCotitulares = () => { 
        handleNext(false)
    }

    const agregarCotitular = async e => {
      debugger
      setCotitulares([...cotitulares, e]);
      console.log(cotitulares)
    }

    const onSubmit = (event) => {
        aperturaService.guardarPaso2(cotitulares)
        handleNext(false)
    }

    useEffect(() => {
      
      aperturaService.obtenerPaso(2)
        .then(
            response => {
              debugger
                if (response.paso.length > 0) {
                  setCotitulares(response.paso);   
                  verFormularioCotitulares()   
                }
                
            },
            error => {
                console.log(error)
            }
        );

      // if (cotitulares.length > 0 || stepContent.length > 0){
      //   setCotitulares(stepContent)
      //   verFormularioCotitulares()
      // }

    }, [])
    
    return (
        <>
        <Container className={formVisible ? "d-none" : ""}>
          <Col xs={12} md={{ span: 8, offset: 2 }}>
              <Box boxShadow={2} pb={3}>
              <Box p={2} pr={4} pl={4} mb={5} bgcolor="#EFEFEF" className="text-center">
                  <Typography mt={2}>Desea agregar cotitulares?</Typography>
              </Box>
              <Container spacing={2}>
                  <Row>
                      <Col xs={12} sm={6} className="text-center">
                          <Button className="btn-deal-success" onClick={verFormularioCotitulares}>Si</Button>
                      </Col>
                      <Col xs={12} sm={6} className="text-center">
                          <Button className="btn-deal-success" onClick={noAgregarCotitulares}>No</Button>
                      </Col>
                  </Row>
              </Container>
              </Box>
          </Col>
        </Container>

        <Container className={!formVisible ? "d-none" : ""}>
          <Row className={classes.root}>
            <Col>
            <Form
              onSubmit={agregarCotitular}
              validate={validarForm}
              initialValues={{  tipoDocumento: "dni", esPep: "false", esFATCA: "false", declaraUIF: "false", 
                                lugarNacimiento: "Argentina", nacionalidad: "Argentina", pais: "Argentina", 
                                fechaNacimiento: "2000-01-01", sexo:"masculino", tipoCodigoIdentificacion:"cuil",
                                estadoCivil:"SOLTERO" }}
              render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>  
                
                        <Row>
                            <Col><Typography variant="h5">Datos Personales:</Typography></Col>
                        </Row>
                        <DatosPersonales />

                        <Divider className="mb-3 mt-3" />
                        <Row>
                            <Col><Typography variant="h5">Datos de contacto:</Typography></Col>
                        </Row>
                        <DatosContacto />
                        
                        <Divider className="mb-3 mt-3" />
                            <Row className="mb-3">
                                <Col><Typography variant="h5">Datos fiscales:</Typography></Col>
                            </Row>
                        <DatosFiscales />

                        <Row>
                          <Col xs={12} className="text-right pt-3">
                              <button type="submit" className="btn btn-primary">+ Agregar Cotitular</button>
                          </Col>
                        </Row>
              </form>
              )}/>

            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit }) => (
                <form id="form-apertura" onSubmit={handleSubmit}> 
                </form>
            )}/>

              
            <TablaCotitulares rows={cotitulares} />
              
            </Col>
          </Row>
            
        </Container>
            
        </>
    )
}

Paso2.propTypes = {

}

export default Paso2
