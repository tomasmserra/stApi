import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Typography
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { authenticationService } from '../../../services';
import terminosPdf from '../../../pdf/TerminosYCondiciones.pdf';
import gestionFondosPdf from '../../../pdf/GestionFondos.pdf';
import comisionesPdf from '../../../pdf/Comisiones.pdf';

const TerminosCondicionesPage = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    aceptaTerminosCondiciones: false,
    aceptaReglamentoGestionFondos: false,
    aceptaComisiones: false
  });

  useEffect(() => {
    const checkSession = () => {
      const currentUser = authenticationService.currentUserValue;
      if (!currentUser || !authenticationService.checkSessionValidity()) {
        history.push('/');
        return;
      }
    };

    checkSession();
    cargarTerminosCondiciones();
  }, [history]);

  const cargarTerminosCondiciones = async () => {
    try {
      setLoading(true);
      setError('');
      const currentSolicitudId = localStorage.getItem('currentSolicitudId');

      if (!currentSolicitudId) {
        history.push('/tipo-apertura');
        return;
      }

      const response = await authenticationService.getTerminosCondicionesIndividuo(currentSolicitudId);
      console.log('Respuesta backend términos y condiciones:', response);

      if (response && (response.status === 200 || response.ok)) {
        setFormData({
          aceptaTerminosCondiciones: !!response.aceptaTerminosCondiciones,
          aceptaReglamentoGestionFondos: !!response.aceptaReglamentoGestionFondos,
          aceptaComisiones: !!response.aceptaComisiones
        });
      } else {
        console.log('Respuesta inesperada términos y condiciones:', response);
      }
    } catch (err) {
      console.error('Error cargando términos y condiciones:', err);
      setError('Error al cargar los datos de términos y condiciones');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
    setSuccessMessage('');
  };

  const isFormValid = () =>
    formData.aceptaTerminosCondiciones &&
    formData.aceptaReglamentoGestionFondos &&
    formData.aceptaComisiones;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid()) {
      setError('Debes aceptar todas las condiciones para continuar.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      const currentSolicitudId = localStorage.getItem('currentSolicitudId');
      if (!currentSolicitudId) {
        setError('No se encontró la solicitud en curso.');
        return;
      }

      const payload = {
        solicitudId: parseInt(currentSolicitudId, 10),
        aceptaTerminosCondiciones: formData.aceptaTerminosCondiciones,
        aceptaReglamentoGestionFondos: formData.aceptaReglamentoGestionFondos,
        aceptaComisiones: formData.aceptaComisiones
      };

      const response = await authenticationService.saveTerminosCondicionesIndividuo(payload);

      if (response && (response.status === 200 || response.ok)) {
        setSuccessMessage('Términos y condiciones guardados correctamente.');
      } else {
        setError('Error al guardar términos y condiciones.');
      }
    } catch (err) {
      console.error('Error guardando términos y condiciones:', err);
      setError('Error al guardar términos y condiciones.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          style={{ color: 'var(--light-blue)', fontWeight: 'bold', marginBottom: '1rem' }}
        >
          Términos y Condiciones
        </Typography>

        {error && (
          <Card
            style={{
              marginBottom: '1rem',
              width: '100%',
              maxWidth: '600px',
              backgroundColor: '#ffebee',
              border: '1px solid #f44336'
            }}
          >
            <CardContent style={{ padding: '1rem' }}>
              <Typography variant="body2" style={{ color: '#d32f2f' }}>
                {error}
              </Typography>
            </CardContent>
          </Card>
        )}

        {successMessage && (
          <Card
            style={{
              marginBottom: '1rem',
              width: '100%',
              maxWidth: '600px',
              backgroundColor: '#e8f5e9',
              border: '1px solid #4caf50'
            }}
          >
            <CardContent style={{ padding: '1rem' }}>
              <Typography variant="body2" style={{ color: '#2e7d32' }}>
                {successMessage}
              </Typography>
            </CardContent>
          </Card>
        )}

        <Card style={{ width: '100%', maxWidth: '800px' }}>
          <CardContent style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                style={{ gap: '1rem', textAlign: 'left' }}
              >
                <Box width="100%" marginBottom="0.5rem">
                  <Box
                    component="iframe"
                    src={terminosPdf}
                    title="Términos y Condiciones"
                    style={{ width: '100%', height: '15vh', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={formData.aceptaTerminosCondiciones}
                      onChange={() => handleChange('aceptaTerminosCondiciones')}
                    />
                  }
                  label={
                    <Typography variant="body1" style={{ lineHeight: 1.5 }}>
                      He leído y acepto los{' '}
                      <a
                        href="/apertura/documento/terminos-condiciones"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--main-green)', fontWeight: 600 }}
                      >
                        términos y condiciones
                      </a>{' '}
                      para la apertura de cuenta en ST SECURITIES S.A.U. y para operar online en los mercados autorizados
                      por la Comisión Nacional de Valores.
                    </Typography>
                  }
                />

                <Box width="100%" marginBottom="0.5rem">
                  <Box
                    component="iframe"
                    src={gestionFondosPdf}
                    title="Reglamento de Gestión de Fondos"
                    style={{ width: '100%', height: '15vh', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={formData.aceptaReglamentoGestionFondos}
                      onChange={() => handleChange('aceptaReglamentoGestionFondos')}
                    />
                  }
                  label={
                    <Typography variant="body1" style={{ lineHeight: 1.5 }}>
                      He leído y acepto el{' '}
                      <a
                        href="/apertura/documento/reglamento-gestion-fondos"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--main-green)', fontWeight: 600 }}
                      >
                        reglamento de gestión de fondos
                      </a>
                      .
                    </Typography>
                  }
                />

                <Box width="100%" marginBottom="0.5rem">
                  <Box
                    component="iframe"
                    src={comisionesPdf}
                    title="Comisiones y Derechos de Mercado"
                    style={{ width: '100%', height: '15vh', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={formData.aceptaComisiones}
                      onChange={() => handleChange('aceptaComisiones')}
                    />
                  }
                  label={
                    <Typography variant="body1" style={{ lineHeight: 1.5 }}>
                      He leído y acepto las{' '}
                      <a
                        href="/apertura/documento/comisiones-derechos-mercado"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--main-green)', fontWeight: 600 }}
                      >
                        comisiones y derechos de mercado
                      </a>
                      .
                    </Typography>
                  }
                />
              </Box>

              <Box
                display="flex"
                justifyContent="center"
                className="navigation-buttons"
                style={{ marginTop: '2rem' }}
              >
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => history.push('/apertura/individuo/declaracion-ingresos')}
                  className="navigation-button"
                  disabled={loading}
                >
                  Volver
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  className="navigation-button"
                  disabled={loading || !isFormValid()}
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

export default TerminosCondicionesPage;

