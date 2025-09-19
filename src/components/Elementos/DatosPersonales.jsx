import React from 'react'
import PropTypes from 'prop-types'
import RFTextField from './../../modules/form/RFTextField';
import { Field, Form, FormSpy } from 'react-final-form';
import { Grid, MenuItem, Typography } from '@material-ui/core';
import { estadoCivilList, paisList } from './../../constants/Apertura/Paso2'
import { tipoDocumentoList, sexoList, identificadorFiscalList } from './../../constants/Apertura/Paso1'
import { Container, Col, Row } from 'react-bootstrap'

function DatosPersonales (props) {
    return (
        <>
                        <Row>
                            <Col xs={12} md={6}>
                                <Field name="nombre" component={RFTextField} id="nombre" label="Nombre" variant="outlined" value=""  />
                            </Col>
                            <Col xs={12} md={6}>
                                <Field name="apellido" component={RFTextField} id="apellido" label="Apellido" variant="outlined" value="" />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={4}>
                                <Field
                                    id="tipoDocumento"
                                    name="tipoDocumento"
                                    component={RFTextField}
                                    select
                                    label="Tipo de documento"
                                    variant="outlined"
                                    >
                                    {tipoDocumentoList.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Field>
                            </Col>
                            <Col xs={12} md={4}>
                                    <Field id="nroDocumento" 
                                        name="documento"
                                        component={RFTextField}
                                        label="Nro. de documento" 
                                        variant="outlined" 
                                        type="number" 
                                        min="6"
                                        />
                            </Col>
                            <Col xs={12} md={4}>
                                <Field
                                    id="nacionalidad"
                                    name="nacionalidad"
                                    component={RFTextField}
                                    select
                                    label="Nacionalidad"
                                    variant="outlined"
                                    >
                                    {paisList.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Field>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={4}>
                                <Field
                                    id="sexo"
                                    name="sexo"
                                    select
                                    component={RFTextField}
                                    label="Sexo"
                                    variant="outlined"
                                    >
                                    {sexoList.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Field>
                            </Col>
                            <Col xs={12} md={4}>
                                <Field
                                    id="identificadorFiscal"
                                    component={RFTextField}
                                    name="tipoCodigoIdentificacion"
                                    select
                                    label="Identificador Fiscal"
                                    variant="outlined"
                                    >
                                    {identificadorFiscalList.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Field>
                            </Col>
                            <Col xs={12} md={4}>
                                <Field 
                                    id="nroCuit" 
                                    component={RFTextField}
                                    name="codigoIdentificacion"
                                    label="Nro de CUIT/CUIL/CDI" 
                                    variant="outlined" 
                                    />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={4}>
                                <Field
                                    variant="outlined"
                                    component={RFTextField}
                                    id="fechaNacimiento"
                                    name="fechaNacimiento"
                                    label="Fecha de nacimiento"
                                    type="date"
                                    data-date-format="DD/MM/YYYY"
                                    defaultValue="2000-01-01"
                                    />
                                            
                            </Col>
                            <Col xs={12} md={4}>
                                <Field
                                    id="lugarNacimiento"
                                    name="lugarNacimiento"
                                    select
                                    component={RFTextField}
                                    label="Lugar de Nacimiento"
                                    variant="outlined"
                                    >
                                    {paisList.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Field>
                            </Col>
                            <Col xs={12} md={4}>
                                <Field 
                                    id="ocupacion" 
                                    component={RFTextField}
                                    name="ocupacion" 
                                    label="Ocupación" 
                                    variant="outlined" 
                                    />
                            </Col>
                            <Col xs={12} md={4}>
                                <Field 
                                    id="lugarResidencia" 
                                    component={RFTextField}
                                    name="lugarResidencia" 
                                    label="Lugar Residencia" 
                                    variant="outlined" 
                                    />
                            </Col>
                            <Col xs={12} md={4}>
                                <Field
                                    id="estadocivil"
                                    select
                                    label="Estado Civil"
                                    variant="outlined"
                                    component={RFTextField}
                                    name="estadoCivil"
                                    >
                                    {estadoCivilList.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Field>
                            </Col>
                        </Row> 
                
                        
        </>
    )
}

DatosPersonales.propTypes = {

}

export default DatosPersonales

