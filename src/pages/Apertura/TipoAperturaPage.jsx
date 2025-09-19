import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import { authenticationService } from '../../services';

const TipoAperturaPage = () => {
  let history = useHistory();

  useEffect(() => {
    // Verificar si la sesión es válida
    if (!authenticationService.checkSessionValidity()) {
      history.push('/');
      return;
    }
  }, [history]);

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center"
        minHeight="60vh"
        textAlign="center"
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          style={{ 
            color: 'var(--main-green)',
            fontWeight: 'bold',
            marginBottom: '2rem'
          }}
        >
          Seleccione el tipo de apertura que desea hacer
        </Typography>
        
        {/* Aquí se agregarán las opciones de tipo de apertura */}
        <Typography 
          variant="body1" 
          color="textSecondary"
          style={{ marginTop: '2rem' }}
        >
          Las opciones de apertura se mostrarán próximamente...
        </Typography>
      </Box>
    </Container>
  );
};

export default TipoAperturaPage;