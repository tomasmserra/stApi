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

const DatosFiscalesPage = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    tipo: 'CUIL',
    claveFiscal: '',
    tipoIva: 'RESPONSABLE_MONOTRIBUTO',
    tipoGanancia: 'RESPONSABLE_MONOTRIBUTO'
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
      
      console.log('Cargando datos fiscales existentes...');
      console.log('currentSolicitudId:', currentSolicitudId);
      
      if (currentSolicitudId) {
        const response = await authenticationService.getDatosFiscalesIndividuo(currentSolicitudId);
        console.log('Respuesta del backend datos fiscales:', response);
        
        if (response && (response.status === 200 || response.ok)) {
          if (response.tipo || response.claveFiscal || response.tipoIva || response.tipoGanancia) {
            console.log('Cargando datos fiscales en el formulario:', response);
            setFormData({
              ...formData,
              ...response
            });
          } else {
            console.log('No hay datos fiscales existentes para cargar');
          }
        } else {
          console.log('Error en la respuesta del backend datos fiscales:', response);
        }
      } else {
        console.log('No se encontro currentSolicitudId para cargar datos fiscales');
      }
    } catch (err) {
      console.error('Error cargando datos fiscales:', err);
      setError('Error al cargar los datos fiscales existentes');
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
      formData.tipoIva,
      formData.tipoGanancia
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
        tipoIva: formData.tipoIva,
        tipoGanancia: formData.tipoGanancia
      };

      console.log('Datos fiscales a guardar:', datosParaGuardar);
      
      const response = await authenticationService.saveDatosFiscalesIndividuo(datosParaGuardar);
      
          if (response && (response.status === 200 || response.ok)) {
            console.log('Datos fiscales guardados exitosamente:', response);
            history.push('/apertura/individuo/datos-fiscales-exterior');
          } else {
        console.error('Error al guardar datos fiscales:', response);
        setError('Error al guardar los datos fiscales. Intente nuevamente.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al guardar datos fiscales:', error);
      setError('Error de conexion al guardar los datos fiscales. Intente nuevamente.');
      setLoading(false);
    }
  };

  const handleVolver = () => {
    history.push('/apertura/individuo/domicilio');
  };

  // Enums según el backend
  const tipoOptions = [
    { value: 'CUIL', label: 'CUIL', nacional: true },
    { value: 'CUIT', label: 'CUIT', nacional: true },
    { value: 'CDI', label: 'CDI', nacional: true },
    { value: 'NIF', label: 'NIF', nacional: false },
    { value: 'NIE', label: 'NIE', nacional: false },
    { value: 'CIF', label: 'CIF', nacional: false },
    { value: 'RUT', label: 'RUT', nacional: false },
    { value: 'RUN', label: 'RUN', nacional: false },
    { value: 'NIT', label: 'NIT', nacional: false },
    { value: 'SAT', label: 'SAT', nacional: false },
    { value: 'RFC', label: 'RFC', nacional: false },
    { value: 'NSS', label: 'NSS', nacional: false },
    { value: 'SSN', label: 'SSN', nacional: false },
    { value: 'TIN', label: 'TIN', nacional: false },
    { value: 'TaxID', label: 'TaxID', nacional: false },
    { value: 'CPF', label: 'CPF', nacional: false },
    { value: 'DUI', label: 'DUI', nacional: false },
    { value: 'RTU', label: 'RTU', nacional: false },
    { value: 'Otro', label: 'Otro', nacional: false }
  ];

  const tipoIvaOptions = [
    { value: 'RESPONSABLE_INSCRIPTO', label: 'Responsable inscripto' },
    { value: 'RESPONSABLE_MONOTRIBUTO', label: 'Responsable monotributo' },
    { value: 'CONSUMIDOR_FINAL', label: 'Consumidor final' },
    { value: 'EXENTO', label: 'Exento' },
    { value: 'NO_CATEGORIZADO', label: 'No categorizado' },
    { value: 'NO_ALCANZADO', label: 'No alcanzado' }
  ];

  const tipoGananciaOptions = [
    { value: 'INSCRIPTO', label: 'Inscripto' },
    { value: 'NO_INSCRIPTO', label: 'No inscripto' },
    { value: 'EXENTO', label: 'Exento' },
    { value: 'RESPONSABLE_MONOTRIBUTO', label: 'Responsable monotributo' }
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
          Datos Fiscales
        </Typography>

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
                    <InputLabel>Tipo IVA</InputLabel>
                    <Select
                      value={formData.tipoIva}
                      onChange={(e) => handleInputChange('tipoIva', e.target.value)}
                      label="Tipo IVA"
                    >
                      {tipoIvaOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Tipo Ganancia</InputLabel>
                    <Select
                      value={formData.tipoGanancia}
                      onChange={(e) => handleInputChange('tipoGanancia', e.target.value)}
                      label="Tipo Ganancia"
                    >
                      {tipoGananciaOptions.map((option) => (
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
      </Box>
    </Container>
  );
};

export default DatosFiscalesPage;
