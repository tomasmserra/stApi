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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Alert,
  FormControlLabel,
  RadioGroup,
  Radio
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { authenticationService } from '../../../services';

const DeclaracionesPage = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    esPep: false,
    motivoPep: '',
    esFATCA: false,
    motivoFatca: '',
    declaraUIF: false,
    motivoUIF: ''
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

    cargarDeclaraciones();
  }, [history]);

  const cargarDeclaraciones = async () => {
    try {
      setLoading(true);
      const currentSolicitudId = localStorage.getItem('currentSolicitudId');
      
      console.log('Cargando declaraciones...');
      console.log('currentSolicitudId:', currentSolicitudId);
      
      if (currentSolicitudId) {
        const response = await authenticationService.getDeclaracionesIndividuo(currentSolicitudId);
        console.log('Respuesta del backend declaraciones:', response);
        
        if (response && (response.status === 200 || response.ok)) {
          console.log('Declaraciones cargadas:', response);
          setFormData({
            esPep: response.esPep || false,
            motivoPep: response.motivoPep || '',
            esFATCA: response.esFATCA || false,
            motivoFatca: response.motivoFatca || '',
            declaraUIF: response.declaraUIF || false,
            motivoUIF: response.motivoUIF || ''
          });
        } else {
          console.log('Error en la respuesta del backend declaraciones:', response);
        }
      } else {
        console.log('No se encontro currentSolicitudId para cargar declaraciones');
      }
    } catch (err) {
      console.error('Error cargando declaraciones:', err);
      setError('Error al cargar las declaraciones existentes');
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
    // Verificar que si se marcó "Sí" en alguna pregunta, se complete el motivo
    const pepValido = !formData.esPep || (formData.esPep && formData.motivoPep.trim() !== '');
    const fatcaValido = !formData.esFATCA || (formData.esFATCA && formData.motivoFatca.trim() !== '');
    const uifValido = !formData.declaraUIF || (formData.declaraUIF && formData.motivoUIF.trim() !== '');
    
    return pepValido && fatcaValido && uifValido;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isFormValid()) {
      setError('Por favor complete todos los campos requeridos cuando corresponda.');
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
        esPep: formData.esPep,
        motivoPep: formData.esPep ? formData.motivoPep : null,
        esFATCA: formData.esFATCA,
        motivoFatca: formData.esFATCA ? formData.motivoFatca : null,
        declaraUIF: formData.declaraUIF,
        motivoUIF: formData.declaraUIF ? formData.motivoUIF : null
      };

      console.log('Declaraciones a guardar:', datosParaGuardar);
      
      const response = await authenticationService.saveDeclaracionesIndividuo(datosParaGuardar);
      
      if (response && (response.status === 200 || response.ok)) {
        console.log('Declaraciones guardadas exitosamente:', response);
        history.push('/apertura/individuo/perfil-inversor');
      } else {
        console.error('Error al guardar declaraciones:', response);
        setError('Error al guardar las declaraciones. Intente nuevamente.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al guardar declaraciones:', error);
      setError('Error de conexion al guardar las declaraciones. Intente nuevamente.');
      setLoading(false);
    }
  };

  const handleVolver = () => {
    history.push('/apertura/individuo/cuentas-bancarias-exterior');
  };

  if (loading && !formData.esPep && !formData.esFATCA && !formData.declaraUIF) {
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
          Declaraciones
        </Typography>

        <Card style={{ width: '100%', maxWidth: '600px' }}>
          <CardContent style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                
                {/* Sección PEP */}
                <Grid item xs={12}>
                  <Card style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                    <CardContent style={{ padding: '0' }}>
                      <Typography variant="h6" style={{ marginBottom: '1rem', color: 'var(--light-blue)', fontWeight: 'bold' }}>
                        Persona Expuesta Políticamente (PEP)
                      </Typography>
                      
                      <Typography variant="body1" style={{ marginBottom: '1rem' }}>
                        ¿Sos Persona Expuesta Políticamente (PEP)?
                      </Typography>
                      
                      <FormControl component="fieldset">
                        <RadioGroup
                          value={formData.esPep}
                          onChange={(e) => handleInputChange('esPep', e.target.value === 'true')}
                          row
                        >
                          <FormControlLabel value={true} control={<Radio />} label="Sí" />
                          <FormControlLabel value={false} control={<Radio />} label="No" />
                        </RadioGroup>
                      </FormControl>
                      
                      {formData.esPep && (
                        <TextField
                          fullWidth
                          variant="outlined"
                          label="Motivo"
                          value={formData.motivoPep}
                          onChange={(e) => handleInputChange('motivoPep', e.target.value)}
                          required
                          multiline
                          rows={3}
                          style={{ marginTop: '1rem' }}
                          placeholder="Explique el motivo por el cual es considerado PEP"
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Sección FATCA */}
                <Grid item xs={12}>
                  <Card style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                    <CardContent style={{ padding: '0' }}>
                      <Typography variant="h6" style={{ marginBottom: '1rem', color: 'var(--light-blue)', fontWeight: 'bold' }}>
                        Residente Tributario (FATCA)
                      </Typography>
                      
                      <Typography variant="body1" style={{ marginBottom: '1rem' }}>
                        ¿Sos Residente tributario fuera de Argentina (FATCA)?
                      </Typography>
                      
                      <FormControl component="fieldset">
                        <RadioGroup
                          value={formData.esFATCA}
                          onChange={(e) => handleInputChange('esFATCA', e.target.value === 'true')}
                          row
                        >
                          <FormControlLabel value={true} control={<Radio />} label="Sí" />
                          <FormControlLabel value={false} control={<Radio />} label="No" />
                        </RadioGroup>
                      </FormControl>
                      
                      {formData.esFATCA && (
                        <TextField
                          fullWidth
                          variant="outlined"
                          label="Motivo"
                          value={formData.motivoFatca}
                          onChange={(e) => handleInputChange('motivoFatca', e.target.value)}
                          required
                          multiline
                          rows={3}
                          style={{ marginTop: '1rem' }}
                          placeholder="Explique el motivo por el cual es residente tributario fuera de Argentina"
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Sección UIF */}
                <Grid item xs={12}>
                  <Card style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                    <CardContent style={{ padding: '0' }}>
                      <Typography variant="h6" style={{ marginBottom: '1rem', color: 'var(--light-blue)', fontWeight: 'bold' }}>
                        Sujeto Obligado UIF
                      </Typography>
                      
                      <Typography variant="body1" style={{ marginBottom: '1rem' }}>
                        ¿Sos Sujeto Obligado a informar ante la UIF?
                      </Typography>
                      
                      <FormControl component="fieldset">
                        <RadioGroup
                          value={formData.declaraUIF}
                          onChange={(e) => handleInputChange('declaraUIF', e.target.value === 'true')}
                          row
                        >
                          <FormControlLabel value={true} control={<Radio />} label="Sí" />
                          <FormControlLabel value={false} control={<Radio />} label="No" />
                        </RadioGroup>
                      </FormControl>
                      
                      {formData.declaraUIF && (
                        <TextField
                          fullWidth
                          variant="outlined"
                          label="Motivo"
                          value={formData.motivoUIF}
                          onChange={(e) => handleInputChange('motivoUIF', e.target.value)}
                          required
                          multiline
                          rows={3}
                          style={{ marginTop: '1rem' }}
                          placeholder="Explique el motivo por el cual es sujeto obligado ante la UIF"
                        />
                      )}
                    </CardContent>
                  </Card>
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

export default DeclaracionesPage;
