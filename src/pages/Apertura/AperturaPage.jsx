import React, { useEffect, useState } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import { Typography, CircularProgress } from '@material-ui/core';
import { Paso1, Paso2, Paso3, Paso4, Paso5, Paso6 } from './../../components/Apertura'
import { aperturaService } from './../../services'
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom'

function getSteps() {
  return ['Datos titular', 'Co-titulares', 'Datos bancarios', 'Declaración de ingresos', 'Test del inversor', 'Confirmación' ];
}

function getStepContent(step, handleNext, stepContent) {
  switch (step) { 
    case 1:
      return <Paso1 handleNext={handleNext} stepContent={stepContent}></Paso1>;
    case 2:
      return <Paso2 handleNext={handleNext} stepContent={stepContent}></Paso2>;
    case 3:
      return <Paso3 handleNext={handleNext} stepContent={stepContent}></Paso3>;
    case 4:
      return <Paso4 handleNext={handleNext} stepContent={stepContent}></Paso4>;
    case 5:
      return <Paso5 handleNext={handleNext} stepContent={stepContent}></Paso5>;
    case 6:
      return <Paso6 handleNext={handleNext} stepContent={stepContent}></Paso6>;
    default:
      return <CircularProgress />;
  }
}

export default function Apertura() {
  let history = useHistory();
  const [activeStep, setActiveStep] = useState(0);
  const [stepContent, setStepContent] = useState({})

  const irAlUltimoPaso = () => {
    aperturaService.obtenerUltimoPasoCompletado()
    .then(
            response => {
              
              if (!response.exitosa)
                history.push('/login')
              
              setActiveStep(response.numero + 1) //devuelve el último completado, debería ir al siguiente
                
            },
            error => {
                console.log(error)
            }
        );
  }

  useEffect(() => { irAlUltimoPaso() }, []);

  const steps = getSteps();

  const handleNext = (controlarUltimoPaso = true) => { 

    if(controlarUltimoPaso)
      irAlUltimoPaso()
    else
      setActiveStep(activeStep + 1)
  
  };

  const handleBack = () => {
    const pasoAnterior = activeStep - 1
    
    aperturaService.obtenerPaso(pasoAnterior)
    .then(
            response => {

              if (!response.exitosa){
                history.push('/login')
              }
              setActiveStep(response.numero)
              setStepContent(response.paso)
            },
            error => {
                console.log(error)
            }
        );
    setActiveStep(pasoAnterior);
  };


  return (
    <>
    {/* <Typography variant="h2">{activeStep}</Typography> */}
        <Stepper activeStep={activeStep-1}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      <div>
        {
          activeStep === steps.length ? (
            <div>
              <Typography className="mt-4 mb-4">
                Finalizaste el proceso de apertura de cuenta!
              </Typography>
              <Typography className="mt-4 mb-4">
                Para acceder al PDF hacé click en el siguiente <Link to="/pdf" color="primary">Link</Link>
              </Typography>
              
            </div>
          ) 
        : 
          (
            
              
            <div>
              {/* <Typography variant="h6" className="mt-4 mb-4">En pocos pasos podras finalizar el formulario de apertura de cuenta. Por favor completa los siguientes campos.</Typography>   */}
              <hr></hr>
              { getStepContent(activeStep, handleNext, stepContent) }
              <hr></hr>
              <div className="text-right">
                <Button disabled={activeStep === 0} onClick={handleBack} variant="contained">
                  Atrás
                </Button>

                <Button className="btn-deal-success ml-3"
                  form='form-apertura' type="submit">
                  {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                </Button>
              </div>
            </div>
          )
        }
      </div>
    </>
  );
}