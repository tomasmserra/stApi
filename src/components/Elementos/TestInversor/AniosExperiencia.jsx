import React from 'react'
import PropTypes from 'prop-types'
import { Container, Col, Row } from 'react-bootstrap'
import { Field, Form, FormSpy } from 'react-final-form';
import RFTextField from './../../../modules/form/RFTextField';
import Typography from '@material-ui/core/Typography';

const AniosExperiencia = props => {
    return (
        <>
            <Row className="mt-3">
                <Col xs={12}>
                    <Typography><b>a) Años de experiencia</b></Typography>
                </Col>
            </Row>
            <Row className="mt-2">
                    <Col>
                        <Field 
                            id="experienciaBonos" 
                            label="En Bonos" 
                            name="experienciaBonos"
                            variant="outlined" 
                            type="number"
                            component={RFTextField}
                                />
                    </Col>
                    <Col>
                        <Field 
                            id="experienciaAcciones" 
                            label="En Acciones" 
                            name="experienciaAcciones"
                            variant="outlined" 
                            type="number"
                            component={RFTextField}
                                />
                    </Col>
                    <Col>
                        <Field 
                            id="experienciaOpciones" 
                            label="En Opciones" 
                            name="experienciaOpciones"
                            variant="outlined" 
                            type="number"
                            component={RFTextField}
                                />
                    </Col>
                    <Col>
                        <Field 
                            id="experienciaFuturos" 
                            label="En Futuros"
                            name="experienciaFuturos"
                            variant="outlined" 
                            type="number"
                            component={RFTextField}
                                />
                    </Col>
                        
            </Row>
        </>
    )
}

AniosExperiencia.propTypes = {

}

export default AniosExperiencia
