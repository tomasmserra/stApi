import React from 'react'
import PropTypes from 'prop-types'
import RFTextField from '../../modules/form/RFTextField';
import { Field, Form, FormSpy } from 'react-final-form';
import { motivoFATCAList, motivoPepList } from './../../constants/Apertura/Paso1'
import { Grid, MenuItem, Typography, Divider } from '@material-ui/core';

function DatosFiscales (props) {
    return (
        <>
                        
                    <Typography className="mb-2">DECLARACIÓN JURADA SOBRE LA CONDICIÓN DE PERSONA EXPUESTA POLÍTICAMENTE</Typography>
                    <Typography variant="h5" className="mb-2"><b>¿Sos una Persona Expuesta Políticamente (PEP)?</b></Typography>  
                    
                    <label>
                        <Field
                            name="esPep"
                            component="input"
                            type="radio"
                            value="false"
                        />{' '}
                        No
                    </label>

                    <label className="ml-3">
                        <Field
                            name="esPep"
                            component="input"
                            type="radio"
                            value="true"
                        />{' '}
                        Si
                    </label>
                    
                    {/* <Field 
                        id="motivoPep" 
                        label="Motivo" 
                        name="motivoPep"
                        className="mt-2"
                        variant="outlined" 
                        component={RFTextField}
                        /> */}

                    <Field
                        id="motivoPep"
                        name="motivoPep"
                        className="mt-2"
                        component={RFTextField}
                        select
                        label="Motivo Pep"
                        variant="outlined"
                        >
                        {motivoPepList.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Field>

                    <Divider className="mb-3 mt-4"/>

                    <Typography className="mb-2">FATCA: DECLARACIÓN JURADA SOBRE LA CONDICIÓN DE U.S. PERSON</Typography>
                    <Typography variant="h5" className="mb-2"><b>¿Sos Residente tributario fuera de Argentina (FATCA)?</b></Typography>  
                    
                    <label>
                        <Field
                            name="esFATCA"
                            component="input"
                            type="radio"
                            value="false"
                        />{' '}
                        No
                    </label>

                    <label className="ml-3">
                        <Field
                            name="esFATCA"
                            component="input"
                            type="radio"
                            value="true"
                        />{' '}
                        Si
                    </label>


                    <Field
                        id="motivoFatca"
                        label="Motivo Fatca" 
                        name="motivoFatca"
                        className="mt-2"
                        component={RFTextField}
                        select
                        variant="outlined"
                        >
                        {motivoFATCAList.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Field>
                    <Divider className="mb-3 mt-4"/>

                    <Typography className="mb-2">DDJJ SUJETO OBLIGADO: CONFORME LEY 25.246 Y MODIFICATORIAS</Typography>
                    <Typography variant="h5" className="mb-2"><b>¿Sos un sujeto obligado a informar ante la UIF?</b></Typography>  
                    <label>
                        <Field
                            name="declaraUIF"
                            component="input"
                            type="radio"
                            value="false"
                        />{' '}
                        No
                    </label>

                    <label className="ml-3">
                        <Field
                            name="declaraUIF"
                            component="input"
                            type="radio"
                            value="true"
                        />{' '}
                        Si
                    </label>
                
                        
        </>
    )
}

DatosFiscales.propTypes = {

}

export default DatosFiscales

