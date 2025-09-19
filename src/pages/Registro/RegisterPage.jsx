import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import RegisterBox from '../../components/RegisterBox'
import { useHistory } from "react-router-dom";

const RegisterPage = props => {
  let history = useHistory();
  
  useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        // Verificar si la sesión es válida antes de redirigir
        const { authenticationService } = require('../../services');
        if (authenticationService.checkSessionValidity()) {
          history.push('/tipo-apertura');
        }
      }
    }, [history])

    return (
      <>
        <RegisterBox></RegisterBox>
      </>
    )
}

RegisterPage.propTypes = {

}

export default RegisterPage
