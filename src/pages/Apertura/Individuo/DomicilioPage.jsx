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
  IconButton,
  Chip,
  Snackbar
} from '@material-ui/core';
import { ArrowBack, CloudUpload, Delete } from '@material-ui/icons';
import { authenticationService } from '../../../services';

const DomicilioPage = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    calle: '',
    numero: '',
    piso: '',
    depto: '',
    barrio: '',
    ciudad: '',
    provincia: '',
    pais: 'ARGENTINA',
    cp: ''
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
      
      console.log('Cargando datos de domicilio existentes...');
      console.log('currentSolicitudId:', currentSolicitudId);
      
      if (currentSolicitudId) {
        const response = await authenticationService.getDomicilioIndividuo(currentSolicitudId);
        console.log('Respuesta del backend domicilio:', response);
        
        if (response && (response.status === 200 || response.ok)) {
          if (response.calle || response.numero || response.ciudad || response.provincia) {
            console.log('Cargando datos de domicilio en el formulario:', response);
            setFormData({
              ...formData,
              ...response
            });
          } else {
            console.log('No hay datos de domicilio existentes para cargar');
          }
        } else {
          console.log('Error en la respuesta del backend domicilio:', response);
        }
      } else {
        console.log('No se encontro currentSolicitudId para cargar datos de domicilio');
      }
    } catch (err) {
      console.error('Error cargando datos de domicilio:', err);
      setError('Error al cargar los datos de domicilio existentes');
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
      formData.calle,
      formData.numero,
      formData.barrio,
      formData.ciudad,
      formData.provincia,
      formData.pais,
      formData.cp
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
        tipo: 'LEGAL',
        calle: formData.calle,
        numero: formData.numero,
        piso: formData.piso,
        depto: formData.depto,
        barrio: formData.barrio,
        ciudad: formData.ciudad,
        provincia: formData.provincia,
        pais: formData.pais,
        cp: formData.cp
      };

      console.log('Datos de domicilio a guardar:', datosParaGuardar);
      
      const response = await authenticationService.saveDomicilioIndividuo(datosParaGuardar);
      
      if (response && (response.status === 200 || response.ok)) {
        console.log('Datos de domicilio guardados exitosamente:', response);
        history.push('/apertura/individuo/datos-fiscales');
      } else {
        console.error('Error al guardar datos de domicilio:', response);
        setError('Error al guardar los datos de domicilio. Intente nuevamente.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al guardar datos de domicilio:', error);
      setError('Error de conexion al guardar los datos de domicilio. Intente nuevamente.');
      setLoading(false);
    }
  };

  const handleVolver = () => {
    history.push('/apertura/individuo/datos-personales');
  };

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

  if (loading && !formData.calle) {
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
          Domicilio
        </Typography>


        <Card style={{ width: '100%', maxWidth: '600px' }}>
          <CardContent style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Calle"
                    value={formData.calle}
                    onChange={(e) => handleInputChange('calle', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Numero"
                    value={formData.numero}
                    onChange={(e) => handleInputChange('numero', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Piso"
                    value={formData.piso}
                    onChange={(e) => handleInputChange('piso', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Departamento"
                    value={formData.depto}
                    onChange={(e) => handleInputChange('depto', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Barrio"
                    value={formData.barrio}
                    onChange={(e) => handleInputChange('barrio', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Ciudad"
                    value={formData.ciudad}
                    onChange={(e) => handleInputChange('ciudad', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Provincia"
                    value={formData.provincia}
                    onChange={(e) => handleInputChange('provincia', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>País</InputLabel>
                    <Select
                      value={formData.pais}
                      onChange={(e) => handleInputChange('pais', e.target.value)}
                      label="País"
                    >
                      {paisesOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Codigo Postal"
                    value={formData.cp}
                    onChange={(e) => handleInputChange('cp', e.target.value)}
                    required
                  />
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

export default DomicilioPage;
