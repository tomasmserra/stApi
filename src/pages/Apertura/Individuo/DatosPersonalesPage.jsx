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

const DatosPersonalesPage = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    tipoID: 'DNI',
    idNumero: '',
    fechaNacimiento: '',
    lugarNacimiento: '',
    nacionalidad: 'ARGENTINA',
    paisOrigen: 'ARGENTINA',
    paisResidencia: 'ARGENTINA',
    actividad: '',
    sexo: 'MASCULINO',
    estadoCivil: 'SOLTERO',
    dniArchivoId: null,
    conyuge: {
      nombres: '',
      apellidos: '',
      tipoID: 'DNI',
      idNumero: '',
      tipoClaveFiscal: 'CUIT',
      claveFiscal: ''
    }
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [fechaNacimientoError, setFechaNacimientoError] = useState('');

  useEffect(() => {
    const checkSession = () => {
      const currentUser = authenticationService.currentUserValue;
      if (!currentUser || !authenticationService.checkSessionValidity()) {
        history.push('/');
        return;
      }
      cargarDatosExistentes();
    };

    checkSession();
  }, [history]);

  const cargarDatosExistentes = async () => {
    try {
      setLoading(true);
      const currentSolicitudId = localStorage.getItem('currentSolicitudId');
      
      console.log('Cargando datos personales existentes...');
      console.log('currentSolicitudId:', currentSolicitudId);
      
      if (currentSolicitudId) {
        const response = await authenticationService.getDatosPersonalesIndividuo(currentSolicitudId);
        console.log('Respuesta del backend datos personales:', response);
        
        if (response && (response.status === 200 || response.ok)) {
          // Los datos están directamente en la respuesta, no en response.data
          if (response.tipoID || response.idNumero || response.fechaNacimiento) {
            console.log('Cargando datos personales en el formulario:', response);
            setFormData({
              ...formData,
              ...response,
              conyuge: {
                ...formData.conyuge,
                ...response.conyuge
              }
            });

            // Si hay un dniArchivoId, cargar el archivo
            if (response.dniArchivoId) {
              console.log('Cargando archivo DNI con ID:', response.dniArchivoId);
              cargarArchivoDNI(response.dniArchivoId);
            }
          } else {
            console.log('No hay datos personales existentes para cargar');
          }
        } else {
          console.log('Error en la respuesta del backend datos personales:', response);
        }
      } else {
        console.log('No se encontro currentSolicitudId para cargar datos personales');
      }
    } catch (err) {
      console.error('Error cargando datos personales:', err);
      setError('Error al cargar los datos personales existentes');
    } finally {
      setLoading(false);
    }
  };

  const cargarArchivoDNI = async (archivoId) => {
    try {
      console.log('Obteniendo archivo con ID:', archivoId);
      const response = await authenticationService.getArchivo(archivoId);
      
      if (response && response.ok) {
        console.log('Archivo cargado exitosamente:', response);
        console.log('Filename obtenido:', response.filename);
        
        // Crear un objeto de archivo para mostrar en la interfaz
        const archivoExistente = {
          id: archivoId,
          name: response.filename || 'DNI.pdf',
          size: response.blob.size,
          type: response.blob.type,
          url: response.url
        };
        
        setUploadedFiles([archivoExistente]);
        console.log('Archivo agregado a uploadedFiles:', archivoExistente);
      } else {
        console.error('Error al cargar el archivo:', response);
      }
    } catch (error) {
      console.error('Error al cargar el archivo DNI:', error);
    }
  };

  const validateFechaNacimiento = (fecha) => {
    if (!fecha) return true; // No validar si está vacío
    
    const fechaNacimiento = new Date(fecha);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    
    // Ajustar si aún no cumplió años este año
    const edadReal = mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate()) ? edad - 1 : edad;
    
    if (edadReal < 18) {
      setFechaNacimientoError('Debe ser mayor de 18 años');
      return false;
    } else {
      setFechaNacimientoError('');
      return true;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Validar fecha de nacimiento si es ese campo
    if (field === 'fechaNacimiento') {
      validateFechaNacimiento(value);
    }
  };

  const handleConyugeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      conyuge: {
        ...prev.conyuge,
        [field]: value
      }
    }));
    
  };


  const handleDNIChange = (value) => {
    // Solo permitir números
    const numericValue = value.replace(/[^0-9]/g, '');
    handleInputChange('idNumero', numericValue);
  };

  const handleConyugeDNIChange = (value) => {
    // Solo permitir números para DNI del cónyuge
    const numericValue = value.replace(/[^0-9]/g, '');
    handleConyugeChange('idNumero', numericValue);
  };

  const isFormValid = () => {
    // Validar campos requeridos principales
    const camposRequeridos = [
      formData.tipoID,
      formData.idNumero,
      formData.fechaNacimiento,
      formData.lugarNacimiento,
      formData.nacionalidad,
      formData.paisOrigen,
      formData.paisResidencia,
      formData.actividad,
      formData.sexo,
      formData.estadoCivil
    ];

    // Verificar que todos los campos requeridos estén completos
    const camposCompletos = camposRequeridos.every(campo => campo && campo.trim() !== '');
    
    // Verificar que no haya errores de validación
    const sinErrores = !fechaNacimientoError;
    
    // Verificar que se haya subido al menos un archivo DNI
    const archivoSubido = formData.dniArchivoId !== null;
    
    // Si está casado, validar también los campos del cónyuge
    let conyugeValido = true;
    if (formData.estadoCivil === 'CASADO') {
      const camposConyuge = [
        formData.conyuge.nombres,
        formData.conyuge.apellidos,
        formData.conyuge.tipoID,
        formData.conyuge.idNumero,
        formData.conyuge.tipoClaveFiscal,
        formData.conyuge.claveFiscal
      ];
      conyugeValido = camposConyuge.every(campo => campo && campo.trim() !== '');
    }
    
    return camposCompletos && sinErrores && archivoSubido && conyugeValido;
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploadingFiles(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        // Usar la URL del Ghost para la subida de archivos
        const ghostUrl = process.env.REACT_APP_GHOST_URL || 'http://localhost:8080';
        const response = await fetch(`${ghostUrl}/api/archivos/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Error uploading ${file.name}`);
        }

        const result = await response.json();
        return {
          id: result.id || result.dniArchivoId,
          name: file.name,
          size: file.size,
          type: file.type
        };
      });

      const uploadedResults = await Promise.all(uploadPromises);
      setUploadedFiles(prev => [...prev, ...uploadedResults]);
      
      // Si solo hay un archivo, asignarlo al dniArchivoId
      if (uploadedResults.length === 1) {
        setFormData(prev => ({
          ...prev,
          dniArchivoId: uploadedResults[0].id
        }));
      }
    } catch (err) {
      console.error('Error uploading files:', err);
      setError('Error al subir los archivos');
    } finally {
      setUploadingFiles(false);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    
    // Solo limpiar el dniArchivoId si se está eliminando el archivo actual
    if (formData.dniArchivoId === fileId) {
      setFormData(prev => ({
        ...prev,
        dniArchivoId: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.dniArchivoId) {
      setError('Debe subir al menos un archivo DNI');
      return;
    }

    // Validar edad antes de enviar
    if (!validateFechaNacimiento(formData.fechaNacimiento)) {
      setError('Debe ser mayor de 18 años para continuar');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const currentUser = authenticationService.currentUserValue;
      const currentSolicitudId = localStorage.getItem('currentSolicitudId');
      
      const dataToSave = {
        ...formData,
        solicitudId: parseInt(currentSolicitudId)
      };

      const response = await authenticationService.saveDatosPersonalesIndividuo(currentUser.id, dataToSave);
      
      if (response && (response.status === 200 || response.ok)) {
        // Redirigir a la siguiente pantalla
        history.push('/apertura/individuo/domicilio');
      } else {
        setError('Error al guardar los datos personales');
      }
    } catch (err) {
      console.error('Error saving datos personales:', err);
      setError('Error al guardar los datos personales');
    } finally {
      setLoading(false);
    }
  };

  const tipoIDOptions = [
    { value: 'DNI', label: 'DNI' },
    { value: 'LC', label: 'Libreta Cívica' },
    { value: 'LE', label: 'Libreta de Enrolamiento' },
    { value: 'PAS', label: 'Pasaporte' },
    { value: 'EXT', label: 'Cédula Extranjera' }
  ];

  const sexoOptions = [
    { value: 'MASCULINO', label: 'Masculino' },
    { value: 'FEMENINO', label: 'Femenino' },
    { value: 'NO_BINARIO', label: 'No Binario' }
  ];

  const estadoCivilOptions = [
    { value: 'SOLTERO', label: 'Soltero' },
    { value: 'CASADO', label: 'Casado' },
    { value: 'DIVORCIADO', label: 'Divorciado' },
    { value: 'VIUDO', label: 'Viudo' },
    { value: 'CONCUBINATO', label: 'Concubinato' }, 
    { value: 'SEPARADO', label: 'Separado' }
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

  const tipoClaveFiscalOptions = [
    { value: 'CUIT', label: 'CUIT' },
    { value: 'CUIL', label: 'CUIL' },
    { value: 'CDI', label: 'CDI' }
  ];

  if (loading && !formData.idNumero) {
    return (
      <Container maxWidth="md" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          style={{ 
            color: 'var(--light-blue)',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}
        >
          Datos Personales
        </Typography>

        {error && (
          <Card style={{ 
            marginBottom: '1rem', 
            width: '100%', 
            maxWidth: '600px',
            backgroundColor: '#ffebee',
            border: '1px solid #f44336'
          }}>
            <CardContent style={{ padding: '1rem' }}>
              <Typography variant="body2" style={{ color: '#d32f2f', textAlign: 'center' }}>
                {error}
              </Typography>
            </CardContent>
          </Card>
        )}

        <Card style={{ width: '100%', maxWidth: '800px' }}>
          <CardContent style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Tipo de Documento</InputLabel>
                    <Select
                      value={formData.tipoID}
                      onChange={(e) => handleInputChange('tipoID', e.target.value)}
                      label="Tipo de Documento"
                    >
                      {tipoIDOptions.map((option) => (
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
                    label="Número de Documento"
                    value={formData.idNumero}
                    onChange={(e) => handleDNIChange(e.target.value)}
                    required
                  />
                </Grid>


                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Fecha de Nacimiento"
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    error={!!fechaNacimientoError}
                    helperText={fechaNacimientoError}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Lugar de Nacimiento"
                    value={formData.lugarNacimiento}
                    onChange={(e) => handleInputChange('lugarNacimiento', e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Nacionalidad</InputLabel>
                    <Select
                      value={formData.nacionalidad}
                      onChange={(e) => handleInputChange('nacionalidad', e.target.value)}
                      label="Nacionalidad"
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
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>País de Origen</InputLabel>
                    <Select
                      value={formData.paisOrigen}
                      onChange={(e) => handleInputChange('paisOrigen', e.target.value)}
                      label="País de Origen"
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
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>País de Residencia</InputLabel>
                    <Select
                      value={formData.paisResidencia}
                      onChange={(e) => handleInputChange('paisResidencia', e.target.value)}
                      label="País de Residencia"
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
                    label="Actividad"
                    value={formData.actividad}
                    onChange={(e) => handleInputChange('actividad', e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Sexo</InputLabel>
                    <Select
                      value={formData.sexo}
                      onChange={(e) => handleInputChange('sexo', e.target.value)}
                      label="Sexo"
                    >
                      {sexoOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Estado Civil</InputLabel>
                    <Select
                      value={formData.estadoCivil}
                      onChange={(e) => handleInputChange('estadoCivil', e.target.value)}
                      label="Estado Civil"
                    >
                      {estadoCivilOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>


                <Grid item xs={12}>
                  <input
                    accept="image/*,.pdf"
                    style={{ display: 'none' }}
                    id="dni-upload"
                    multiple
                    type="file"
                    onChange={handleFileUpload}
                    capture="environment"
                  />
                  <label htmlFor="dni-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      disabled={uploadingFiles}
                      style={{ 
                        width: '100%',
                        padding: '1rem',
                        border: '2px dashed #ccc'
                      }}
                    >
                      {uploadingFiles ? 'Subiendo...' : 'Subir DNI (Puede subir múltiples archivos)'}
                    </Button>
                  </label>
                  <Typography variant="caption" display="block" style={{ marginTop: '0.5rem', color: '#666' }}>
                    Formatos permitidos: JPG, PNG, PDF. En móvil se abrirá la cámara.
                  </Typography>
                </Grid>

                {/* Archivos Subidos */}
                {uploadedFiles.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" style={{ marginBottom: '0.5rem' }}>
                      Archivos subidos:
                    </Typography>
                    {uploadedFiles.map((file) => (
                      <Chip
                        key={file.id}
                        label={`${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`}
                        onDelete={() => removeFile(file.id)}
                        deleteIcon={<Delete />}
                        style={{ margin: '0.25rem' }}
                      />
                    ))}
                  </Grid>
                )}

                {/* Datos del Cónyuge - Solo si está casado */}
                {formData.estadoCivil === 'CASADO' && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h6" style={{ marginBottom: '1rem', color: 'var(--light-blue)', marginTop: '2rem' }}>
                        Datos del Cónyuge
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Nombres del Cónyuge"
                        value={formData.conyuge.nombres}
                        onChange={(e) => handleConyugeChange('nombres', e.target.value)}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Apellidos del Cónyuge"
                        value={formData.conyuge.apellidos}
                        onChange={(e) => handleConyugeChange('apellidos', e.target.value)}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Tipo de Documento</InputLabel>
                        <Select
                          value={formData.conyuge.tipoID}
                          onChange={(e) => handleConyugeChange('tipoID', e.target.value)}
                          label="Tipo de Documento"
                        >
                          {tipoIDOptions.map((option) => (
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
                        label="Número de Documento"
                        value={formData.conyuge.idNumero}
                        onChange={(e) => handleConyugeDNIChange(e.target.value)}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Tipo de Clave Fiscal</InputLabel>
                        <Select
                          value={formData.conyuge.tipoClaveFiscal}
                          onChange={(e) => handleConyugeChange('tipoClaveFiscal', e.target.value)}
                          label="Tipo de Clave Fiscal"
                        >
                          {tipoClaveFiscalOptions.map((option) => (
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
                        value={formData.conyuge.claveFiscal}
                        onChange={(e) => handleConyugeChange('claveFiscal', e.target.value)}
                        required
                      />
                    </Grid>
                  </>
                )}

                {/* Botones */}
                <Grid item xs={12} style={{ marginTop: '2rem' }}>
                  <Box display="flex" justifyContent="center" className="navigation-buttons">
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      onClick={() => history.push('/apertura/individuo/datos-principales')}
                      className="navigation-button"
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
                        color: 'white'
                      }}
                    >
                      {loading ? <CircularProgress size={20} color="inherit" /> : 'Continuar'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default DatosPersonalesPage;
