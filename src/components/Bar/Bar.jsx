import React from "react"
import PropTypes from "prop-types"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import { Container, Row, Col } from "react-bootstrap"
import CssBaseline from "@material-ui/core/CssBaseline"
import useScrollTrigger from "@material-ui/core/useScrollTrigger"
import { Button } from "@material-ui/core"
import logo from '../../images/logo.png'
import Slide from "@material-ui/core/Slide"
import { Link, useHistory } from "react-router-dom"
import { MobileButtons } from "../elements"
import { authenticationService } from "../../services"
  
function HideOnScroll(props) {
  const { children, window } = props
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined })

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
}

export default function HeaderBar(props) {
  const history = useHistory();

  const handleAbrirCuenta = () => {
    // Si hay una sesión activa, cerrarla
    const token = localStorage.getItem('token');
    if (token && authenticationService.checkSessionValidity()) {
      authenticationService.logout();
      // Actualizar el estado de loggedIn en el componente padre
      if (props.evaluarSesion) {
        props.evaluarSesion();
      }
    }
    // Ir al inicio
    history.push('/');
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar color="default" style={{marginBottom: 50}}>
          <Toolbar>
            <Container>
              <Row className="header d-none d-lg-flex">
                <Col xs={2} className="my-auto">
                  <Link to="/">
                    <img src={logo} alt="" className="p-1 w-100" />
                  </Link>
                </Col>
                <Col className="my-auto text-right" xs={10}>
                  <Button 
                    className="btn-deal ml-2" 
                    style={{ minHeight: '36px', padding: '6px 16px' }}
                    onClick={handleAbrirCuenta}
                  >
                    ABRIR CUENTA
                  </Button>
                  <a
                    href={"/"}
                    rel="noreferrer"
                  >
                    <Button variant="outlined" color="primary" className="ml-2 btn-deal-light" style={{ minHeight: '36px', padding: '6px 16px' }}>
                      Ingresar
                    </Button>
                  </a>
                  <a
                    href={"https://anima.stsecurities.com.ar"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button className="btn-deal btn-deal-blue ml-2" style={{ minHeight: '36px', padding: '6px 16px' }}>OPERAR</Button>
                  </a>
                </Col>
              </Row>
              <Row className="header d-lg-none">
                <Col className="my-auto">
                  <img
                    src={logo}
                    alt="logo"
                    className="p-1"
                    style={{ height: "70px" }}
                  />
                </Col>
                <Col className="my-auto text-right">
                  <MobileButtons />
                </Col>
              </Row>
            </Container>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      {/* <Toolbar /> */}
    </React.Fragment>
  )
}

