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
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip
} from '@material-ui/core';
import { ArrowBack, Add, Edit, Delete, Check, Close } from '@material-ui/icons';
import { authenticationService } from '../../../services';

const CuentasBancariasPage = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cuentasBancarias, setCuentasBancarias] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [claveBancariaError, setClaveBancariaError] = useState('');
  const [formData, setFormData] = useState({
    tipo: 'CUENTA_CORRIENTE',
    banco: '',
    moneda: 'PESOS',
    tipoClaveBancaria: 'CBU',
    claveBancaria: ''
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

    cargarCuentasBancarias();
  }, [history]);

  const cargarCuentasBancarias = async () => {
    try {
      setLoading(true);
      const currentSolicitudId = localStorage.getItem('currentSolicitudId');
      
      console.log('Cargando cuentas bancarias...');
      console.log('currentSolicitudId:', currentSolicitudId);
      
      if (currentSolicitudId) {
        const response = await authenticationService.getCuentasBancariasIndividuo(currentSolicitudId);
        console.log('Respuesta del backend cuentas bancarias:', response);
        
        if (response && (response.status === 200 || response.ok)) {
          console.log('Cuentas bancarias cargadas:', response);
          setCuentasBancarias(response.cuentasBancarias || []);
        } else {
          console.log('Error en la respuesta del backend cuentas bancarias:', response);
        }
      } else {
        console.log('No se encontro currentSolicitudId para cargar cuentas bancarias');
      }
    } catch (err) {
      console.error('Error cargando cuentas bancarias:', err);
      setError('Error al cargar las cuentas bancarias existentes');
    } finally {
      setLoading(false);
    }
  };

  const validateClaveBancaria = (tipoClave, valor) => {
    if (!valor) return '';
    
    // Solo permitir números
    const soloNumeros = valor.replace(/[^0-9]/g, '');
    
    if (tipoClave === 'CBU') {
      if (soloNumeros.length !== 22) {
        return 'El CBU debe tener exactamente 22 dígitos';
      }
    } else if (tipoClave === 'CVU') {
      if (soloNumeros.length !== 22) {
        return 'El CVU debe tener exactamente 22 dígitos';
      }
    }
    
    return '';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validar clave bancaria en tiempo real
    if (field === 'claveBancaria') {
      const error = validateClaveBancaria(formData.tipoClaveBancaria, value);
      setClaveBancariaError(error);
    } else if (field === 'tipoClaveBancaria') {
      // Si cambia el tipo de clave, revalidar el valor actual
      const error = validateClaveBancaria(value, formData.claveBancaria);
      setClaveBancariaError(error);
    }
  };

  const isFormValid = () => {
    const camposRequeridos = [
      formData.tipo,
      formData.banco,
      formData.moneda,
      formData.tipoClaveBancaria,
      formData.claveBancaria
    ];
    
    const camposCompletos = camposRequeridos.every(campo => campo && campo.trim() !== '');
    const sinErrores = !claveBancariaError;
    
    return camposCompletos && sinErrores;
  };

  const handleOpenDialog = (index = -1) => {
    if (index >= 0) {
      // Editar cuenta existente - copiar todos los datos incluyendo ID
      const cuentaExistente = cuentasBancarias[index];
      setFormData({
        tipo: cuentaExistente.tipo,
        banco: cuentaExistente.banco,
        moneda: cuentaExistente.moneda,
        tipoClaveBancaria: cuentaExistente.tipoClaveBancaria,
        claveBancaria: cuentaExistente.claveBancaria
        // No copiar el ID al formData, se maneja por separado
      });
      setEditingIndex(index);
    } else {
      // Nueva cuenta
      setFormData({
        tipo: 'CUENTA_CORRIENTE',
        banco: '',
        moneda: 'PESOS',
        tipoClaveBancaria: 'CBU',
        claveBancaria: ''
      });
      setEditingIndex(-1);
    }
    setClaveBancariaError(''); // Limpiar errores al abrir
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingIndex(-1);
    setClaveBancariaError('');
    setFormData({
      tipo: 'CUENTA_CORRIENTE',
      banco: '',
      moneda: 'PESOS',
      tipoClaveBancaria: 'CBU',
      claveBancaria: ''
    });
  };

  const handleSaveCuenta = () => {
    if (!isFormValid()) {
      setError('Por favor complete todos los campos requeridos.');
      return;
    }

    const nuevasCuentas = [...cuentasBancarias];
    
    if (editingIndex >= 0) {
      // Editar cuenta existente - mantener el ID original
      const cuentaExistente = cuentasBancarias[editingIndex];
      nuevasCuentas[editingIndex] = {
        ...formData,
        id: cuentaExistente.id // Mantener el ID original del GET
      };
    } else {
      // Nueva cuenta - sin ID
      const nuevaCuenta = {
        ...formData
        // No agregar ID para cuentas nuevas
      };
      nuevasCuentas.push(nuevaCuenta);
    }

    setCuentasBancarias(nuevasCuentas);
    handleCloseDialog();
    setError(null);
  };

  const handleDeleteCuenta = (index) => {
    const nuevasCuentas = cuentasBancarias.filter((_, i) => i !== index);
    setCuentasBancarias(nuevasCuentas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
        cuentasBancarias: cuentasBancarias
      };

      console.log('Cuentas bancarias a guardar:', datosParaGuardar);
      
      const response = await authenticationService.saveCuentasBancariasIndividuo(datosParaGuardar);
      
          if (response && (response.status === 200 || response.ok)) {
            console.log('Cuentas bancarias guardadas exitosamente:', response);
            history.push('/apertura/individuo/cuentas-bancarias-exterior');
          } else {
        console.error('Error al guardar cuentas bancarias:', response);
        setError('Error al guardar las cuentas bancarias. Intente nuevamente.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al guardar cuentas bancarias:', error);
      setError('Error de conexion al guardar las cuentas bancarias. Intente nuevamente.');
      setLoading(false);
    }
  };

  const handleVolver = () => {
    history.push('/apertura/individuo/datos-fiscales-exterior');
  };

  const getTipoDisplay = (tipo) => {
    const tipos = {
      'CUENTA_CORRIENTE': 'Cuenta Corriente',
      'CAJA_AHORRO': 'Caja de Ahorro',
      'CUENTA_JUDICIAL': 'Cuenta Judicial',
      'OTRO': 'Otro'
    };
    return tipos[tipo] || tipo;
  };

  const getMonedaDisplay = (moneda) => {
    const monedas = {
      'PESOS': 'Pesos',
      'DOLARES': 'Dólares',
      'BIMONETARIA': 'Bimonetaria'
    };
    return monedas[moneda] || moneda;
  };

  const getClaveDisplay = (tipoClaveBancaria) => {
    const claves = {
      'CBU': 'CBU',
      'CVU': 'CVU'
    };
    return claves[tipoClaveBancaria] || tipoClaveBancaria;
  };

  // Enums según el backend
  const tipoOptions = [
    { value: 'CUENTA_CORRIENTE', label: 'Cuenta Corriente' },
    { value: 'CAJA_AHORRO', label: 'Caja de Ahorro' },
    { value: 'CUENTA_JUDICIAL', label: 'Cuenta Judicial' },
    { value: 'OTRO', label: 'Otro' }
  ];

  const monedaOptions = [
    { value: 'PESOS', label: 'Pesos' },
    { value: 'DOLARES', label: 'Dólares' },
    { value: 'BIMONETARIA', label: 'Bimonetaria' }
  ];

  const tipoClaveOptions = [
    { value: 'CBU', label: 'CBU' },
    { value: 'CVU', label: 'CVU' }
  ];

  if (loading && cuentasBancarias.length === 0) {
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
          Cuentas Bancarias
        </Typography>
        <Card style={{ width: '100%', maxWidth: '800px' }}>
          <CardContent style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
              <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '2rem' }}>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  Mis Cuentas Bancarias
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenDialog()}
                  size="small"
                  style={{
                    backgroundColor: 'var(--main-green)',
                    color: '#fff',
                    padding: '6px 12px',
                    fontSize: '12px'
                  }}
                >
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    Agregar Cuenta
                  </Box>
                  <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                    Agregar
                  </Box>
                </Button>
              </Box>

              {cuentasBancarias.length === 0 ? (
                <Box textAlign="center" style={{ padding: '2rem' }}>
                  <Typography variant="body1" color="textSecondary">
                    No hay cuentas bancarias agregadas. Haga clic en "Agregar Cuenta" para comenzar.
                  </Typography>
                </Box>
              ) : (
                <List>
                  {cuentasBancarias.map((cuenta, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle1" style={{ fontWeight: 'bold' , paddingRight: '10px'}}>
                              {getTipoDisplay(cuenta.tipo)} - {cuenta.banco}
                            </Typography>
                            <Chip 
                              label={getMonedaDisplay(cuenta.moneda)} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {getClaveDisplay(cuenta.tipoClaveBancaria)}: {cuenta.claveBancaria}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleOpenDialog(index)}
                          style={{ marginRight: '8px' }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteCuenta(index)}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}

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
                  disabled={loading || cuentasBancarias.length === 0}
                  className="navigation-button"
                  style={{
                    backgroundColor: (cuentasBancarias.length > 0) ? 'var(--main-green)' : '#ccc',
                    color: '#fff'
                  }}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : 'Continuar'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        {/* Dialog para agregar/editar cuenta */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingIndex >= 0 ? 'Editar Cuenta Bancaria' : 'Agregar Cuenta Bancaria'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} style={{ marginTop: '1rem' }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Tipo de Cuenta</InputLabel>
                  <Select
                    value={formData.tipo}
                    onChange={(e) => handleInputChange('tipo', e.target.value)}
                    label="Tipo de Cuenta"
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
                  label="Banco"
                  value={formData.banco}
                  onChange={(e) => handleInputChange('banco', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Moneda</InputLabel>
                  <Select
                    value={formData.moneda}
                    onChange={(e) => handleInputChange('moneda', e.target.value)}
                    label="Moneda"
                  >
                    {monedaOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Tipo de Clave</InputLabel>
                  <Select
                    value={formData.tipoClaveBancaria}
                    onChange={(e) => handleInputChange('tipoClaveBancaria', e.target.value)}
                    label="Tipo de Clave"
                  >
                    {tipoClaveOptions.map((option) => (
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
                  label={getClaveDisplay(formData.tipoClaveBancaria)}
                  value={formData.claveBancaria}
                  onChange={(e) => handleInputChange('claveBancaria', e.target.value.replace(/[^0-9]/g, ''))}
                  required
                  error={!!claveBancariaError}
                  helperText={claveBancariaError || `Ingrese su ${getClaveDisplay(formData.tipoClaveBancaria)} (22 dígitos)`}
                  placeholder={`Ingrese su ${getClaveDisplay(formData.tipoClaveBancaria)}`}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} startIcon={<Close />}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveCuenta}
              variant="contained"
              disabled={!isFormValid()}
              startIcon={<Check />}
              style={{
                backgroundColor: isFormValid() ? 'var(--main-green)' : '#ccc',
                color: '#fff'
              }}
            >
              {editingIndex >= 0 ? 'Actualizar' : 'Agregar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default CuentasBancariasPage;
