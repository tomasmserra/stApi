import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Box,
  Alert
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { authenticationService } from '../../../services';

const PerfilInversorPage = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [tipoPerfil, setTipoPerfil] = useState(null);

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

    cargarPerfilInversor();
  }, [history]);

  const cargarPerfilInversor = async () => {
    try {
      setLoading(true);
      const currentSolicitudId = localStorage.getItem('currentSolicitudId');
      
      console.log('Cargando perfil del inversor...');
      console.log('currentSolicitudId:', currentSolicitudId);
      
      if (currentSolicitudId) {
        const response = await authenticationService.getPerfilInversorIndividuo(currentSolicitudId);
        console.log('Respuesta del backend perfil inversor:', response);
        
        if (response && (response.status === 200 || response.ok)) {
          console.log('Perfil del inversor cargado:', response);
          setPreguntas(response.preguntas || []);
          setRespuestas(response.respuestas || []);
          setTipoPerfil(response.tipoPerfil);
        } else {
          console.log('Error en la respuesta del backend perfil inversor:', response);
        }
      } else {
        console.log('No se encontro currentSolicitudId para cargar perfil del inversor');
      }
    } catch (err) {
      console.error('Error cargando perfil del inversor:', err);
      setError('Error al cargar el perfil del inversor');
    } finally {
      setLoading(false);
    }
  };

  const handleRespuestaChange = (preguntaId, opcionId) => {
    console.log('handleRespuestaChange called:', { preguntaId, opcionId });
    const nuevaRespuesta = { preguntaId, opcionId };
    
    setRespuestas(prevRespuestas => {
      // Remover respuesta anterior para esta pregunta si existe
      const respuestasActualizadas = prevRespuestas.filter(resp => resp.preguntaId !== preguntaId);
      // Agregar la nueva respuesta
      respuestasActualizadas.push(nuevaRespuesta);
      console.log('Respuestas actualizadas:', respuestasActualizadas);
      return respuestasActualizadas;
    });
  };

  const getRespuestaSeleccionada = (preguntaId) => {
    const respuesta = respuestas.find(resp => resp.preguntaId === preguntaId);
    const valor = respuesta ? respuesta.opcionId.toString() : '';
    console.log('getRespuestaSeleccionada:', { preguntaId, respuesta, valor });
    return valor;
  };

  const calcularTipoPerfil = () => {
    // Primero verificar si hay alguna opción determinante seleccionada
    for (const respuesta of respuestas) {
      const pregunta = preguntas.find(p => p.id === respuesta.preguntaId);
      if (pregunta) {
        const opcion = pregunta.opciones.find(o => o.id === respuesta.opcionId);
        if (opcion && opcion.determinante && opcion.tipoPerfil) {
          return opcion.tipoPerfil;
        }
      }
    }

    // Si no hay opción determinante, calcular por puntaje
    let puntajeTotal = 0;
    for (const respuesta of respuestas) {
      const pregunta = preguntas.find(p => p.id === respuesta.preguntaId);
      if (pregunta) {
        const opcion = pregunta.opciones.find(o => o.id === respuesta.opcionId);
        if (opcion) {
          puntajeTotal += opcion.puntaje;
        }
      }
    }

    // Determinar tipo de perfil por puntaje
    if (puntajeTotal >= 1 && puntajeTotal < 37) {
      return 'CONSERVADOR';
    } else if (puntajeTotal >= 37 && puntajeTotal < 55) {
      return 'MODERADO';
    } else if (puntajeTotal >= 55 && puntajeTotal < 90) {
      return 'AGRESIVO';
    }

    return null;
  };

  const getTipoPerfilColor = (tipo) => {
    switch (tipo) {
      case 'CONSERVADOR':
        return '#4caf50'; // Verde
      case 'MODERADO':
        return '#ff9800'; // Naranja
      case 'AGRESIVO':
        return '#f44336'; // Rojo
      default:
        return '#666';
    }
  };

  const getTipoPerfilDescripcion = (tipo) => {
    switch (tipo) {
      case 'CONSERVADOR':
        return 'Perfil Conservador: Prefiere inversiones de bajo riesgo con preservación del capital.';
      case 'MODERADO':
        return 'Perfil Moderado: Balance entre riesgo y rentabilidad, acepta variaciones moderadas.';
      case 'AGRESIVO':
        return 'Perfil Agresivo: Busca altas rentabilidades asumiendo mayores riesgos.';
      default:
        return '';
    }
  };

  const isFormValid = () => {
    // Verificar que todas las preguntas habilitadas tengan respuesta
    const preguntasHabilitadas = preguntas.filter(pregunta => pregunta.habilitada);
    return preguntasHabilitadas.every(pregunta => 
      respuestas.some(respuesta => respuesta.preguntaId === pregunta.id)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isFormValid()) {
      setError('Por favor responda todas las preguntas para continuar.');
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

      const tipoPerfilCalculado = calcularTipoPerfil();
      
      const datosParaGuardar = {
        solicitudId: parseInt(solicitudId),
        respuestas: respuestas,
        tipoPerfil: tipoPerfilCalculado
      };

      console.log('Perfil del inversor a guardar:', datosParaGuardar);
      
      const response = await authenticationService.savePerfilInversorIndividuo(datosParaGuardar);
      
      if (response && (response.status === 200 || response.ok)) {
        console.log('Perfil del inversor guardado exitosamente:', response);
        history.push('/apertura/individuo/declaracion-ingresos');
      } else {
        console.error('Error al guardar perfil del inversor:', response);
        setError('Error al guardar el perfil del inversor. Intente nuevamente.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al guardar perfil del inversor:', error);
      setError('Error de conexion al guardar el perfil del inversor. Intente nuevamente.');
      setLoading(false);
    }
  };

  const handleVolver = () => {
    history.push('/apertura/individuo/declaraciones');
  };

  if (loading && preguntas.length === 0) {
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
          Perfil del Inversor
        </Typography>

        <Typography variant="body1" style={{ marginBottom: '2rem', maxWidth: '600px' }}>
          Para poder ofrecerte las mejores opciones de inversión, necesitamos conocer tu perfil como inversor. 
          Por favor, responde las siguientes preguntas:
        </Typography>

        <Card style={{ width: '100%', maxWidth: '800px' }}>
          <CardContent style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
              {preguntas
                .filter(pregunta => pregunta.habilitada)
                .map((pregunta, index) => (
                  <Card 
                    key={pregunta.id} 
                    style={{ 
                      marginBottom: '2rem', 
                      backgroundColor: '#f8f9fa', 
                      border: '1px solid #e9ecef' 
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" style={{ 
                        marginBottom: '1.5rem', 
                        color: 'var(--light-blue)', 
                        fontWeight: 'bold' 
                      }}>
                        {pregunta.pregunta}
                      </Typography>
                      
                      <Box display="flex" flexDirection="column" gap={1} alignItems="stretch">
                        {pregunta.opciones.map((opcion) => (
                          <Button
                            key={opcion.id}
                            variant={getRespuestaSeleccionada(pregunta.id) === opcion.id.toString() ? "contained" : "outlined"}
                            onClick={() => handleRespuestaChange(pregunta.id, opcion.id)}
                            style={{
                              margin: '4px 0',
                              width: '100%',
                              padding: '12px 16px',
                              fontSize: '14px',
                              backgroundColor: getRespuestaSeleccionada(pregunta.id) === opcion.id.toString() ? 'var(--main-green)' : 'transparent',
                              color: getRespuestaSeleccionada(pregunta.id) === opcion.id.toString() ? 'white' : 'black',
                              borderColor: 'var(--main-green)',
                              textTransform: 'none',
                              whiteSpace: 'normal',
                              height: 'auto',
                              minHeight: '48px',
                              justifyContent: 'flex-start',
                              textAlign: 'left'
                            }}
                          >
                            {opcion.valor}
                          </Button>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                ))}

              {/* Calificación del Inversor */}
              {isFormValid() && calcularTipoPerfil() && (
                <Card style={{ 
                  marginBottom: '2rem', 
                  backgroundColor: '#e8f5e8', 
                  border: '2px solid ' + getTipoPerfilColor(calcularTipoPerfil()),
                  borderRadius: '8px'
                }}>
                  <CardContent style={{ textAlign: 'center', padding: '2rem' }}>
                    <Typography variant="h5" style={{ 
                      color: getTipoPerfilColor(calcularTipoPerfil()),
                      fontWeight: 'bold',
                      marginBottom: '1rem'
                    }}>
                      Calificación del Inversor
                    </Typography>
                    
                    <Typography variant="h4" style={{ 
                      color: getTipoPerfilColor(calcularTipoPerfil()),
                      fontWeight: 'bold',
                      marginBottom: '1rem'
                    }}>
                      {calcularTipoPerfil()}
                    </Typography>
                    
                    <Typography variant="body1" style={{ 
                      color: '#666',
                      maxWidth: '500px',
                      margin: '0 auto'
                    }}>
                      {getTipoPerfilDescripcion(calcularTipoPerfil())}
                    </Typography>
                  </CardContent>
                </Card>
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

export default PerfilInversorPage;
