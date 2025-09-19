import React, {useState, useEffect} from 'react'
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'
import { Container, Col, Row } from 'react-bootstrap'
import { TextField, MenuItem } from '@material-ui/core';
import { TablaBancos } from '../Apertura'
import { makeStyles } from '@material-ui/core/styles';
import { aperturaService } from '../../services'
import { Field, Form, FormSpy } from 'react-final-form';
import {TransitionAlerts} from './../Elementos'

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '100%',
      },
    },
  }));

const tipoCuentaList = [
    {
        value: 'CAJA_AHORRO',
        label: 'CA',
    },
    {
        value: 'CUENTA_CORRIENTE',
        label: 'CC',
    },
    {
        value: 'CTA_UNICA',
        label: 'Cta. única',
    },
    
];

const monedasList = [
    {
        value: 'PESO',
        label: '$ - Pesos Argentino',
    },
    {
        value: 'DOLAR',
        label: 'U$D - Dolar Americano',
    },
];

  
//https://bluuweb.github.io/react/formularios/
//Datos bancarios: cargar cuentas (cbu, cuenta, moneda)
const Paso3 = props => {
    
    const classes = useStyles();
    const [rows, setRows] = useState([])
    const [showMessage, setShowMessage] = useState(false)

    const [datosBanco, setDatosBanco] = useState({
        alias: '-',
        cbu: '',
        cuenta: '-',
        moneda: '',
        tipo: ''
    })
    
    const handleInputChange = (event) => {
        setDatosBanco({
            ...datosBanco,
            [event.target.name] : event.target.value
        })
    }

    const agregarBanco = (event) => {
        event.preventDefault()
        setShowMessage(false)
        setRows(oldArray => [...oldArray, datosBanco]);
    }

    const { handleNext } = props
        

    useEffect(() => {
        setRows([])
        
        aperturaService.obtenerPaso(3)
        .then(
            response => {
                if (response.paso.length > 0) {
                    setRows(response.paso);      
                }
                
            },
            error => {
                console.log(error)
            }
        );

    }, [])

    const onSubmit = async (event) => {
        if(rows.length > 0){
            await aperturaService.guardarPaso3(rows)
            handleNext()
        }
        else{
            setShowMessage(true)
        }
    }


    return (
        <>
        <Container className={classes.root}>
            <Typography variant="h5" className="mt-4 mb-4">Ingrese la/las cuentas bancarias.</Typography>  
                
                <form className="row" onSubmit={agregarBanco}>
                    <Col xs={12} sm={4}>
                        
                        <TextField
                            id="tipocuenta"
                            name="tipo"
                            select
                            label="Tipo de cuenta"
                            onChange={handleInputChange}
                            variant="outlined"
                            >
                            {tipoCuentaList.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Col>
                    <Col xs={12} sm={4}>
                        <TextField
                            id="moneda"
                            name="moneda"
                            select
                            label="Moneda"
                            onChange={handleInputChange}
                            variant="outlined"
                            >
                            {monedasList.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Col>
                    <Col xs={12} sm={4}>
                        <TextField id="cbu" onChange={handleInputChange} name="cbu" label="CBU/CVU" variant="outlined"/>
                    </Col>
                    <Col xs={12} sm={6} className="d-none">
                        <TextField id="alias" onChange={handleInputChange} name="alias" label="Alias" variant="outlined" defaultValue="-"/>
                    </Col>
                    <Col xs={12} sm={6} className="d-none">
                        <TextField id="nrocuenta" onChange={handleInputChange} name="cuenta" label="Nro. de cuenta" variant="outlined" defaultValue="-"/>
                    </Col>
                    <Col xs={12} className="text-right pt-3">
                        <button type="submit" className="btn btn-primary">+ Agregar Cuenta Bancaria</button>
                    </Col>
                </form>
                <Form
                    onSubmit={onSubmit}
                    render={({ handleSubmit, form, submitting, pristine, values }) => (
                    <form id="form-apertura" onSubmit={handleSubmit}> 
                    </form>
                )}/>

            {
                
                rows.length > 0 ? <TablaBancos rows={rows} />
                :
                ""
            }

            <Col xs={12} className="mt-3">
                <TransitionAlerts showMessage={showMessage} text="Debe cargar al menos una cuenta bancaria" severity="error"/>
            </Col>
            
            </Container>
            
        </>
    )
}

Paso3.propTypes = {

}

export default Paso3
