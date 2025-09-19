import React, {useState} from 'react'
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'
import { Container, Col, Row } from 'react-bootstrap'
import DateFnsUtils from '@date-io/date-fns';
import { Box, List, ListItem, ListItemText, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { aperturaService } from '../../services'
import { Field, Form, FormSpy } from 'react-final-form';
import AttachmentIcon from '@material-ui/icons/Attachment';

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '100%',
      },
    },
  }));


const Paso4 = props => {

    const classes = useStyles();
    const { handleNext, stepContent } = props
    const onSubmit = async values => {
        await aperturaService.guardarPaso4(values)
        handleNext()
    }
    
    return (
        <>
        <Row className={classes.root}>
            <Col xs={12}>
                <Typography variant="h5" className="mb-2"><b>Documentos respaldatorios de fondos a invertir</b></Typography>  
                <Typography className="mb-2">DDJJ SOBRE LICITUD Y ORIGEN DE FONDOS RES. 229/2011 U.I.F. 14/12/2011 -(LEY 25.246 y Modificatorias)</Typography>
                
                <Typography className="mb-2 mt-3">En cumplimiento de lo dispuesto por la Unidad de Información Financiera (UIF), por la presente DECLARO BAJO JURAMENTO que los fondos y/o valores depositados en la Cuenta Comitente de DEAL S.A. acreditados a través de: </Typography>  
            </Col>
            <Col>
            <Form
                    onSubmit={onSubmit}
                    initialValues={stepContent}
                    render={({ handleSubmit }) => (
                    <form id="form-apertura" onSubmit={handleSubmit}>
                        <Col xs={12} md={{ span: 4, offset: 4 }} className="mt-4 mb-4">
                            <div className="mt-3">
                                <Field
                                    name="origen"
                                    component="input"
                                    type="checkbox"
                                    value="TRANSFERENCIA_BANCARIA"
                                />{' '}
                                <b>Transferencia Bancaria a nombre del titular</b>
                            </div>
                            <div className="mt-3">
                                <Field
                                    name="origen"
                                    component="input"
                                    type="checkbox"
                                    value="TRANSFERENCIA_ESPECIES"
                                />{' '}
                                <b>Transferencia de Especies</b>
                            </div>
                            <div className="mt-3">
                                <Field
                                    name="origen"
                                    component="input"
                                    type="checkbox"
                                    value="CHEQUE_TITULAR"
                                />{' '}
                                <b>Entrega de Cheques a nombre del titular.</b>
                            </div>
                        </Col>
                        <Col xs={12}>
                            <Typography className="mb-2">Destinados a realizar operaciones provienen de actividades lícitas y se originan a raíz de:</Typography>  
                            <Box bgcolor="#E8E8E8" p={2} mt={3}>
                                <Typography variant="body1" className="mb-2"><b>¿Qué documentación puedo utilzar para respaldar el origen de mis fondos?</b></Typography>  
                                <List component="nav" aria-label="main mailbox folders">
                                    <ListItem>
                                        <ListItemText primary="- Último recibo de sueldo." />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="- Constancia de monotributo." />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="- Declaración de ingresos firmada por contador y certificado por consejo profesional correspondiente." />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="- Copia de otro documento justificativo." />
                                    </ListItem>
                                </List>
                            </Box>
                        </Col>
                        {/* <Col xs={12} className="mt-3">
                            <Button className="btn-deal-outlined-success"><AttachmentIcon className="mr-1"/> Adjuntar Documentación</Button>
                        </Col> */}
                    </form>
                )}/>
                </Col>
                <Col xs={12} className="mt-3">
                    <Col xs={12}>
                        <Typography>
                            En carácter de DECLARACIÓN JURADA manifiesto que esta información es exacta y verdadera, y que tengo conocimiento de la Ley 25.246 y sus modificatorias. Asumiendo el compromiso de acercar mayor documentación sobre la misma, si en el futuro es requerida por DEAL S.A. o cualquier entidad de control.
                        </Typography>
                    </Col>
                </Col>
            </Row>
        </>
    )
}

Paso4.propTypes = {

}

export default Paso4