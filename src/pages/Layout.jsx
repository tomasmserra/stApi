import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import Bar from '../components/Bar'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Container, Col, Row } from 'react-bootstrap'
import GraciasPorRegistrartePage from './Registro/GraciasPorRegistrartePage'
import RegistroFinalizadoPage from './Registro/RegistroFinalizadoPage'
import Login from './Login/LoginPage'
import NotFound from './NotFoundPage'
import RegisterPage from './Registro/RegisterPage'
import Apertura from './Apertura/AperturaPage'
import PDFPage from './Apertura/PDFPage'
import TipoAperturaPage from './Apertura/TipoAperturaPage'
import { CssBaseline } from '@material-ui/core';

import { BrowserRouter as Router,
        Switch,
        Route } from 'react-router-dom'
import AperturaPersonaJuridicaPage from './Apertura/AperturaPersonaJuridicaPage';


const theme = createMuiTheme({
    typography: {
      fontFamily: [
        '"Montserrat"',
      ].join(','),
    },
  });

const Layout = props => {

    const [loggedIn, setLoggedIn] = useState(false)

    const evaluarSesion = () => {
        const isLoggedIn = localStorage.getItem("token") !== null
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
              <Bar loggedIn={loggedIn}></Bar>
              <Container className="pb-4">
                  <Switch>
                    <Route exact path="/" component={RegisterPage}></Route>
                    <Route exact path="/pdf" component={PDFPage}></Route>
                    <Route exact path="/gracias-por-registrarte/:email" name="gracias" component={GraciasPorRegistrartePage}></Route>
                    <Route exact path="/registro-finalizado/:email/:token" component={RegistroFinalizadoPage}></Route>

                    <Route exact path="/apertura/persona-juridica/:paso?">
                        <Col>
                          <AperturaPersonaJuridicaPage />
                        </Col>
                    </Route>
                    <Route exact path="/apertura/:idApertura?/:paso?">
                        <Col>
                          <Apertura></Apertura>
                        </Col>
                    </Route>

                    <Route exact path="/tipo-apertura">
                          <TipoAperturaPage />
                    </Route>
                    
                    <Route exact path="/login">
                        <Col>
                          <Login evaluarSesion={evaluarSesion}></Login>
                        </Col>
                    </Route>

                    <Route>
                      <Col>
                        <NotFound></NotFound>
                      </Col>
                    </Route>
                  </Switch>
            </Container> 
          </Router>


        </ThemeProvider>
        </>
    )
}

Layout.propTypes = {

}

export default Layout
