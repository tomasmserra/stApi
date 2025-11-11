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

const CuentasBancariasExteriorPage = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debeCompletar, setDebeCompletar] = useState(false);
  const [cuentasBancarias, setCuentasBancarias] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [formData, setFormData] = useState({
    tipoCliente: 'PERSONAL',
    pais: 'ARGENTINA',
    banco: '',
    tipo: 'CHECKING',
    claveBancaria: '',
    numeroAba: '',
    identificacionSwift: ''
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

    cargarCuentasBancariasExterior();
  }, [history]);

  const cargarCuentasBancariasExterior = async () => {
    try {
      setLoading(true);
      const currentSolicitudId = localStorage.getItem('currentSolicitudId');
      
      console.log('Cargando cuentas bancarias exterior...');
      console.log('currentSolicitudId:', currentSolicitudId);
      
      if (currentSolicitudId) {
        const response = await authenticationService.getCuentasBancariasExteriorIndividuo(currentSolicitudId);
        console.log('Respuesta del backend cuentas bancarias exterior:', response);
        
        if (response && (response.status === 200 || response.ok)) {
          console.log('Datos cuentas bancarias exterior:', response);
          
          // Verificar si debe completar el formulario
          setDebeCompletar(response.debeCompletarCuentasBancariasExterior);
          
          if (response.debeCompletarCuentasBancariasExterior) {
            setCuentasBancarias(response.cuentasBancarias || []);
          } else {
            // Si no debe completar, ir directamente a la siguiente pantalla
            console.log('No debe completar cuentas bancarias exterior, redirigiendo a declaraciones');
            history.push('/apertura/individuo/declaraciones');
          }
        } else {
          console.log('Error en la respuesta del backend cuentas bancarias exterior:', response);
        }
      } else {
        console.log('No se encontro currentSolicitudId para cargar cuentas bancarias exterior');
      }
    } catch (err) {
      console.error('Error cargando cuentas bancarias exterior:', err);
      setError('Error al cargar las cuentas bancarias en el exterior existentes');
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
      formData.tipoCliente,
      formData.pais,
      formData.banco,
      formData.tipo,
      formData.claveBancaria
    ];
    
    return camposRequeridos.every(campo => campo && campo.trim() !== '');
  };

  const handleOpenDialog = (index = -1) => {
    if (index >= 0) {
      // Editar cuenta existente
      const cuentaExistente = cuentasBancarias[index];
      setFormData({
        tipoCliente: cuentaExistente.tipoCliente || 'PERSONAL',
        pais: cuentaExistente.pais || 'ARGENTINA',
        banco: cuentaExistente.banco || '',
        tipo: cuentaExistente.tipo || 'CHECKING',
        claveBancaria: cuentaExistente.claveBancaria || '',
        numeroAba: cuentaExistente.numeroAba || '',
        identificacionSwift: cuentaExistente.identificacionSwift || ''
      });
      setEditingIndex(index);
    } else {
      // Nueva cuenta
      setFormData({
        tipoCliente: 'PERSONAL',
        pais: 'ARGENTINA',
        banco: '',
        tipo: 'CHECKING',
        claveBancaria: '',
        numeroAba: '',
        identificacionSwift: ''
      });
      setEditingIndex(-1);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingIndex(-1);
    setFormData({
      tipoCliente: 'PERSONAL',
      pais: 'ARGENTINA',
      banco: '',
      tipo: 'CHECKING',
      claveBancaria: '',
      numeroAba: '',
      identificacionSwift: ''
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
        cuentasBancarias: cuentasBancarias,
        debeCompletarCuentasBancariasExterior: debeCompletar
      };

      console.log('Cuentas bancarias exterior a guardar:', datosParaGuardar);
      
      const response = await authenticationService.saveCuentasBancariasExteriorIndividuo(datosParaGuardar);
      
      if (response && (response.status === 200 || response.ok)) {
        console.log('Cuentas bancarias exterior guardadas exitosamente:', response);
        history.push('/apertura/individuo/declaraciones');
      } else {
        console.error('Error al guardar cuentas bancarias exterior:', response);
        setError('Error al guardar las cuentas bancarias en el exterior. Intente nuevamente.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al guardar cuentas bancarias exterior:', error);
      setError('Error de conexion al guardar las cuentas bancarias en el exterior. Intente nuevamente.');
      setLoading(false);
    }
  };

  const handleVolver = () => {
    history.push('/apertura/individuo/cuentas-bancarias');
  };

  const handleSaltar = () => {
    history.push('/apertura/individuo/declaraciones');
  };

  const getTipoClienteDisplay = (tipoCliente) => {
    const tipos = {
      'PERSONAL': 'Personal',
      'BUSINESS': 'Business'
    };
    return tipos[tipoCliente] || tipoCliente;
  };

  const getTipoDisplay = (tipo) => {
    const tipos = {
      'CHECKING': 'Checking',
      'SAVINGS': 'Savings'
    };
    return tipos[tipo] || tipo;
  };

  // Enums según el backend
  const tipoClienteOptions = [
    { value: 'PERSONAL', label: 'Personal' },
    { value: 'BUSINESS', label: 'Business' }
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

  const tipoOptions = [
    { value: 'CHECKING', label: 'Checking' },
    { value: 'SAVINGS', label: 'Savings' }
  ];

  if (loading && !formData.banco) {
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
          Cuentas Bancarias en el Exterior
        </Typography>

        {!debeCompletar ? (
          <Card style={{ width: '100%', maxWidth: '600px' }}>
            <CardContent style={{ padding: '2rem', textAlign: 'center' }}>
              <Typography variant="h6" style={{ marginBottom: '1rem', color: 'var(--main-green)' }}>
                ¡Perfecto!
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '2rem' }}>
                No es necesario completar cuentas bancarias en el exterior para su solicitud.
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
          <Card style={{ width: '100%', maxWidth: '800px' }}>
            <CardContent style={{ padding: '2rem' }}>
              <form onSubmit={handleSubmit}>
                <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '2rem' }}>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    Mis Cuentas Bancarias en el Exterior
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
                      No hay cuentas bancarias en el exterior agregadas. Haga clic en "Agregar Cuenta" para comenzar.
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {cuentasBancarias.map((cuenta, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle1" style={{ fontWeight: 'bold', paddingRight: '10px' }}>
                                {getTipoDisplay(cuenta.tipo)} - {cuenta.banco}
                              </Typography>
                              <Chip 
                                label={cuenta.pais} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="textSecondary">
                                {getTipoClienteDisplay(cuenta.tipoCliente)} - Número: {cuenta.claveBancaria}
                              </Typography>
                              {cuenta.numeroAba && (
                                <Typography variant="body2" color="textSecondary">
                                  ABA: {cuenta.numeroAba}
                                </Typography>
                              )}
                              {cuenta.identificacionSwift && (
                                <Typography variant="body2" color="textSecondary">
                                  SWIFT: {cuenta.identificacionSwift}
                                </Typography>
                              )}
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
                    disabled={loading}
                    className="navigation-button"
                    style={{
                      backgroundColor: 'var(--main-green)',
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

        {/* Dialog para agregar/editar cuenta */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingIndex >= 0 ? 'Editar Cuenta Bancaria en el Exterior' : 'Agregar Cuenta Bancaria en el Exterior'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} style={{ marginTop: '1rem' }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Holder Type</InputLabel>
                  <Select
                    value={formData.tipoCliente}
                    onChange={(e) => handleInputChange('tipoCliente', e.target.value)}
                    label="Holder Type"
                  >
                    {tipoClienteOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Banco (Bank)"
                  value={formData.banco}
                  onChange={(e) => handleInputChange('banco', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    value={formData.tipo}
                    onChange={(e) => handleInputChange('tipo', e.target.value)}
                    label="Account Type"
                  >
                    {tipoOptions.map((option) => (
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
                  label="Número"
                  value={formData.claveBancaria}
                  onChange={(e) => handleInputChange('claveBancaria', e.target.value)}
                  required
                  placeholder="Ingrese el número de cuenta"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Número de banco ABA (Routing number)"
                  value={formData.numeroAba}
                  onChange={(e) => handleInputChange('numeroAba', e.target.value)}
                  placeholder="Opcional"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Identificación SWIFT"
                  value={formData.identificacionSwift}
                  onChange={(e) => handleInputChange('identificacionSwift', e.target.value)}
                  placeholder="Opcional"
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

export default CuentasBancariasExteriorPage;
