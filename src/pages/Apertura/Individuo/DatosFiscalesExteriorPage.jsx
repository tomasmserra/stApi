import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Box,
  Alert
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { authenticationService } from '../../../services';

const DatosFiscalesExteriorPage = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debeCompletar, setDebeCompletar] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'NIF',
    claveFiscal: '',
    residenciaFiscal: 'ARGENTINA'
  });

  useEffect(() => {
    const checkSession = () => {
      const currentUser = authenticationService.currentUserValue;
      if (!currentUser || !authenticationService.checkSessionValidity()) {
        history.push('/tipo-apertura');
        return;
      }
    };

    checkSession();

    const solicitudId = localStorage.getItem('currentSolicitudId');
    if (!solicitudId) {
      history.push('/tipo-apertura');
      return;
    }

    cargarDatosExistentes();
  }, [history]);

  const cargarDatosExistentes = async () => {
    try {
      setLoading(true);
      const currentSolicitudId = localStorage.getItem('currentSolicitudId');
      
      console.log('Cargando datos fiscales exterior existentes...');
      console.log('currentSolicitudId:', currentSolicitudId);
      
      if (currentSolicitudId) {
        const response = await authenticationService.getDatosFiscalesExteriorIndividuo(currentSolicitudId);
        console.log('Respuesta del backend datos fiscales exterior:', response);
        
        if (response && (response.status === 200 || response.ok)) {
          console.log('Datos fiscales exterior:', response);
          
          // Verificar si debe completar el formulario
          setDebeCompletar(response.debeCompletarFiscalExterior);
          
          if (response.debeCompletarFiscalExterior && (response.tipo || response.claveFiscal || response.residenciaFiscal)) {
            console.log('Cargando datos fiscales exterior en el formulario:', response);
            setFormData({
              ...formData,
              tipo: response.tipo || 'NIF',
              claveFiscal: response.claveFiscal || '',
              residenciaFiscal: response.residenciaFiscal || 'ARGENTINA'
            });
          } else if (!response.debeCompletarFiscalExterior) {
            // Si no debe completar, ir directamente a la siguiente pantalla
            console.log('No debe completar fiscal exterior, redirigiendo a cuentas bancarias');
            history.push('/apertura/individuo/cuentas-bancarias');
          }
        } else {
          console.log('Error en la respuesta del backend datos fiscales exterior:', response);
        }
      } else {
        console.log('No se encontro currentSolicitudId para cargar datos fiscales exterior');
      }
    } catch (err) {
      console.error('Error cargando datos fiscales exterior:', err);
      setError('Error al cargar los datos fiscales en el exterior existentes');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    const camposRequeridos = [
      formData.tipo,
      formData.claveFiscal,
      formData.residenciaFiscal
    ];
    
    return camposRequeridos.every(campo => campo && campo.trim() !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isFormValid()) {
      setError('Por favor complete todos los campos requeridos.');
      setLoading(false);
      return;
    }

    try {
      const currentUser = authenticationService.currentUserValue;
      const solicitudId = localStorage.getItem('currentSolicitudId');
      
      if (!currentUser || !currentUser.id || !solicitudId) {
        setError('Error: Usuario o solicitud no encontrados');
        setLoading(false);
        return;
      }

      const datosParaGuardar = {
        solicitudId: parseInt(solicitudId),
        idUsuario: currentUser.id,
        tipo: formData.tipo,
        claveFiscal: formData.claveFiscal,
        residenciaFiscal: formData.residenciaFiscal
      };

      console.log('Datos fiscales exterior a guardar:', datosParaGuardar);
      
      const response = await authenticationService.saveDatosFiscalesExteriorIndividuo(datosParaGuardar);
      
      if (response && (response.status === 200 || response.ok)) {
        console.log('Datos fiscales exterior guardados exitosamente:', response);
        history.push('/apertura/individuo/cuentas-bancarias');
      } else {
        console.error('Error al guardar datos fiscales exterior:', response);
        setError('Error al guardar los datos fiscales en el exterior. Intente nuevamente.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al guardar datos fiscales exterior:', error);
      setError('Error de conexion al guardar los datos fiscales en el exterior. Intente nuevamente.');
      setLoading(false);
    }
  };

  const handleVolver = () => {
    history.push('/apertura/individuo/datos-fiscales');
  };

  const handleSaltar = () => {
    history.push('/apertura/individuo/cuentas-bancarias');
  };

  // Enums según el backend
  const tipoOptions = [
    { value: 'NIF', label: 'NIF' },
    { value: 'NIE', label: 'NIE' },
    { value: 'CIF', label: 'CIF' },
    { value: 'RUT', label: 'RUT' },
    { value: 'RUN', label: 'RUN' },
    { value: 'NIT', label: 'NIT' },
    { value: 'SAT', label: 'SAT' },
    { value: 'RFC', label: 'RFC' },
    { value: 'NSS', label: 'NSS' },
    { value: 'SSN', label: 'SSN' },
    { value: 'TIN', label: 'TIN' },
    { value: 'TaxID', label: 'TaxID' },
    { value: 'CPF', label: 'CPF' },
    { value: 'DUI', label: 'DUI' },
    { value: 'RTU', label: 'RTU' },
    { value: 'Otro', label: 'Otro' }
  ];

  const paisesOptions = [
    { value: 'ARGENTINA', label: 'Argentina' },
    { value: 'BRASIL', label: 'Brasil' },
    { value: 'CHILE', label: 'Chile' },
    { value: 'URUGUAY', label: 'Uruguay' },
    { value: 'PARAGUAY', label: 'Paraguay' },
    { value: 'BOLIVIA', label: 'Bolivia' },
    { value: 'PERU', label: 'Perú' },
    { value: 'COLOMBIA', label: 'Colombia' },
    { value: 'VENEZUELA', label: 'Venezuela' },
    { value: 'ECUADOR', label: 'Ecuador' },
    { value: 'MEXICO', label: 'México' },
    { value: 'ESPAÑA', label: 'España' },
    { value: 'ITALIA', label: 'Italia' },
    { value: 'FRANCIA', label: 'Francia' },
    { value: 'ALEMANIA', label: 'Alemania' },
    { value: 'ESTADOS_UNIDOS', label: 'Estados Unidos' },
    { value: 'CANADA', label: 'Canadá' },
    { value: 'REINO_UNIDO', label: 'Reino Unido' },
    { value: 'OTRO', label: 'Otro' }
  ];

  if (loading && !formData.claveFiscal) {
    return (
      <Container maxWidth="md" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom style={{ color: 'var(--light-blue)', fontWeight: 'bold', marginBottom: '1rem' }}>
          Datos Fiscales en el Exterior
        </Typography>
        {!debeCompletar ? (
          <Card style={{ width: '100%', maxWidth: '600px' }}>
            <CardContent style={{ padding: '2rem', textAlign: 'center' }}>
              <Typography variant="h6" style={{ marginBottom: '1rem', color: 'var(--main-green)' }}>
                ¡Perfecto!
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '2rem' }}>
                No es necesario completar datos fiscales en el exterior para su solicitud.
              </Typography>
              
              <Box display="flex" justifyContent="center" className="navigation-buttons">
                <Button
                  variant="outlined"
                  onClick={handleVolver}
                  className="navigation-button"
                  style={{
                    borderColor: 'var(--main-green)',
                    color: 'var(--main-green)'
                  }}
                >
                  Volver
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaltar}
                  className="navigation-button"
                  style={{
                    backgroundColor: 'var(--main-green)',
                    color: '#fff'
                  }}
                >
                  Continuar
                </Button>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Card style={{ width: '100%', maxWidth: '600px' }}>
            <CardContent style={{ padding: '2rem' }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Tipo de Clave Fiscal</InputLabel>
                      <Select
                        value={formData.tipo}
                        onChange={(e) => handleInputChange('tipo', e.target.value)}
                        label="Tipo de Clave Fiscal"
                      >
                        {tipoOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Clave Fiscal"
                      value={formData.claveFiscal}
                      onChange={(e) => handleInputChange('claveFiscal', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Residencia Fiscal</InputLabel>
                      <Select
                        value={formData.residenciaFiscal}
                        onChange={(e) => handleInputChange('residenciaFiscal', e.target.value)}
                        label="Residencia Fiscal"
                      >
                        {paisesOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                
                <Box display="flex" justifyContent="center" className="navigation-buttons" style={{ marginTop: '2rem' }}>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleVolver}
                    disabled={loading}
                    className="navigation-button"
                    style={{
                      borderColor: 'var(--main-green)',
                      color: 'var(--main-green)'
                    }}
                  >
                    Volver
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !isFormValid()}
                    className="navigation-button"
                    style={{
                      backgroundColor: isFormValid() ? 'var(--main-green)' : '#ccc',
                      color: '#fff'
                    }}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Continuar'}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default DatosFiscalesExteriorPage;
