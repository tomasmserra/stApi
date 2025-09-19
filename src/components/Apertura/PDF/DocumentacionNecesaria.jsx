import React from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box, Button } from '@material-ui/core'
import img from '../../../images/pdf_back_logo.png'

const useStyles = makeStyles({
    table: {
      minWidth: 650,
      "& .MuiTableCell-root": {
        border: "2px solid #CCC"
      }
    },
    dealBgLogo: {
        backgroundImage: `url(${img})`,
        backgroundPosition: 'center', 
        backgroundSize: 'cover', 
        backgroundRepeat: 'no-repeat',
    }
  });


const DocumentacionNecesaria = () => {
    const classes = useStyles();

    return (
        <>
                <Col className={classes.dealBgLogo}>
                    <Typography className="mt-1 mb-4"><b>APERTURA DE CUENTA DE PERSONAS FÍSICAS - Documentación necesaria Agosto 2020</b></Typography>
                    

                            <p>1. Cada titular deberá exhibir DNI / Pasaporte original a un funcionario del área de Compliance. Se requerirá para el legajo una copia del mismo con la leyenda “es copia fiel del original” y con la firma del titular. Si no pudiera ser exhibido el documento original, será necesaria una copia del mismo certificada por Escribano. (*)</p>
                            <p>2. Si en el documento de identidad no constare el domicilio actual, deberá presentar una constancia que lo acredite (copia de un servicio por ejemplo).</p>
                            <p>3. Ficha de apertura de cuenta, en la cual se deberán completar todos los datos personales. Cada titular deberá registrar su firma a la vista de un funcionario del área de Compliance. Si no pudiera concurrir a nuestras oficinas, la firma deberá estar certificada por Banco o Escribano. (*)</p>
                            <p>4. Condiciones Generales para la operatoria, firmado por los titulares. Cada titular deberá registrar su firma a la vista de un funcionario del área de Compliance. Si no pudiera concurrir a nuestras oficinas, la firma deberá estar certificada por Banco o Escribano. (*)</p>
                            <p>5. Perfil de Riesgo del Inversor del comitente completo y firmado por los titulares. Cada titular deberá registrar su firma a la vista de un funcionario del área de Compliance. Si no pudiera concurrir a nuestras oficinas, la firma deberá estar certificada por Banco o Escribano. (*)</p>
                            <p>6. Autorización General para operar a favor de DEAL S.A., firmada por los titulares.</p>
                            <p>7. Declaración Jurada sobre la condición de Persona Expuesta Políticamente respecto de cada firmante.</p>
                            <p>8. Declaración FATCA, completa y firmada por los titulares.</p>
                            <p>9. Formulario Sujeto Obligado, completo y firmado por los titulares.</p>
                            <p>10. Tabla de aranceles, comisiones y derechos de mercado, firmada por los titulares.</p>
                            <p>11. DDJJ Licitud y Origen de Fondos, completo y firmado por los titulares.</p>
                            <p>12. Formulario de Instrucciones permanentes, completo y firmado por los titulares – Adjuntar CBU y CUIT de la cuenta emitido por el Banco.</p>
                            <p>13. FCI – Constancia entrega Reglamentos de Gestión</p>
                            <p>14. DDJJ Inversor Calificado</p>
                            <p>15. Documentación que acredite la situación patrimonial, económica, financiera, tributaria de cada titular, a efectos del armado del perfil patrimonial. A modo de ejemplos: últimos recibos de sueldo, certificación contable, escritura de venta, sentencia judicial, etc.</p>
                            <p>16. En caso de personas extranjeras deberá presentar la constancia del número de identificación tributaria del país de origen o Clave de Identificación (CDI), según corresponda</p>

                    <Box mt={3} mb={3}>
                        <b>(*)</b> Si el Escribano certificante fuera del interior del país o gran Buenos Aires, la certificación deberá estar legalizada por el Colegio de Escribanos de la jurisdicción que corresponda. En el caso de certificaciones extranjeras, deberán estar legalizadas con el sello o apostilla Consular. 
                    </Box>
                </Col>
        </>
    )
}

DocumentacionNecesaria.propTypes = {

}

export default DocumentacionNecesaria
