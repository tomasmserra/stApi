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
import { Link } from "react-router-dom"
import { MobileButtons } from "../elements"
  
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
                  <a
                    href={"/"}
                    rel="noreferrer"
                  >
                    <Button className="btn-deal ml-2">Abrir Cuenta</Button>
                  </a>
                  <a
                    href={"https://anima.stsecurities.com.ar"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button className="btn-deal btn-deal-blue ml-2">Operar</Button>
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

