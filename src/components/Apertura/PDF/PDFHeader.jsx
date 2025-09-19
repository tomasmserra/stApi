import React from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import { Typography, Divider, Box, Button } from '@material-ui/core'

import logo from '../../../images/logo.png'


const PDFHeader = () => {
    
    return (
        <>
            <Col><img src={logo} alt="Logo" width={150}/></Col>
                    <Col className="text-right">
                        <p className="fs-9">
                            Carlos Pellegrini 989 - Piso 10<br/>
                            C.A.Buenos Aires (1009ABS)<br/>
                            Tel: +54 11 5275 6390<br/>
                            administracion@dealfs.com.ar<br/>
                            C.U.I.T: 30-70808696-3<br/>
                            I.V.A.: Responsable inscripto Tel:<br/>
                            ING. BRUTOS: 904-237429-1<br/>
                        </p>
                    </Col>
        </>
    )
}

PDFHeader.propTypes = {

}

export default PDFHeader
