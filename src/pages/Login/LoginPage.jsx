import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import { Container, Col, Row } from 'react-bootstrap'
import { Divider, Typography, Box, CircularProgress } from '@material-ui/core';
import { Field, Form, FormSpy } from 'react-final-form';
import RFTextField from '../../modules/form/RFTextField';
import FormButton from '../../modules/form/FormButton';
import { authenticationService } from '../../services';
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom'


const Login = ({evaluarSesion}) => {
  let history = useHistory();
  const [spinnerVisibility, setSpinnerVisibility] = useState("d-none");
  const [loginMessage, setLoginMessage] = useState("");

  useEffect(() => {
    localStorage.removeItem("token");
    evaluarSesion()
  }, [])

  const onSubmit = async values => {
    setSpinnerVisibility("")
    setLoginMessage("")
    authenticationService.login(values.correoElectronico, values.clave)
        .then(
            response => {
                if (response.token){
                  localStorage.setItem("token", response.token);
                  history.push('/apertura')
                }
                else
                {
                  setSpinnerVisibility("d-none")
                  setLoginMessage("Los datos proporcionados no son correctos o no posee cuenta registrada")
                }
                evaluarSesion()
            },
            error => {
                debugger
                setSpinnerVisibility("d-none")
                setLoginMessage(error.message)
            }
        );
  }


    return (
        <>
        <Col xs={12} md={{ span: 6, offset: 3 }}>
        <Box boxShadow={2} pb={3}>
          <Box p={2} pr={4} pl={4} bgcolor="#EFEFEF" className="text-center">
            <Typography variant="h4">Iniciar Sesión</Typography>
          </Box>
          <Container spacing={2}>
              <Col className="text-center">
                <Form
                  onSubmit={onSubmit}
                  render={({ handleSubmit, form, submitting, pristine, values }) => (
                      <form onSubmit={handleSubmit}>
                          <Row className="mb-2">
                            <Col>
                                <Field
                                    autoComplete="email"
                                    component={RFTextField}
                                    fullWidth
                                    label="Email"
                                    margin="normal"
                                    name="correoElectronico"
                                    type="email"
                                    variant="outlined"
                                    required
                                    />
                                <Field
                                    fullWidth
                                    component={RFTextField}
                                    required
                                    name="clave"
                                    label="Contraseña"
                                    type="password"
                                    variant="outlined"
                                    margin="normal"
                                  />
                                <Col xs={12}>
                                  <FormButton
                                    className="btn-deal-success mt-3"
                                    type="submit"
                                  >
                                    Iniciar Sesión
                                  </FormButton>
                                </Col>
                              </Col>
                            </Row>                       
                            <Row className={spinnerVisibility}>
                              <Col>
                                <CircularProgress color="secondary" />
                              </Col>
                            </Row>
                            <Row>
                              <Col className="mt-3">
                                <Typography variant="body1">{loginMessage}</Typography>
                              </Col>
                            </Row>
                            </form>
                          )}/>
            </Col>
        
              <Col xs={12} className="pt-4">
                <Divider />
                <Box mt={2} className="text-center">
                    <Typography>
                      ¿Aún no tenes cuenta? 
                      <Link to="/" color="primary"> Registrate</Link>
                    </Typography>
                </Box>
                </Col>
          </Container>
        </Box>
      </Col>
        </>
    )
}

Login.propTypes = {

}

export default Login
