import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import HeaderBar from '../components/Bar'
import { Footer } from '../components/Footer'
import ProtectedRoute from '../components/ProtectedRoute'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Container, Col, Row } from 'react-bootstrap'
import NotFound from './NotFoundPage'
import RegisterPage from './Registro/RegisterPage'
import TipoAperturaPage from './Apertura/TipoAperturaPage'
import ValidarCodigoPage from './ValidarCodigo/ValidarCodigoPage'
import DatosPrincipalesPage from './Apertura/Individuo/DatosPrincipalesPage'
import DatosPersonalesPage from './Apertura/Individuo/DatosPersonalesPage'
import DomicilioPage from './Apertura/Individuo/DomicilioPage'
import DatosFiscalesPage from './Apertura/Individuo/DatosFiscalesPage'
import { CssBaseline } from '@material-ui/core';

import { BrowserRouter as Router,
        Switch,
        Route } from 'react-router-dom'
import { authenticationService } from '../services';


const theme = createMuiTheme({
    typography: {
      fontFamily: [
        '"Inter"',
        '"Roboto"',
        '"Helvetica"',
        '"Arial"',
        'sans-serif',
      ].join(','),
    },
  });

const Layout = props => {

    const [loggedIn, setLoggedIn] = useState(false)

    const evaluarSesion = () => {
        const isLoggedIn = localStorage.getItem("token") !== null && 
                          authenticationService.checkSessionValidity()
        setLoggedIn(isLoggedIn)
    }

    useEffect(() => {
        evaluarSesion()
    }, [])

    return (
        <>
            <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <HeaderBar loggedIn={loggedIn} evaluarSesion={evaluarSesion}></HeaderBar>
              <Container className="pb-4">
                  <Switch>
                    <Route exact path="/" component={RegisterPage}></Route>
                    <Route exact path="/validar-codigo/:email" component={ValidarCodigoPage}></Route>
                    <ProtectedRoute exact path="/tipo-apertura" component={TipoAperturaPage} />
                        <ProtectedRoute exact path="/apertura/individuo/datos-principales" component={DatosPrincipalesPage} />
                        <ProtectedRoute exact path="/apertura/individuo/datos-personales" component={DatosPersonalesPage} />
                        <ProtectedRoute exact path="/apertura/individuo/domicilio" component={DomicilioPage} />
                        <ProtectedRoute exact path="/apertura/individuo/datos-fiscales" component={DatosFiscalesPage} />
                    
                    <Route>
                      <Col>
                        <NotFound></NotFound>
                      </Col>
                    </Route>
                  </Switch>
            </Container> 
            <Footer />
          </Router>


        </ThemeProvider>
        </>
    )
}

Layout.propTypes = {

}

export default Layout
