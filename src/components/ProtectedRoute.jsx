import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { authenticationService } from '../services';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        // Verificar si hay token y si la sesión no ha expirado
        const token = localStorage.getItem('token');
        const isValidSession = authenticationService.checkSessionValidity();
        
        if (token && isValidSession) {
          return <Component {...props} />;
        } else {
          // Redirigir al login si no está autenticado o la sesión expiró
          return <Redirect to="/" />;
        }
      }}
    />
  );
};

export default ProtectedRoute;
