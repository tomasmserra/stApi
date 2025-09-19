import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Divider, Typography, CircularProgress , Box } from '@material-ui/core';
import { Field, Form, FormSpy } from 'react-final-form';
import RFTextField from './../../modules/form/RFTextField';
import FormButton from './../../modules/form/FormButton';
import { Container, Col, Row } from 'react-bootstrap'
import { authenticationService } from './../../services';
import { Link } from 'react-router-dom'
import { useHistory } from "react-router-dom";
import './style.css'

const HIDE = "d-none"
const SHOW = ""

function isValidPassword(myString) {
  
  return /\d/.test(myString) && /[a-zA-Z]/.test(myString) && myString.length > 7;
}

const RegisterBox = props => {

  let history = useHistory();
  const [spinnerVisibility, setSpinnerVisibility] = useState(HIDE);
  const [message, setMessage] = useState("")

  const onSubmit = async values => {
    setSpinnerVisibility(SHOW)
    setMessage("")
    
    if (isValidPassword(values.clave)){
      if (values.clave == values.password2 ){
        
        authenticationService.register(values.correoElectronico, values.clave)
            .then(
                response => {
                    debugger
                    if (response.exitosa){
                      history.push('/gracias-por-registrarte/' + values.correoElectronico)
                    }
                    else {
                      if (response.codigoError === 2) {
                        setMessage("Usted ya tiene cuenta, por favor inicie sesión.")
                      }
                      setSpinnerVisibility(HIDE)
                    }
                },
                error => {
                    setSpinnerVisibility(HIDE)
                }
            );
      }
      else{
        setSpinnerVisibility(HIDE)
        setMessage("Las contraseñas deben ser iguales")
      }
    }
    else {
      setSpinnerVisibility(HIDE)
      setMessage("La contraseña debe tener al menos 8 dígitos y un número")
    }


  }

  return (
      <Col xs={12} md={{ span: 6, offset: 3 }}>
        <Box boxShadow={2} pb={3}>
          <Box p={2} pr={4} pl={4} bgcolor="#EFEFEF" className="text-center">
            <Typography variant="h4" paragraph={true}>Registro</Typography>
            <Typography mt={2}>A continuación le vamos a solicitar sus datos para poder abrir cuenta como persona <b>física o jurídica</b>.</Typography>
          </Box>
          <Container spacing={2}>
                <Col className="text-center">
                  <Form
                  onSubmit={onSubmit}
                  render={({ handleSubmit, form, submitting, pristine, values }) => (
                  <form onSubmit={handleSubmit}>
                              <Field
                                autoComplete="email"
                                component={RFTextField}
                                fullWidth
                                label="Email"
                                margin="normal"
                                name="correoElectronico"
                                required
                                variant="outlined"
                                />
                      
                              <Field
                                fullWidth
                                component={RFTextField}
                                required
                                name="clave"
                                label="Contraseña"
                                type="password"
                                margin="normal"
                                variant="outlined"
                                minLength="8"
                              />
                              <Field
                              fullWidth
                              component={RFTextField}
                              required
                              name="password2"
                              label="Repetir contraseña"
                              type="password"
                              margin="normal"
                              variant="outlined"
                              />
                              <Row>
                                <Col className="pt-3 pb-3">
                                  <FormButton
                                    className="btn-deal-success"
                                    type="submit"
                                  >
                                    Registrarme 
                                  </FormButton>
                                </Col>
                              </Row>                       
                              <Row className={spinnerVisibility}>
                                <Col>
                                  <CircularProgress color="secondary" />
                                </Col>
                              </Row>
                            
                      {/* https://final-form.org/docs/react-final-form/examples/simple */}
                  </form>
                  )}
                  />
                  <Typography variant="h6">{message}</Typography>
                </Col>
                <Col xs={12} className="pt-4">
                  <Divider />
                  <Box mt={2} className="text-center">
                      <Typography variant="h6">
                        ¿Ya tenes cuenta? 
                        <Link to="/login" color="primary"> Iniciar sesión</Link>
                      </Typography>
                  </Box>
                </Col>
          </Container>
        </Box>
      </Col>
)    
}

RegisterBox.propTypes = {}

export default RegisterBox