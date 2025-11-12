import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import { Add, ArrowBack, Delete, Edit } from '@material-ui/icons';
import { authenticationService, firmantesService } from '../../services';

const steps = ['Datos Principales', 'Datos Personales', 'Domicilio', 'Datos Fiscales', 'Declaraciones'];

const initialFormData = {
  id: null,
  datosPrincipales: {
    nombres: '',
    apellidos: '',
    celular: '',
    correoElectronico: ''
  },
  datosPersonales: {
    id: null,
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
    dniFrenteArchivoId: null,
    dniReversoArchivoId: null,
    conyuge: {
      id: null,
      nombres: '',
      apellidos: '',
      tipoID: 'DNI',
      idNumero: '',
      tipoClaveFiscal: 'CUIT',
      claveFiscal: ''
    }
  },
  domicilio: {
    id: null,
    tipo: 'LEGAL',
    calle: '',
    numero: '',
    piso: '',
    depto: '',
    barrio: '',
    ciudad: '',
    provincia: '',
    pais: 'ARGENTINA',
    cp: ''
  },
  datosFiscales: {
    id: null,
    tipo: 'CUIT',
    claveFiscal: '',
    tipoIva: 'CONSUMIDOR_FINAL',
    tipoGanancia: 'NO_INSCRIPTO',
    residenciaFiscal: 'ARGENTINA',
    debeCompletarFiscalExterior: false
  },
  declaraciones: {
    esPep: false,
    motivoPep: '',
    esFATCA: false,
    motivoFatca: '',
    declaraUIF: false,
    motivoUIF: ''
  }
};

const tipoDocumentoOptions = [
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
  'ARGENTINA',
  'BRASIL',
  'CHILE',
  'URUGUAY',
  'PARAGUAY',
  'BOLIVIA',
  'PERU',
  'COLOMBIA',
  'VENEZUELA',
  'ECUADOR',
  'MEXICO',
  'ESPAÑA',
  'ITALIA',
  'FRANCIA',
  'ALEMANIA',
  'ESTADOS_UNIDOS',
  'CANADA',
  'REINO_UNIDO',
  'OTRO'
];

const tipoFiscalOptions = [
  'CUIT',
  'CUIL',
  'CDI',
  'NIF',
  'NIE',
  'CIF',
  'RUT',
  'RUN',
  'NIT',
  'SAT',
  'RFC',
  'NSS',
  'SSN',
  'TIN',
  'TaxID',
  'CPF',
  'DUI',
  'RTU',
  'Otro'
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

const CoTitularesPage = () => {
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [firmantes, setFirmantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [editingFirmanteId, setEditingFirmanteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const solicitudId = useMemo(() => localStorage.getItem('currentSolicitudId'), []);

  useEffect(() => {
    const checkSession = () => {
      const currentUser = authenticationService.currentUserValue;
      if (!currentUser || !authenticationService.checkSessionValidity()) {
        history.push('/');
        return false;
      }
      return true;
    };

    if (checkSession()) {
      cargarFirmantes();
    }
  }, [history, solicitudId]);

  const cargarFirmantes = async () => {
    try {
      setLoading(true);
      setError('');

      if (!solicitudId) {
        setError('No se encontró el identificador de la solicitud.');
        return;
      }

      const response = await firmantesService.getFirmantes(solicitudId);

      if (response && (response.status === 200 || response.ok)) {
        const lista = Array.isArray(response) ? response : response.firmantes || [];
        setFirmantes(lista);
      } else {
        setError('Error al obtener los co-titulares.');
      }
    } catch (err) {
      console.error('Error cargando co-titulares:', err);
      setError('Error al cargar los co-titulares.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCrear = () => {
    setFormData(initialFormData);
    setActiveStep(0);
    setEditingFirmanteId(null);
    setFormError('');
    setFormOpen(true);
  };

  const normalizarDatos = (firmante) => {
    if (!firmante) return initialFormData;

    const datosPrincipales = firmante.datosPrincipales || {};
    const datosPersonales = firmante.datosPersonales || {};
    const domicilio = firmante.domicilio || {};
    const datosFiscales = firmante.datosFiscales || {};
    const declaraciones = firmante.declaraciones || {};
    const conyuge = (datosPersonales.conyuge || firmante.conyuge) || {};

    return {
      id: firmante.id || null,
      datosPrincipales: {
        nombres: datosPrincipales.nombres ?? firmante.nombres ?? '',
        apellidos: datosPrincipales.apellidos ?? firmante.apellidos ?? '',
        celular: datosPrincipales.celular ?? firmante.celular ?? '',
        correoElectronico: datosPrincipales.correoElectronico ?? firmante.correoElectronico ?? ''
      },
      datosPersonales: {
        id: datosPersonales.id ?? null,
        tipoID: datosPersonales.tipoID ?? firmante.tipoID ?? 'DNI',
        idNumero: datosPersonales.idNumero ?? firmante.idNumero ?? '',
        fechaNacimiento: datosPersonales.fechaNacimiento ?? firmante.fechaNacimiento ?? '',
        lugarNacimiento: datosPersonales.lugarNacimiento ?? firmante.lugarNacimiento ?? '',
        nacionalidad: datosPersonales.nacionalidad ?? firmante.nacionalidad ?? 'ARGENTINA',
        paisOrigen: datosPersonales.paisOrigen ?? firmante.paisOrigen ?? 'ARGENTINA',
        paisResidencia: datosPersonales.paisResidencia ?? firmante.paisResidencia ?? 'ARGENTINA',
        actividad: datosPersonales.actividad ?? firmante.actividad ?? '',
        sexo: datosPersonales.sexo ?? firmante.sexo ?? 'MASCULINO',
        estadoCivil: datosPersonales.estadoCivil ?? firmante.estadoCivil ?? 'SOLTERO',
        dniFrenteArchivoId: datosPersonales.dniFrenteArchivoId ?? firmante.dniFrenteArchivoId ?? null,
        dniReversoArchivoId: datosPersonales.dniReversoArchivoId ?? firmante.dniReversoArchivoId ?? null,
        conyuge: {
          id: conyuge.id ?? null,
          nombres: conyuge.nombres ?? '',
          apellidos: conyuge.apellidos ?? '',
          tipoID: conyuge.tipoID ?? 'DNI',
          idNumero: conyuge.idNumero ?? '',
          tipoClaveFiscal: conyuge.tipoClaveFiscal ?? 'CUIT',
          claveFiscal: conyuge.claveFiscal ?? ''
        }
      },
      domicilio: {
        id: domicilio.id ?? null,
        tipo: domicilio.tipo ?? 'LEGAL',
        calle: domicilio.calle ?? '',
        numero: domicilio.numero ?? '',
        piso: domicilio.piso ?? '',
        depto: domicilio.depto ?? '',
        barrio: domicilio.barrio ?? '',
        ciudad: domicilio.ciudad ?? '',
        provincia: domicilio.provincia ?? '',
        pais: domicilio.pais ?? 'ARGENTINA',
        cp: domicilio.cp ?? ''
      },
      datosFiscales: {
        id: datosFiscales.id ?? null,
        tipo: datosFiscales.tipo ?? 'CUIT',
        claveFiscal: datosFiscales.claveFiscal ?? '',
        tipoIva: datosFiscales.tipoIva ?? 'CONSUMIDOR_FINAL',
        tipoGanancia: datosFiscales.tipoGanancia ?? 'NO_INSCRIPTO',
        residenciaFiscal: datosFiscales.residenciaFiscal ?? 'ARGENTINA',
        debeCompletarFiscalExterior:
          datosFiscales.debeCompletarFiscalExterior ??
          firmante.debeCompletarFiscalExterior ??
          false
      },
      declaraciones: {
        esPep: declaraciones.esPep ?? firmante.esPep ?? false,
        motivoPep: declaraciones.motivoPep ?? firmante.motivoPep ?? '',
        esFATCA: declaraciones.esFATCA ?? firmante.esFATCA ?? false,
        motivoFatca: declaraciones.motivoFatca ?? firmante.motivoFatca ?? '',
        declaraUIF: declaraciones.declaraUIF ?? firmante.declaraUIF ?? false,
        motivoUIF: declaraciones.motivoUIF ?? firmante.motivoUIF ?? ''
      }
    };
  };

  const handleOpenEditar = (firmante) => {
    const normalizado = normalizarDatos(firmante);
    setFormData(normalizado);
    setEditingFirmanteId(normalizado.id);
    setActiveStep(0);
    setFormError('');
    setFormOpen(true);
  };

  const handleCancelForm = () => {
    if (loading) return;
    setFormOpen(false);
    setFormData(initialFormData);
    setEditingFirmanteId(null);
    setActiveStep(0);
    setFormError('');
    setSaving(false);
  };

  const handleFieldChange = (path, value) => {
    setFormData((prev) => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < path.length - 1; i += 1) {
        const key = path[i];
        current[key] = { ...current[key] };
        current = current[key];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  const persistCurrentForm = async () => {
    if (!solicitudId) {
      setFormError('No se encontró el identificador de la solicitud.');
      return false;
    }

    let currentId = formData.id ?? editingFirmanteId ?? null;
    if (typeof currentId === 'string') {
      const parsed = Number(currentId);
      if (!Number.isNaN(parsed)) {
        currentId = parsed;
      }
    }
    const payload = {
      id: currentId,
      tipo: 'CO_TITULAR',
      datosPrincipales: {
        ...formData.datosPrincipales,
        nombres: formData.datosPrincipales.nombres ?? '',
        apellidos: formData.datosPrincipales.apellidos ?? '',
        celular: formData.datosPrincipales.celular ?? '',
        correoElectronico: formData.datosPrincipales.correoElectronico ?? ''
      },
      datosPersonales: {
        ...formData.datosPersonales,
        tipoID: formData.datosPersonales.tipoID ?? 'DNI',
        idNumero: formData.datosPersonales.idNumero ?? '',
        fechaNacimiento: formData.datosPersonales.fechaNacimiento ?? '',
        lugarNacimiento: formData.datosPersonales.lugarNacimiento ?? '',
        nacionalidad: formData.datosPersonales.nacionalidad ?? 'ARGENTINA',
        paisOrigen: formData.datosPersonales.paisOrigen ?? 'ARGENTINA',
        paisResidencia: formData.datosPersonales.paisResidencia ?? 'ARGENTINA',
        actividad: formData.datosPersonales.actividad ?? '',
        sexo: formData.datosPersonales.sexo ?? 'MASCULINO',
        estadoCivil: formData.datosPersonales.estadoCivil ?? 'SOLTERO',
        dniFrenteArchivoId: formData.datosPersonales.dniFrenteArchivoId ?? null,
        dniReversoArchivoId: formData.datosPersonales.dniReversoArchivoId ?? null,
        conyuge: {
          ...formData.datosPersonales.conyuge
        }
      },
      domicilio: {
        ...formData.domicilio,
        tipo: formData.domicilio.tipo ?? 'LEGAL',
        calle: formData.domicilio.calle ?? '',
        numero: formData.domicilio.numero ?? '',
        piso: formData.domicilio.piso ?? '',
        depto: formData.domicilio.depto ?? '',
        barrio: formData.domicilio.barrio ?? '',
        ciudad: formData.domicilio.ciudad ?? '',
        provincia: formData.domicilio.provincia ?? '',
        pais: formData.domicilio.pais ?? 'ARGENTINA',
        cp: formData.domicilio.cp ?? ''
      },
      datosFiscales: {
        ...formData.datosFiscales,
        tipo: formData.datosFiscales.tipo ?? 'CUIT',
        claveFiscal: formData.datosFiscales.claveFiscal ?? '',
        tipoIva: formData.datosFiscales.tipoIva ?? 'CONSUMIDOR_FINAL',
        tipoGanancia: formData.datosFiscales.tipoGanancia ?? 'NO_INSCRIPTO',
        residenciaFiscal: formData.datosFiscales.residenciaFiscal ?? 'ARGENTINA',
        debeCompletarFiscalExterior: formData.datosFiscales.debeCompletarFiscalExterior ?? false
      },
      declaraciones: {
        esPep: formData.declaraciones.esPep,
        motivoPep: formData.declaraciones.motivoPep,
        esFATCA: formData.declaraciones.esFATCA,
        motivoFatca: formData.declaraciones.motivoFatca,
        declaraUIF: formData.declaraciones.declaraUIF,
        motivoUIF: formData.declaraciones.motivoUIF
      },
      nombres: formData.datosPrincipales.nombres,
      apellidos: formData.datosPrincipales.apellidos,
      celular: formData.datosPrincipales.celular,
      correoElectronico: formData.datosPrincipales.correoElectronico,
      tipoID: formData.datosPersonales.tipoID,
      idNumero: formData.datosPersonales.idNumero,
      fechaNacimiento: formData.datosPersonales.fechaNacimiento,
      lugarNacimiento: formData.datosPersonales.lugarNacimiento,
      nacionalidad: formData.datosPersonales.nacionalidad,
      paisOrigen: formData.datosPersonales.paisOrigen,
      paisResidencia: formData.datosPersonales.paisResidencia,
      actividad: formData.datosPersonales.actividad,
      sexo: formData.datosPersonales.sexo,
      estadoCivil: formData.datosPersonales.estadoCivil,
      dniFrenteArchivoId: formData.datosPersonales.dniFrenteArchivoId,
      dniReversoArchivoId: formData.datosPersonales.dniReversoArchivoId,
      esPep: formData.declaraciones.esPep,
      motivoPep: formData.declaraciones.motivoPep,
      esFATCA: formData.declaraciones.esFATCA,
      motivoFatca: formData.declaraciones.motivoFatca,
      declaraUIF: formData.declaraciones.declaraUIF,
      motivoUIF: formData.declaraciones.motivoUIF
    };

    try {
      setSaving(true);
      let response;
      if (currentId) {
        response = await firmantesService.updateFirmante(solicitudId, currentId, payload);
      } else {
        response = await firmantesService.createFirmante(solicitudId, payload);
      }

      const success =
        response && (response.status === 200 || response.status === 201 || response.status === 204 || response.ok);

      if (!success) {
        setFormError('Error al guardar el co-titular.');
        return false;
      }

      setFormError('');
      return true;
    } catch (err) {
      console.error('Error guardando co-titular:', err);
      setFormError('Error al guardar el co-titular.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const validateStep = (stepIndex) => {
    switch (stepIndex) {
      case 0: {
        const { nombres, apellidos, correoElectronico } = formData.datosPrincipales;
        if (!nombres || !apellidos || !correoElectronico) {
          setFormError('Completá al menos nombre, apellido y correo electrónico.');
          return false;
        }
        break;
      }
      case 1: {
        const { tipoID, idNumero, fechaNacimiento } = formData.datosPersonales;
        if (!tipoID || !idNumero || !fechaNacimiento) {
          setFormError('Completá tipo y número de documento y la fecha de nacimiento.');
          return false;
        }
        break;
      }
      case 2: {
        const { calle, numero, ciudad, provincia, pais } = formData.domicilio;
        if (!calle || !numero || !ciudad || !provincia || !pais) {
          setFormError('Completá los datos principales del domicilio.');
          return false;
        }
        break;
      }
      default:
        break;
    }
    setFormError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      persistCurrentForm().then((saved) => {
        if (saved) {
          setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
      });
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSave = async () => {
    if (!validateStep(activeStep)) return;

    persistCurrentForm().then(async (saved) => {
      if (saved) {
        setFormOpen(false);
        setFormData(initialFormData);
        setEditingFirmanteId(null);
        setActiveStep(0);
        await cargarFirmantes();
      }
    });
  };

  const handleDelete = async (firmante) => {
    if (!solicitudId || !firmante?.id) return;
    const confirmar = window.confirm(
      `¿Seguro que querés eliminar al co-titular ${firmante.datosPrincipales?.nombres || ''} ${firmante.datosPrincipales?.apellidos || ''}?`
    );
    if (!confirmar) return;

    try {
      setLoading(true);
      const response = await firmantesService.deleteFirmante(solicitudId, firmante.id);
      if (response && (response.status === 200 || response.status === 204 || response.ok)) {
        await cargarFirmantes();
      } else {
        setError('Error al eliminar el co-titular.');
      }
    } catch (err) {
      console.error('Error eliminando co-titular:', err);
      setError('Error al eliminar el co-titular.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombres"
                variant="outlined"
                value={formData.datosPrincipales.nombres}
                onChange={(e) => handleFieldChange(['datosPrincipales', 'nombres'], e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellidos"
                variant="outlined"
                value={formData.datosPrincipales.apellidos}
                onChange={(e) => handleFieldChange(['datosPrincipales', 'apellidos'], e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Celular"
                variant="outlined"
                value={formData.datosPrincipales.celular}
                onChange={(e) => handleFieldChange(['datosPrincipales', 'celular'], e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Correo electrónico"
                variant="outlined"
                value={formData.datosPrincipales.correoElectronico}
                onChange={(e) => handleFieldChange(['datosPrincipales', 'correoElectronico'], e.target.value)}
                required
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Tipo de documento</InputLabel>
                <Select
                  value={formData.datosPersonales.tipoID}
                  onChange={(e) => handleFieldChange(['datosPersonales', 'tipoID'], e.target.value)}
                  label="Tipo de documento"
                >
                  {tipoDocumentoOptions.map((option) => (
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
                label="Número de documento"
                variant="outlined"
                value={formData.datosPersonales.idNumero}
                onChange={(e) => handleFieldChange(['datosPersonales', 'idNumero'], e.target.value.replace(/[^0-9]/g, ''))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha de nacimiento"
                type="date"
                variant="outlined"
                value={formData.datosPersonales.fechaNacimiento}
                onChange={(e) => handleFieldChange(['datosPersonales', 'fechaNacimiento'], e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Lugar de nacimiento"
                variant="outlined"
                value={formData.datosPersonales.lugarNacimiento}
                onChange={(e) => handleFieldChange(['datosPersonales', 'lugarNacimiento'], e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Nacionalidad</InputLabel>
                <Select
                  value={formData.datosPersonales.nacionalidad}
                  onChange={(e) => handleFieldChange(['datosPersonales', 'nacionalidad'], e.target.value)}
                  label="Nacionalidad"
                >
                  {paisesOptions.map((pais) => (
                    <MenuItem key={pais} value={pais}>
                      {pais}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>País de origen</InputLabel>
                <Select
                  value={formData.datosPersonales.paisOrigen}
                  onChange={(e) => handleFieldChange(['datosPersonales', 'paisOrigen'], e.target.value)}
                  label="País de origen"
                >
                  {paisesOptions.map((pais) => (
                    <MenuItem key={pais} value={pais}>
                      {pais}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>País de residencia</InputLabel>
                <Select
                  value={formData.datosPersonales.paisResidencia}
                  onChange={(e) => handleFieldChange(['datosPersonales', 'paisResidencia'], e.target.value)}
                  label="País de residencia"
                >
                  {paisesOptions.map((pais) => (
                    <MenuItem key={pais} value={pais}>
                      {pais}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Actividad"
                variant="outlined"
                value={formData.datosPersonales.actividad}
                onChange={(e) => handleFieldChange(['datosPersonales', 'actividad'], e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Sexo</InputLabel>
                <Select
                  value={formData.datosPersonales.sexo}
                  onChange={(e) => handleFieldChange(['datosPersonales', 'sexo'], e.target.value)}
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
                  value={formData.datosPersonales.estadoCivil}
                  onChange={(e) => handleFieldChange(['datosPersonales', 'estadoCivil'], e.target.value)}
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
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Calle"
                variant="outlined"
                value={formData.domicilio.calle}
                onChange={(e) => handleFieldChange(['domicilio', 'calle'], e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Número"
                variant="outlined"
                value={formData.domicilio.numero}
                onChange={(e) => handleFieldChange(['domicilio', 'numero'], e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Piso"
                variant="outlined"
                value={formData.domicilio.piso}
                onChange={(e) => handleFieldChange(['domicilio', 'piso'], e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Departamento"
                variant="outlined"
                value={formData.domicilio.depto}
                onChange={(e) => handleFieldChange(['domicilio', 'depto'], e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Barrio"
                variant="outlined"
                value={formData.domicilio.barrio}
                onChange={(e) => handleFieldChange(['domicilio', 'barrio'], e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ciudad"
                variant="outlined"
                value={formData.domicilio.ciudad}
                onChange={(e) => handleFieldChange(['domicilio', 'ciudad'], e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Provincia"
                variant="outlined"
                value={formData.domicilio.provincia}
                onChange={(e) => handleFieldChange(['domicilio', 'provincia'], e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>País</InputLabel>
                <Select
                  value={formData.domicilio.pais}
                  onChange={(e) => handleFieldChange(['domicilio', 'pais'], e.target.value)}
                  label="País"
                >
                  {paisesOptions.map((pais) => (
                    <MenuItem key={pais} value={pais}>
                      {pais}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Código Postal"
                variant="outlined"
                value={formData.domicilio.cp}
                onChange={(e) => handleFieldChange(['domicilio', 'cp'], e.target.value)}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Tipo identificador fiscal</InputLabel>
                <Select
                  value={formData.datosFiscales.tipo}
                  onChange={(e) => handleFieldChange(['datosFiscales', 'tipo'], e.target.value)}
                  label="Tipo identificador fiscal"
                >
                  {tipoFiscalOptions.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Clave fiscal"
                variant="outlined"
                value={formData.datosFiscales.claveFiscal}
                onChange={(e) => handleFieldChange(['datosFiscales', 'claveFiscal'], e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Tipo IVA</InputLabel>
                <Select
                  value={formData.datosFiscales.tipoIva}
                  onChange={(e) => handleFieldChange(['datosFiscales', 'tipoIva'], e.target.value)}
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
                <InputLabel>Tipo Ganancias</InputLabel>
                <Select
                  value={formData.datosFiscales.tipoGanancia}
                  onChange={(e) => handleFieldChange(['datosFiscales', 'tipoGanancia'], e.target.value)}
                  label="Tipo Ganancias"
                >
                  {tipoGananciaOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Residencia Fiscal</InputLabel>
                <Select
                  value={formData.datosFiscales.residenciaFiscal}
                  onChange={(e) => handleFieldChange(['datosFiscales', 'residenciaFiscal'], e.target.value)}
                  label="Residencia Fiscal"
                >
                  {paisesOptions.map((pais) => (
                    <MenuItem key={pais} value={pais}>
                      {pais}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={formData.declaraciones.esPep}
                    onChange={(e) => handleFieldChange(['declaraciones', 'esPep'], e.target.checked)}
                  />
                }
                label="¿Es Persona Expuesta Políticamente (PEP)?"
              />
              {formData.declaraciones.esPep && (
                <TextField
                  fullWidth
                  label="Motivo PEP"
                  variant="outlined"
                  multiline
                  rows={2}
                  value={formData.declaraciones.motivoPep}
                  onChange={(e) => handleFieldChange(['declaraciones', 'motivoPep'], e.target.value)}
                  style={{ marginTop: '1rem' }}
                />
              )}
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={formData.declaraciones.esFATCA}
                    onChange={(e) => handleFieldChange(['declaraciones', 'esFATCA'], e.target.checked)}
                  />
                }
                label="¿Es Residente tributario fuera de Argentina (FATCA)?"
              />
              {formData.declaraciones.esFATCA && (
                <TextField
                  fullWidth
                  label="Motivo FATCA"
                  variant="outlined"
                  multiline
                  rows={2}
                  value={formData.declaraciones.motivoFatca}
                  onChange={(e) => handleFieldChange(['declaraciones', 'motivoFatca'], e.target.value)}
                  style={{ marginTop: '1rem' }}
                />
              )}
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={formData.declaraciones.declaraUIF}
                    onChange={(e) => handleFieldChange(['declaraciones', 'declaraUIF'], e.target.checked)}
                  />
                }
                label="¿Es Sujeto Obligado a informar ante la UIF?"
              />
              {formData.declaraciones.declaraUIF && (
                <TextField
                  fullWidth
                  label="Motivo UIF"
                  variant="outlined"
                  multiline
                  rows={2}
                  value={formData.declaraciones.motivoUIF}
                  onChange={(e) => handleFieldChange(['declaraciones', 'motivoUIF'], e.target.value)}
                  style={{ marginTop: '1rem' }}
                />
              )}
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        alignItems={isMobile ? 'flex-start' : 'center'}
        justifyContent="space-between"
        marginBottom="1.5rem"
        gap="1rem"
      >
        <Typography variant="h4" component="h1" style={{ color: 'var(--light-blue)', fontWeight: 'bold' }}>
          Co-Titulares
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenCrear}
          style={{ backgroundColor: 'var(--main-green)', color: '#fff', alignSelf: isMobile ? 'stretch' : 'auto' }}
        >
          Agregar Co-Titular
        </Button>
      </Box>

      {error && (
        <Card
          style={{
            marginBottom: '1rem',
            backgroundColor: '#ffebee',
            border: '1px solid #f44336'
          }}
        >
          <CardContent>
            <Typography variant="body2" style={{ color: '#d32f2f' }}>
              {error}
            </Typography>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : firmantes.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              Aún no registraste co-titulares. Utilizá el botón &quot;Agregar Co-Titular&quot; para comenzar.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombres</TableCell>
                  <TableCell>Apellidos</TableCell>
                  {!isMobile && <TableCell>Documento</TableCell>}
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {firmantes.map((firmante) => {
                  const nombres = firmante?.nombres || '-';
                  const apellidos = firmante?.apellidos || '-';
                  const documentoTipo = firmante?.tipoID || '';
                  const documentoNumero = firmante?.idNumero || '';
                  const documento =
                    documentoTipo && documentoNumero ? `${documentoTipo} ${documentoNumero}` : documentoTipo || documentoNumero || '-';

                  return (
                    <TableRow key={firmante.id || `${nombres}-${apellidos}`}>
                      <TableCell>{nombres}</TableCell>
                      <TableCell>{apellidos}</TableCell>
                      {!isMobile && <TableCell>{documento}</TableCell>}
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenEditar(firmante)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(firmante)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {formOpen && (
        <Card style={{ marginTop: '2rem' }}>
          <CardContent>
            <Box
              display="flex"
              flexDirection={isMobile ? 'column' : 'row'}
              alignItems={isMobile ? 'flex-start' : 'center'}
              justifyContent="space-between"
              marginBottom="1rem"
              gap="0.75rem"
            >
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                {editingFirmanteId ? 'Editar Co-Titular' : 'Agregar Co-Titular'}
              </Typography>
              <Button onClick={handleCancelForm} disabled={loading}>
                Cancelar
              </Button>
            </Box>
            {!isMobile ? (
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            ) : (
              <Box
                padding="0.75rem 1rem"
                borderRadius="8px"
                border="1px solid #e0e0e0"
                bgcolor="#fafafa"
              >
                <Typography variant="subtitle2" style={{ color: '#555' }}>
                  Paso {activeStep + 1} de {steps.length}
                </Typography>
                <Typography variant="subtitle1" style={{ fontWeight: 600, marginTop: '0.25rem' }}>
                  {steps[activeStep]}
                </Typography>
              </Box>
            )}
            <Box marginTop="2rem">{renderStepContent(activeStep)}</Box>
            {formError && (
              <Box marginTop="1.5rem">
                <Typography variant="body2" style={{ color: '#d32f2f' }}>
                  {formError}
                </Typography>
              </Box>
            )}
            <Box
              marginTop="2rem"
              display="flex"
              justifyContent={isMobile ? 'center' : 'flex-end'}
              gap="1rem"
              flexWrap="wrap"
            >
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0 || loading || saving}
              >
                Volver
              </Button>
              {activeStep < steps.length - 1 ? (
                <Button
                  variant="outlined"
                  onClick={handleNext}
                  disabled={loading || saving}
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  style={{ backgroundColor: 'var(--main-green)', color: '#fff' }}
                  disabled={loading || saving}
                >
                  {saving ? <CircularProgress size={20} color="inherit" /> : 'Guardar Co-Titular'}
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      )}
      {firmantes.length > 0 && (
        <Box marginTop="2.5rem" display="flex" justifyContent="center">
          <Button
            variant="contained"
            onClick={() => history.push('/apertura/fin')}
            color="primary"
            style={{ backgroundColor: 'var(--light-blue)', minWidth: '180px', color: '#fff', alignSelf: isMobile ? 'stretch' : 'auto' }}
          >
            Finalizar
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default CoTitularesPage;

