import React from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import { Typography, Divider, Box, Button } from '@material-ui/core'



const CajaFirma = () => {
    
    return (
        <>
            <Col className="text-center mt-7 mb-4">
                <Box borderTop={1}>
                    <Col className="mt-2"><b>Firma Comitente</b></Col>
                </Box>
            </Col>
            <Col className="text-center mt-7 mb-4">
                <Box borderTop={1}>
                    <Col className="mt-2"><b>Aclaración</b></Col>
                </Box>
            </Col>
        </>
    )
}

CajaFirma.propTypes = {

}

export default CajaFirma
