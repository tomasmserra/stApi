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

const RegisterBox = props => {

  let history = useHistory();
  const [spinnerVisibility, setSpinnerVisibility] = useState(HIDE);
  const [message, setMessage] = useState("")

  const onSubmit = async values => {
    setSpinnerVisibility(SHOW)
    setMessage("")
    
    // Enviar código de verificación por email
    authenticationService.sendVerificationCode(values.correoElectronico)
        .then(
            response => {
                console.log('Respuesta del backend:', response);
                // Si la respuesta es exitosa (200), redirigir independientemente del formato
                if (response && (response.exitosa === true || response.status === 200 || response.ok === true)) {
                  // Redirigir a la pantalla de validación de código
                  history.push('/validar-codigo/' + values.correoElectronico)
                }
                else {
                  console.log('Error en la respuesta:', response);
                  if (response && response.codigoError === 2) {
                    setMessage("Error al enviar el código. Intente nuevamente.")
                  } else {
                    setMessage("Error al enviar el código. Intente nuevamente.")
                  }
                  setSpinnerVisibility(HIDE)
                }
            },
            error => {
                console.error('Error en la petición:', error);
                setSpinnerVisibility(HIDE)
                setMessage("Error de conexión. Intente nuevamente.")
            }
        );
  }

  return (
      <Col xs={12} md={{ span: 6, offset: 3 }}>
        <div className="apertura-container">
          <div className="apertura-header">
            <Typography variant="h5" style={{ color: 'white', fontWeight: 'bold' }}>
              Apertura de cuenta
            </Typography>
          </div>
          <div className="apertura-content">
            <Typography variant="h4" paragraph={true} style={{ fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>
              ¡Comencemos!
            </Typography>
            <Typography variant="body1" style={{ color: '#333', marginBottom: '7px' }}>
              Ingresá tu correo para iniciar o continuar la apertura de la cuenta
            </Typography>
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
                              <Row>
                                <Col className="pt-3 pb-3">
                                  <FormButton
                                    style={{ backgroundColor: 'var(--main-green)', color: '#fff' }}
                                    type="submit"
                                  >
                                    Iniciar 
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
          </Container>
          </div>
        </div>
      </Col>
)    
}

RegisterBox.propTypes = {}

export default RegisterBox