import React from 'react'
import PropTypes from 'prop-types'
import RFTextField from '../../modules/form/RFTextField';
import { Field, Form, FormSpy } from 'react-final-form';
import { Grid, MenuItem, Divider, Typography } from '@material-ui/core';
import {  paisList } from '../../constants/Apertura/Paso2'
import { Col, Row } from 'react-bootstrap'

//No usar este componente, usar datos personaes
function DatosContacto (props) {

    return (
        <>
            
                <Row>
                    <Col xs={12} md={4}>
                        <Field 
                            id="email" 
                            component={RFTextField}
                            label="Email" 
                            variant="outlined" 
                            type="email" 
                            name="correoElectronico"/>
                    </Col>
                    <Col xs={12} md={4}>
                        <Field 
                            id="email2" 
                            component={RFTextField}
                            label="Email 2 (opcional)" 
                            variant="outlined" 
                            type="email" 
                            name="correoElectronico2"/>
                    </Col>
                    <Col xs={12} md={4}>
                        <Field 
                            id="email3" 
                            component={RFTextField}
                            label="Email 3 (opcional)" 
                            variant="outlined" 
                            type="email" 
                            name="correoElectronico3"/>
                    </Col>
                    
                </Row>
                
                <Row>
                    <Col xs={12} md={6}>
                        <Field 
                            id="direccion" 
                            label="Dirección" 
                            variant="outlined"
                            component={RFTextField}
                            name="direccion" 
                            />
                    </Col>
                    <Col xs={12} md={6}>
                        <Row>
                            <Col xs={6} md={4}>
                                <Field 
                                    id="numero" 
                                    label="Numero" 
                                    variant="outlined" 
                                    component={RFTextField}
                                    name="altura" 
                                    defaultValue="-"
                                    />
                            </Col>
                            <Col xs={6} md={4}>
                                <Field 
                                    id="piso" 
                                    label="Piso" 
                                    variant="outlined" 
                                    component={RFTextField}
                                    name="piso" 
                                    defaultValue="-"
                                    />
                            </Col>
                            <Col xs={12} md={4}>
                                <Field 
                                    id="departamento" 
                                    label="Departamento" 
                                    variant="outlined" 
                                    component={RFTextField}
                                    name="departamento" 
                                    defaultValue="-"
                                    />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12}>
                        <Row>
                            <Col>
                                <Field 
                                    id="celular" 
                                    label="Celular" 
                                    name="celular"
                                    variant="outlined" 
                                    type="number"
                                    component={RFTextField}
                                    />
                            </Col>
                            <Col>
                                <Field 
                                    id="telefono" 
                                    label="Teléfono" 
                                    variant="outlined" 
                                    type="number"
                                    component={RFTextField}
                                    name="telefono"
                                    />
                            </Col>
                        </Row>
                    </Col> 
                </Row>
                <Row>
                    <Col xs={12} md={4}>
                        <Field
                            id="pais"
                            select
                            label="País"
                            component={RFTextField}
                            name="pais" 
                            variant="outlined"
                            >
                            { paisList.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Field>
                    </Col>
                    <Col xs={6} md={4}>
                        <Field 
                            id="localidad" 
                            label="Localidad" 
                            variant="outlined"
                            component={RFTextField}
                            name="localidad" 
                            />
                    </Col>
                    <Col xs={6} md={4}>
                        <Field 
                            id="codigopostal" 
                            label="Código Postal" 
                            variant="outlined"
                            component={RFTextField}
                            name="codigoPostal" 
                            />
                    </Col>
                </Row>


        </>
    )
}

DatosContacto.propTypes = {

}

export default DatosContacto

