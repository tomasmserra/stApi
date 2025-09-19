import React, {useState} from 'react'
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'
import { Container, Col, Row } from 'react-bootstrap'
import DateFnsUtils from '@date-io/date-fns';
import { TextField, Grid, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from '@material-ui/pickers';


const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '100%',
      },
    },
  }));

  const currencies = [
    {
        value: 'dni',
        label: 'DNI',
      },
      {
        value: 'pasaporte',
        label: 'Pasaporte',
      },
  ];

const Paso6 = props => {

    const classes = useStyles();
    const [tipoDocumento, setTipoDocumento] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date('2000-01-01T21:11:54'));

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const changeTipoDocumento = (event) => {
        setTipoDocumento(event.target.value);
      };

    const { handleNext } = props
    const handleSubmit = (event) => { 
        handleNext()
    }
    return (
        <>
        <Container>
            <form className={classes.root} id="form-apertura" onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <TextField id="nombre" label="Nombre" variant="outlined"/>
                    </Col>
                    <Col>
                    <TextField id="apellido" label="Apellido" variant="outlined"/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <TextField
                            id="tipoDocumento"
                            select
                            label="Tipo de documento"
                            value={tipoDocumento}
                            onChange={changeTipoDocumento}
                            variant="outlined"
                            >
                            {currencies.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Col>
                    <Col>
                        <TextField id="nroDocumento" label="Nro. de documento" variant="outlined"/>
                    </Col>
                    <Col>
                        <TextField
                            id="nacionalidad"
                            select
                            label="Nacionalidad"
                            value={tipoDocumento}
                            onChange={changeTipoDocumento}
                            variant="outlined"
                            >
                            {currencies.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <TextField
                            id="sexo"
                            select
                            label="Sexo"
                            value={tipoDocumento}
                            onChange={changeTipoDocumento}
                            variant="outlined"
                            >
                            {currencies.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Col>
                    <Col>
                        <TextField
                            id="identificadorFiscal"
                            select
                            label="Identificador Fiscal"
                            value={tipoDocumento}
                            onChange={changeTipoDocumento}
                            variant="outlined"
                            >
                            {currencies.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Col>
                    <Col>
                        <TextField id="nroCuit" label="Nro de CUIT/CUIL/CDI" variant="outlined"/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="outlined"
                                    inputVariant="outlined"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="fechaNacimiento"
                                    label="Fecha de nacimiento"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    />
                                    
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </Col>
                    <Col>
                        <TextField
                            id="lugarNacimiento"
                            select
                            label="Lugar de Nacimiento"
                            value={tipoDocumento}
                            onChange={changeTipoDocumento}
                            variant="outlined"
                            >
                            {currencies.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Col>
                    <Col>
                        <TextField id="lugarNacimiento" label="Lugar de nacimiento" variant="outlined"/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <TextField id="ocupacion" label="Ocupación" variant="outlined"/>
                    </Col>
                    <Col></Col>
                    <Col></Col>
                </Row>
            </form>
            </Container>
        </>
    )
}

Paso6.propTypes = {

}

export default Paso6