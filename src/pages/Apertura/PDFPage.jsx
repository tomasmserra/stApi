import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import { Container, Col, Row } from 'react-bootstrap'
import { Typography, Divider, Box, Button } from '@material-ui/core'
import TablaDenominacion from '../../components/Apertura/PDF/TablaDenominacion';
import TablaPersona from '../../components/Apertura/PDF/TablaTitular';
import TablaNombreCuit from '../../components/Apertura/PDF/TablaNombreCuit';
import CajaFirma from '../../components/Apertura/PDF/CajaFirma'
import PDFHeader from '../../components/Apertura/PDF/PDFHeader'
import { aperturaService } from '../../services'
import PerfilDelInversor from '../../components/Apertura/PDF/PerfilDelInversor';
import DocumentacionNecesaria from '../../components/Apertura/PDF/DocumentacionNecesaria';
import img from '../../images/pdf_back_logo.png'
import ReactToPrint from "react-to-print";
import DeclaracionJurada from '../../components/Apertura/PDF/DeclaracionJurada';

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
    },
    hoja1: {
        display: 'none'
    }
  });


  const getPageMargins = () => {
    return `@page { margin: 80px 30px 80px 30px !important; }`;
  };

const PDFPage = props => {
    const classes = useStyles();
    let componentRef = null
    
    const [personas, setPersonas] = useState([])
    const [perfilDeRiesgo, setPerfilDeRiesgo] = useState([])
    const [cuentas, setCuentas] = useState([])

    useEffect(() => {
            
            aperturaService.obtenerPedidoIndividuo()
            .then(
                response => {
                    debugger
                    const { personas } = response
                    setPersonas(personas)
                    //setPerfilDeRiesgo(personas.find(x => Object.keys(x.perfilDeRiesgo).length > 0).perfilDeRiesgo)
                    
                    const titular = personas.find(x => x.tipo === "TITULAR")
                    setPerfilDeRiesgo(titular.perfilDeRiesgo)
                    setCuentas(titular.cuentas)
                }
            );

        
    }, [])
    
    return (
        <>
            <Container>
                <Row className="text-center mb-3">
                    <Col>
                        <ReactToPrint
                            trigger={() => <button>Imprimir PDF</button>}
                            content={() => componentRef}
                            />
                    </Col>
                </Row> 
            </Container>
            <Container > 
                {/* style={{"display":"none"}} */}
            <Container ref={(el) => (componentRef = el)}>
            <style>{getPageMargins()}</style>

                <Row>
                    <PDFHeader />
                </Row>

                <Row className={classes.hoja1}>
                    <DocumentacionNecesaria />
                </Row>

                <Row className="hoja2">
                    <Col className="mt-4">
                        <TablaDenominacion />
                    </Col>
                </Row>
                
                <Row className="pb-5 hoja2">
                    <Col className={classes.dealBgLogo}>
                        {
                            personas.length !== 0 ? personas.map(persona => {
                                return <TablaPersona persona={persona}/>
                            })
                            :
                            "No hay nada"
                        }
                        
                    </Col>
                </Row>

                <Row className="mb-5">
                    <CajaFirma />
                </Row>

                
                <Divider className="mb-3 mt-3" />
                
                
                <Row className="pageBreak">
                    <Col className="text-center mt-5 mb-4">
                        <Typography><b>CONDICIONES GENERALES SOBRE OPERATORIA</b></Typography>
                    </Col>
                </Row>
                <Row>
                    <Col className={classes.dealBgLogo} xs={12}>
                        <p>El/los firmante/s, en adelante el “Comitente” solicita/n a Deal S.A. la apertura de una Cuenta Comitente que operará bajo las siguientes condiciones:</p> 
                        <p>En su actuación general Deal S.A. deberá:</p> 
                        <p>a) Actuar con honestidad, imparcialidad, profesionalidad, diligencia y lealtad en el mejor interés de los Comitentes.</p> 
                        <p>b) Tener un conocimiento de los Comitentes que les permita evaluar su experiencia y objetivos de inversión, y adecuar sus servicios a tales fines, arbitrando los medios y procedimientos necesarios a estos efectos.</p> 
                        <p>c) Ejecutar con celeridad las órdenes recibidas, en los términos en que ellas fueron impartidas.</p> 
                        <p>d) Otorgar absoluta prioridad al interés de sus Comitentes en la compra y venta de valores negociables. e) Evitar toda práctica que pueda inducir a engaño o de alguna forma viciar el consentimiento de sus contrapartes u otros participantes en el mercado.</p> 
                        <p>f) Abstenerse de multiplicar transacciones en forma innecesaria y sin beneficio para ellos, y/o de incurrir en conflicto de intereses.</p> 
                        <p>g) En caso de existir conflicto de intereses entre distintos Comitentes, deberán evitar privilegiar a cualquiera de ellos en particular.</p> 
                        <p>h) Abstenerse de anteponer la compra o venta de valores negociables para su cartera propia, cuando tengan pendientes de concertación órdenes de Comitentes, de la misma naturaleza, tipo, condiciones y especies.</p> 
                        <p>i) Deberá contar con el Perfil de Riesgo definido para el Inversor, el que contendrá los siguientes aspectos: la experiencia del Comitente en inversiones dentro del mercado de capitales, el grado de conocimiento del Comitente de los instrumentos disponibles en el mercado de capitales y del instrumento concreto ofrecido o solicitado, el objetivo de su inversión, la situación financiera del inversor, el horizonte de inversión previsto, el porcentaje de sus ahorros destinado a estas inversiones, el nivel de sus ahorros que el Comitente está dispuesto a arriesgar, y toda otra circunstancia relevante a efectos de evaluar si la inversión a efectuar es adecuada para el Comitente.</p> 
                        <p>j) Tener a disposición de sus Comitentes toda información que, siendo de su conocimiento y no encontrándose amparada por el deber de reserva, pudiera tener influencia directa y objetiva en la toma de decisiones. DEL COMITENTE: Por su parte el Comitente se obliga a:</p> 
                        <p>1) Comunicar a Deal S.A. cualquier cambio de sus datos personales y/o societarios tales como: domicilio, teléfonos, correo electrónico, datos de contacto e información personal, estados de información financiera, actas de de designación de autoridades y aceptación de cargos, poderes brindada en ocasión de la apertura de esta cuenta, y demás datos de relevancia. </p> 
                        <p>2) Comunicar a Deal S.A. cualquier cambio de datos relacionados a Cuentas Bancarias de su Titularidad, fundamentalmente a las informadas para transferencia de fondos. </p> 
                        <p>3) Comunicar a Deal S.A. cualquier cambio sustancial en su situación patrimonial o financiera que afecte o pueda afectar su Perfil de Riesgo de Inversor vigente. </p> 
                        <p>4) Informar sobre cualquier modificación de su situación tributaria que pueda tener efectos sobre los fondos o activos mantenidos en esta cuenta. </p> 
                        <p>5) Informar dentro de las 48 hs de ocurrida sobre cualquier modificación relacionada a su condición de Persona Expuesta Políticamente, ya sea por si o por sus allegados en línea con la normativa vigente en la materia. </p> 
                        <p>6) Proveer, a requerimiento de Deal S.A., toda información/documentación fehaciente que permita identificar y justificar el origen de los fondos en el caso que fuera necesario. </p> 
                        <p>7) Poner a disposición de Deal S.A. toda información que a esta le fuera requerida en relación a su persona por Autoridad Competente. </p> 
                        <p>8) A suscribir la documentación referida a las operaciones que Deal S.A. haya realizado por su cuenta y orden en línea con las instrucciones impartidas y/o por la Autorización General otorgada a Deal S.A. dentro de los límites y características adoptadas y aceptadas en el Perfil de Comitente. </p> 
                    </Col>
                    <Col className={classes.dealBgLogo} xs={12}>
                        <p>9) Comunicar a Deal S.A. cualquier circunstancia que implique la necesidad de modificar o adaptar el Perfil de Comitente o bien la propia decisión de modificar el mismo aun sin justificar la misma. </p> 
                        <p>NORMATIVA: La normativa aplicable se encuentra contenida en las siguientes Normas principales: Ley 26.831 – Mercado de Capitales – 27/12/2012 / Decreto 1.023/2013 – 26/07/2013 / Resolución General 622/2013 – C.N.V. – 05/09/2013 / Nuevo Texto de las Normas C.N.V. (N.T. 2013). Las relaciones entre Deal S.A. y el comitente, se regirán a todos sus efectos y consecuencias por las reglamentaciones vigentes y las a dictarse en el futuro, emanadas por Comisión Nacional de Valores, los Mercados en que se efectúen las operaciones, Caja de Valores S.A. o entidad depositaria autorizada, y por los usos, costumbres y prácticas de mercado que tengan vigencia a la época y lugar de ejecución. Queda entendido que si en uso de sus facultades reglamentarias, cualquiera de los entes y/o mercados mencionados en el apartado anterior, dispusiere medidas de cumplimiento obligatorio para Deal S.A., que pudieren afectar intereses patrimoniales del comitente, este acepta someterse a tales medidas, renunciando a accionar contra Deal S.A. </p> 
                        <p>ORDENES: El comitente otorga a Deal S.A., mandato suficiente para, por su cuenta y orden y en base a las instrucciones que este emita, realizar operaciones con Valores Negociables públicos y privados, fondos, derivados y toda clase de valores negociables en moneda argentina o extranjera, conforme a las reglamentaciones vigentes. Las órdenes o instrucciones que emita el comitente a Deal S.A. podrán ser cursadas exclusivamente a través de alguno de los siguientes medios: en forma verbal, escrita, por teléfono, por fax, por e-mail o cualquier otra modalidad propuesta por Deal S.A. y autorizada por la CNV. El comitente podrá instruir a Deal S.A. para que realice operaciones en el exterior, conforme la reglamentación vigente. Las Operaciones que implican débitos (compras, titulares de opciones, suscripciones, prorrateo, cauciones y/o pases colocadores, etc.) serán ejecutadas por Deal S.A. siempre que existan en la cuenta del comitente los fondos necesarios para abonarlas. Las operaciones que implican créditos (ventas, lanzamiento de opciones, cauciones y/o pases tomadores, rentas, amortizaciones, etc.) serán ejecutadas por Deal S.A. siempre que a la fecha correspondiente los Valores Negociables se encuentren depositados en un Agente de Deposito Colectivo autorizado si así correspondiere. En su defecto, y en caso que el comitente no hubiese entregado la especie negociada, Deal S.A. queda facultada para recomprar los títulos faltantes, imputando en la cuenta corriente la diferencia de precios, gastos y comisiones correspondientes. Deal S.A. no se responsabiliza por la inversión de los saldos acreedores en cuenta, los cuales no devengarán intereses ni ajustes por desvalorización monetaria de ningún tipo. El comitente reconoce y expresa que Deal S.A. ejecutará las órdenes recibidas durante los días y horas habilitados para el funcionamiento de los mercados locales y del exterior. El comitente acepta que Deal S.A. ejecutará la orden de operación dentro de los parámetros que le indique expresamente, o en su defecto dentro de las condiciones de plaza al momento de la efectiva ejecución. Deal S.A. se encuentra autorizado para depositar los títulos del comitente en un Agente de Deposito Colectivo regulado por la Ley 26.831 y/o en la cuenta global de títulos que posea con corresponsales en el exterior cuando así corresponda por operaciones efectuadas en otras plazas. El comitente autoriza a Deal S.A. para aplicar y debitar en su cuenta de gestión, todos los cargos, comisiones y gastos que se generaren en virtud de las operaciones concertadas.</p> 
                        <p>AUTORIZACION GENERAL: El comitente tiene la facultad de otorgar voluntariamente por escrito y/o revocar por el mismo medio una Autorización de Carácter General a Deal S.A. para que actúe en su nombre. Ante la ausencia de aquella autorización otorgada por el Comitente a Deal S.A. se presumirá -salvo prueba en contrario- que las operaciones realizadas por el Agente a nombre del Comitente, no contaron con el consentimiento del Comitente. Dicha autorización en caso de ser ejercida no asegura rendimientos de ningún tipo ni cuantía y sus inversiones están sujetas a las fluctuaciones de precios del mercado. La aceptación sin reservas por parte del Comitente de la liquidación correspondiente a una operación que no contó con su autorización previa, no podrá ser invocada por Deal S.A. como prueba de la conformidad del Comitente a la operación efectuada sin su previa autorización. </p> 
                        <p>AUTORIZACION ESPECIAL: Los saldos líquidos de los clientes disponibles al final del día solo podrán ser invertidos en los activos que indiquen y autoricen específicamente, quedando en todos los casos las rentas generadas en tales inversiones a favor de cada cliente beneficiario. Asimismo los fondos serán girados a su solicitud a las cuentas bancarias informadas. Asimismo, Informo expresamente que los fondos originados en entregas de mi parte y aquellos que provengan de la liquidación de operaciones, como así también de acreencias, solo se podrán reinvertir a mi solicitud y en las condiciones que ordene por cualquier medio de los habilitados por CNV.</p>
                        <p>PROCEDIMIENTO PARA EL CIERRE DE LA CUENTA. El comitente y/o Deal S.A., podrán dar por terminado el acuerdo comercial que los une, con la simple manifestación en ese sentido, que deberá ser notificada en el domicilio fijado por la contraparte. Deal S.A. tendrá el derecho a proceder al cierre de la cuenta comitente notificando en forma fehaciente en el domicilio constituido con una antelación no menor a 30 (treinta) días, por incumplimiento de las obligaciones del comitente, detalladas en el presente convenio. El cliente podrá proceder a solicitar el cierre de la cuenta comitente notificando en forma fehaciente a Deal S.A. en cualquier momento de la relación y sin invocar causa alguna.</p>
                        <p>GARANTIAS: La regulación vigente establece que los Mercados deberán constituir un Fondo de Garantía que podrá organizarse bajo la figura fiduciaria o cualquier otra modalidad que resulte aprobada por la Comisión Nacional de Valores (CNV), destinado a hacer frente a los compromisos no cumplidos por los Agentes miembros, originados en operaciones garantizadas con el CINCUENTA POR CIENTO (50%) como mínimo de las utilidades anuales líquidas y realizadas. La CNV podrá establecer un valor máximo cuando el monto total acumulado en el Fondo de Garantía obligatorio alcance razonable magnitud para cumplir con los objetivos fijados por la Ley N° 26.831. En caso que los Mercados utilicen los servicios de una Cámara Compensadora registrada ante la CNV, que actúe como contraparte central de las operaciones garantizadas registradas, ésta también deberá constituir el Fondo de Garantía impuesto a los Mercados, conforme lo dispuesto por el Decreto N° 1023/13. La utilización de una Cámara Compensadora por parte de los Mercados, no los exime de la responsabilidad solidaria con aquella, ante cualquier incumplimiento de las funciones de liquidación, compensación y contraparte central de las operaciones garantizadas registradas. El funcionamiento de estos fondos será conforme a lo reglamentado por los Mercados habilitados por la CNV y regulados por la normativa vigente.</p>
                        <p>BOLETOS: En todos los casos los Boletos por operaciones llevaran expresa aclaración de si la operación concertada se encuentra Garantizada o no por el mercado en que se realiza.</p>
                        <p>COMISIONES SOBRE LAS OPERACIONES(*):El comitente autoriza a Deal S.A. a proceder a la venta de los Valores Negociables depositados a su nombre, en caso que su cuenta corriente arrojase saldos deudores exigibles por cualquier concepto o circunstancia, hasta cubrir dichos saldos, sin necesidad de previa notificación. Deal S.A. presta el servicio de cobro de dividendos, rentas, amortizaciones, etc., de Valores Negociables, como así también suscripciones, prorrateos y en general todo tipo de servicio que hacen a la actividad. A tales fines, la publicidad que efectúe el ente emisor, se considerará aviso fehaciente para el comitente. Para las suscripciones, deberán existir precisas instrucciones y los fondos necesarios para realizar la suscripción, en caso contrario, el comitente autoriza en este acto a Deal S.A. a vender los cupones correspondientes a los derechos de suscripción y a cobrarse del producido del mismo los aranceles y gastos de tal servicio. Cuadro de Aranceles y Gastos Vigente: se adjunta por separado. El Comitente podrá s olicitar a su representante de atención al Comitente una actualización periódicamente.</p>
                        <p>(*) Las comisiones incluyen el IVA, los gastos de corresponsales locales o externos y los derechos de bolsa y mercado en caso de corresponder.</p>
                        <p>(**) Tasa Nominal Anual. Para todos los casos los Aranceles y Gastos son máximos y será facultad de Deal S.A. otorgar a favor del Comitente una bonificación sobre los mismos.</p>
                        <p>RIESGOS: El Comitente declara conocer los diferentes riesgos a que está expuesto, a saber:</p>
                        <p>a) Riesgos Legales: Certeza de las relaciones jurídicas. Normas, procedimientos y contratos.</p>
                        <p>b) Riesgos de Mercado: Consecuencia de la probabilidad de variación del precio o tasa de mercado en sentido adverso para la posición del Comitente, como consecuencia de las operaciones que ha realizado.</p>
                        <p>c) Riesgos de Crédito: Vinculados a la calidad crediticia y financiera de los emisores de los Valores Negociables.</p>
                        <p>d) Riesgos de Liquidez: Vinculados al grado de facilidad o dificultad existente para encontrar una contrapartida compradora o vendedora para un determinado valor negociable en un mercado.</p>
                        <p>e) Riesgos Operacionales: Fallas en los sistemas de los Mercados Regulados</p>
                        <p>RIESGOS DE INCUMPLIMIENTO POR PARTE DE Deal S.A.: la regulación vigente establece que para el cumplimiento de las obligaciones vinculadas con la liquidación y compensación de operaciones registradas, los Mercados, o las Cámaras Compensadoras, deberán constituir fondos de garantía bajo la estructura de fideicomisos, donde mantendrán los fondos acumulados de manera discriminada, aportados por los Agentes de Liquidación y Compensación por cuenta propia o de Comitentes. La CNV podrá autorizar otro tipo de estructura jurídica para los fondos de garantía, que deberá cumplir con similares objetivos que la del fideicomiso. Los Mercados, y las Cámaras Compensadoras, deberán constituir los siguientes fondos de garantía a estos efectos: a) Fondo de Garantía I para garantizar las operaciones a cargo de cada uno de los Agentes de liquidación y compensación, que se forma con los aportes que cada agente de liquidación y compensación realiza en concepto de integración de garantías iniciales y garantías para la cobertura de márgenes de su operatoria. También, esas garantías pueden utilizarse para cubrir la exigencia de márgenes por operatoria de sus Comitentes. b) Fondo de Garantía II para garantizar las operaciones de terceros a cargo de cada uno de los Agentes de liquidación y compensación que opera para terceros, que se forma con los aportes que cada agente de liquidación y compensación hace por cuenta y orden de sus Comitentes en concepto de integración de márgenes para la cobertura de la operatoria de éstos. c) Fondo de Garantía III para hacer frente a los incumplimientos de los agentes de liquidación y compensación de manera mancomunada, conformado por los aportes que cada agente de liquidación y compensación realiza, consistentes en un aporte mínimo y uno variable en función del riesgo generado durante los últimos SEIS (6) meses.</p>
                        <p>ADENDAS: Las firmas, autorizaciones y datos registrados en el Registro de Comitentes, se consideran válidos y vigentes hasta tanto Deal S.A. no haya recibido notificación escrita de la modificación, aún cuando las mismas hayan sido publicadas y registradas en los organismos pertinentes. Para todos los efectos que correspondan, el comitente se somete a la jurisdicción de los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires, y fija como domicilio especial al declarado en esta solicitud de apertura de cuenta.</p>
                        <p>RECLAMOS: Ante cualquier reclamo el Comitente podrá acercarse a la Comisión Nacional de Valores. Para efectuar el mismo sírvase describir la situación que desea denunciar incluyendo su Nombre Completo, DNI, Teléfono y Dirección y enviar la misma por e-mail a cnvdenuncias@cnv.gov.ar; por Teléfono al (54-11) 4329-4712; por Correo a Comisión Nacional de Valores 25 de Mayo 175, 6º Piso, 1002, Capital, República Argentina o personalmente en Comisión Nacional de Valores 25 de Mayo 175, 6º Piso de 10 a 15 Hs.</p>
                    </Col>
                </Row>

                <Row>
                    <CajaFirma />
                </Row>


                <Divider className="mb-3 mt-3" />

                <Row className="pageBreak">
                    <Col>
                        {
                            
                            perfilDeRiesgo.length !== 0 ? <PerfilDelInversor perfilDeRiesgo={perfilDeRiesgo}/>
                            :
                            "No hay nada"
                        }
                    </Col>
                </Row>
                

                <Row className="pageBreak">
                    <Col className="text-center mt-5 mb-4">
                        <Typography><b>AUTORIZACIÓN GENERAL</b></Typography>
                    </Col>
                </Row>
                <Row>
                    <Col className={classes.dealBgLogo} xs={12}>
                        <p>Por medio de la presente Autorización General el/los abajo firmantes (el “Comitente”), titular/es de las cuentas comitentes Nº ________ (la “Cuenta Comitente”) abierta en Deal S.A. (en adelante Deal), solicitan a Deal que administre, en esta cuenta, por su cuenta y orden y en su representación los activos que integran su Cartera de inversiones de conformidad con la política de inversión descripta en el Perfil de Riesgo del Inversor suscripto en oportunidad de la actualización de ficha o legajo o bien en la apertura de la cuenta comitente. La orden, podrá ejecutarse en cualquiera de sus modalidades autorizadas, por mi cuenta y orden sobre la cuenta comitente de mi propiedad registrada en esta firma y detallada en la presente. Esta autorización es extensible a cualquier tipo de operación autorizada por la regulación actual y vigente a la fecha o futuras, siempre acordes a mi Perfil de Riesgo del Inversor.</p>
                        <p>DEFINICION DE CARTERA: Se denomina Cartera al conjunto que componen los fondos o sumas de dinero, los valores negociables, ya sean públicos o privados con oferta pública autorizada por la Comisión Nacional de Valores o Valores Negociables cotizantes en el exterior y las cuotapartes de fondos comunes de inversión (en conjunto, los “Valores Negociables”) que el Comitente entregue a Deal para ser custodiados e invertidos por Deal y/o que provengan de inversiones o desinversiones efectuadas con activos existentes en la Cuenta Comitente. A la presente Autorización se le anexa una copia de las Tenencias existentes a la fecha de inicio de vigencia de la misma, los cuales quedan involucrados en ella, independientemente de futuros aportes de fondos o Valores que realice el Comitente. La composición de la Cartera variará de acuerdo con las distintas inversiones que Deal realice, por cuenta y orden del Comitente, conforme lo previsto en la presente Autorización General y a lo estipulado en el Perfil de Riesgo del Inversor. La Cartera se manejará conjuntamente con los portafolios de otros Comitentes con similar Perfil de Riesgo, por lo cual la composición del portafolio de la Cuenta Administrada del Comitente, podría ser similar a la composición de los portafolios de las cuentas administradas de otros Comitentes, aunque no necesariamente idéntica; renunciando expresamente el Comitente a reclamar exclusividad por parte de Deal o alguna prioridad o preferencia frente a otros Comitentes en la ejecución de las operaciones.</p>
                        <p>AUTORIZACIÓN: Esta Autorización se mantendrá vigente a partir de la fecha de firma de la presente Autorización General, hasta tanto Deal reciba del Comitente una notificación escrita con tres (3) días hábiles de anticipación manifestando su decisión de dejarla sin efecto. En tal caso, el Comitente deberá optar entre la liquidación de los Fondos y Valores Negociables que componen la Cartera o la permanencia de los mismos en la Cuenta Comitente, pasando la misma a ser administrada exclusivamente por el Comitente. Por su parte, el Comitente en su carácter de titular podrá ordenar efectuar una operación determinada que no encuadre con su Perfil de Riesgo del Inversor,siempre y cuando exprese dicha situación mediante comunicación fehaciente y deje constancia de su autorización a ejecutar la misma. Mientras que en caso de encomendar a Deal alguna operación acorde a su Perfil de Riesgo del Inversor, podrá hacerlo de acuerdo a lo establecido en la ficha comitente, manteniendo la total validez y vigencia de la presente autorización.</p>
                        <p>POLÍTICA DE INVERSIÓN: Deal administrará la Cartera de manera tal que su composición se adecue a la Política de Inversión y el Perfil de Riesgo del Inversor confeccionados en la apertura de la Cuenta Comitente, la experiencia del Comitente en inversiones dentro del mercado de capitales, el grado de conocimiento del Comitente de los instrumentos disponibles en el mercado de capitales y del instrumento concreto objeto de la inversión, el objetivo de su inversión, la situación financiera del inversor, el horizonte de inversión previsto, el porcentaje de sus ahorros destinado a estasinversiones, la porción de sus ahorros que el Comitente está dispuesto a arriesgar, y todaotra circunstancia relevante a efectos de evaluar si la inversión a efectuar es adecuada para el Comitente.</p>
                        <p>FACULTADESDEDEAL: El Comitente otorga a Deal expresas facultades para realizar porsu cuenta y orden y conforme a la Política de Inversión, todos los actos necesarios para el ejercicio del presente Autorización, a saber:</p>
                        <p>1) elegir el mercado en el que se deben realizar lasinversiones,</p>
                        <p>2) renovar y/o cancelar cualquiera de lasinversionesrealizadas,</p>
                        <p>3) compensar las pérdidas que pudieran producirse con lasinversiones comprendidas en la Cartera,</p>
                        <p>4) suscribirtoda la documentación pertinente, incluyendo toda clase de certificados, formularios de suscripción y/o de rescate de cuotapartes y cualquier otra documentación necesaria para la realización o implementación de lasinversiones,</p>
                        <p>5) deducir de la Cartera los gastos, aranceles, honorarios, y cualquier otro pago que pudiera corresponder de acuerdo con la operatoria y</p>
                        <p>6) dejar de administrar la Cartera del Comitente siempre que notifique por escrito al Comitente con una antelación no menor a treinta (30) días corridos.</p>
                        <p>INGRESO Y/O RETIRO DE ACTIVOS DE LA CARTERA: El Comitente podrá ingresar Fondos o Valores Negociables a su Cartera depositándolos en la Cuenta Comitente y/o retirar Fondos o Valores Negociables de su Cuenta. Los retiros deberán solicitarse a Deal con la debida antelación para que Deal liquide inversiones y posiciones para atender estosretiros.</p>
                        <p>DECLARACIONES DEL COMITENTE: El Comitente manifiesta tener conocimiento de la naturaleza de las operaciones que Deal realiza y de los riesgos inherentes a cada una de esas operaciones. Asimismo, declara y asume que lasinversiones a ser realizadas bajo la presente Autorización implican riesgos y están sujetas a múltiples variaciones, incluyendo condiciones de mercado, riesgo económico y financiero de los emisores de los Valores Negociables, entre otras. Consecuentemente, el Comitente asume los riesgos originados en las inversiones que se realicen quedando expresamente aclarado y convenido que Deal no garantiza la solvencia de los deudores bajo las mismas ni el rendimiento de las inversiones, ni responde por la existencia, legitimidad y/o evicción debida por los enajenantes de tales inversiones, ni sobre la integridad o el mantenimiento de valor de las mismas.</p>
                        <p>RESPONSABILIDAD DE Deal: Deal únicamente será responsable frente al Comitente y/o terceros solo en el supuesto de haber actuado con culpa grave o dolo. Deal no responderá frente al Comitente y/o a terceros en caso que la totalidad o parte de la Cartera se pierdan por caso fortuito o fuerza mayor, incluyendo modificaciones y/o derogaciones de la legislación vigente.</p>
                        <p>CONFIDENCIALIDAD: Deal se compromete a mantener con carácter confidencial toda la información relacionada con el Comitente, la Cartera y demás información adquirida como consecuencia de sus funciones, excepto que tal información le haya sido requerida a Deal por autoridad competente o deba divulgarse con motivo de existir alguna obligación legal de informar. En ese caso El Comitente autoriza a Deal a proveer la información correspondiente.</p>
                        <p>COMISIONES Y GASTOS: Deal tendrá derecho a percibir las comisiones y gastos descriptos en el CONVENIO ENTRE EL COMITENTE Y Deal S.A. firmado en oportunidad de la apertura de la Cuenta Comitente o bien en las sucesivas actualizaciones de las mismas. Liquidando los activos que sean necesarios a tal efecto sin necesidad de aviso previo al Comitente. Si por estar afectados a alguna inversión no hubiere Fondos disponibles en el momento que Deal deba realizar el débito, dicho débito se hará efectivo al momento de quedar disponibles los mismos o vendiendo Deal los Valores Negociables necesarios para ello, sin perjuicio del derecho de Deal de exigir el pago directamente al Comitente. Si el Comitente o Deal decidieran dejar sin efecto la presente Autorización quedarán a cargo del Comitente todaslas comisiones y honorarios de Deal y/o terceros, todo timbrado, sellado, impuesto, derecho, costo, honorario, tarifa, penalidades, cargos y/o gasto actual o futuro, de cualquier naturaleza que sea consecuencia directa o indirecta de las operaciones efectuadas en virtud de la presente Autorización General. </p>
                        <p>INDEMNIDAD: El Comitente se obliga a mantener indemne a Deal, sus directores, accionistas, gerentes y personal, de todo gasto, daño, perjuicio, costo, erogación o consecuencia patrimonial económicamente adversa que resulte del desempeño de su función como tal, incluyendo en ello los costos impositivos, de asesoramiento legal, gastos y costas judiciales e incluso impuestos, salvo que la obligación o perjuicio haya sido causado por dolo o culta grave de Deal determinado como tal por sentencia judicial firme. </p>
                        <p>NORMATIVA APLICABLE: La presente Autorización General se rige por las leyes de la República Argentina y las operaciones que se realicen bajo la misma, estarán sujetas a la Reglamentación de los Mercados en donde se concerten y liquiden las mismas, de las normas de la Comisión Nacional de Valores, del Agente de Deposito Colectivo Autorizado y demás normas (incluyendo leyes, decretos y resoluciones) que resulten, así como a los usos y costumbres en los mercados donde Deal ejecute tales operaciones.</p>
                    </Col>
                </Row>

                <Row className="">
                    <CajaFirma />
                </Row>

                
                {
                    personas.length !== 0 ? personas.map(persona => {
                        return <Row className="pageBreak"><DeclaracionJurada persona={persona}/></Row>
                    })
                    :
                    "Cargando..."
                }
                


                <Row className="pageBreak pb-5">
                    <PDFHeader />
                </Row>


                <Row>
                    <Col className="text-center mb-4">
                        <Typography><b>CONSTANCIA RECIBO ENTREGA REGLAMENTO DE GESTIÓN EN SUSCRIPCIÓN PRESENCIAL</b></Typography>
                    </Col>
                </Row>

                <Row>
                    <Col className="mb-4">
                        <p>Declaro conocer y aceptar el/los texto/s del/los reglamento/s de gestión (reglamento/s) del/los fondo/s común/es de inversión (FONDO/S) que se detalla/n a continuación, del/los cual/es recibo copia íntegra del texto vigente, obrando el presente como suficiente recibo. Tomo conocimiento que este/os reglamento/s puede/n ser modificado/s, previa autorización de la COMISION NACIONAL DE VALORES e inscripción en el REGISTRO correspondiente, en cuyo caso la/s nueva/s versión/es regirá/n la operatoria del/los FONDO/S a partir de su entrada en vigencia. El/los texto/s vigente/s del/los reglamento/s, así como la información adicional sobre el/los FONDOS, el ADMINISTRADOR y el CUSTODIO, podrán ser consultados en forma gratuita, en todo momento, en www.cmafondos.com.ar, www.inversionesbind.com.ar, www.dealfs.com.ar, www.cnv.gob.ar y/o www.cafci.org.ar</p>
                        
                        <p className="mt-5"><b>DENOMINACIÓN FONDOS COMUNES DE INVERSIÓN</b></p>
                        <p>-CMA Protección (Registrado por CNV bajo el Nro. 437)</p>
                        <p>-IAM Ahorro Pesos FCI (Registrado por CNV bajo el Nro. 774)</p>
                        <p>-IAM Renta Plus FCI (Registrado por CNV bajo el Nro. 775)</p>
                        <p>-IAM Renta Capital FCI (Registrado por CNV bajo el Nro. 809)</p>
                        <p>-IAM Renta Crecimiento FCI (Registrado por CNV bajo el Nro. 776)</p>
                        <p>-IAM Renta Balanceada FCI (Registrado por CNV bajo el Nro. 954)</p>

                        
                        <p className="mt-5">Apellido y Nombre: ..................................</p>
                        <p className="mt-2">Razón Social del INVERSOR ...........................</p>
                        <p className="mt-2">Tipo y Nro. de Documento de Identidad:...............</p>
                        <p className="mt-2">Fecha y Hora: .......................................</p>

                        <p className="mt-5">Firma y aclaración del INVERSOR .....................</p>

                        <p className="mt-5">Firma y aclaración del PERSONAL del Agente de Administración de Productos de Inversión Colectiva de Fondos Comunes de Inversión y/o del Agente de Custodia de Productos de Inversión Colectiva de Fondos Comunes de Inversión y/o del agente de Colocación y Distribución de Fondos Comunes de Inversión, presente en la entrega al INVERSOR de la copia íntegra del texto del reglamento de gestión: ..............................</p>
                        
                        <Box border={1} p={3} mt={5}>Las inversiones en cuotas del FONDO no constituyen depósitos en (denominación de la entidad financiera interviniente), a los fines de la Ley de Entidades Financieras ni cuentan con ninguna de las garantías que tales depósitos a la vista o a plazo puedan gozar de acuerdo a la legislación y reglamentación aplicables en materia de depósitos en entidades financieras. Asimismo, el Banco Custodio se encuentra impedida por normas del BANCO CENTRAL DE LA REPÚBLICA ARGENTINA de asumir, tácita o expresamente, compromiso alguno en cuanto al mantenimiento, en cualquier momento, del valor del capital invertido, al rendimiento, al valor de rescate de las cuotapartes o al otorgamiento de liquidez a tal fin.</Box>

                    </Col>
                </Row>


                <Row className="pageBreak pb-5">
                    <PDFHeader />
                </Row>


                <Row>
                    <Col className="text-right">
                        <p>C. A. de Buenos Aires, {new Date().getDate()} de {new Date().getMonth()} de {new Date().getFullYear()}</p>
                        <p><b>Ref.: DECLARACION JURADA INVERSOR CALIFICADO</b></p>
                        <p>Comitente Nº:______________</p>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <p className="mt-5">De mi mayor consideración</p>
                        <p className="mt-5">Por medio de la presente, me dirijo a ustedes, a fin de manifestar en carácter de Declaración Jurada que cumplo los requisitos exigidos por la Resolución 761/2018 de la CNV (RESGC-2018-761-APN-DIR#CNV) artículo 12, inciso m), por ello clasifico como INVERSOR CALIFICADO</p>
                        <p>Manifiesto poseer inversiones en valores negociables y/o depósitos en entidades financieras por un monto mayor a 350.000 Unidades de Valor Adquisitivo (UVA) siendo hoy su equivalente en pesos $ _____________</p>
                        <p>INVERSOR CALIFICADO: Manifiesto tener absoluto conocimiento de los riesgos de cada instrumento objeto de la inversión a la que pueden acceder los INVERSORES CALIFICADOS tanto por valores negociables operados en el territorio nacional como aquellos operados en el extranjero. Dejo constancia que la decisión de inversión ha sido adoptada en forma independiente, siendo mi absoluta responsabilidad los resultados obtenidos por dichos instrumentos. Autorizo todo tipo de operaciones en el Segmento de Negociación Bilateral prescindiendo de la prioridad precio-tiempo que brinda una operación de mercado</p>
                        
                    </Col>
                </Row>
                <Row>
                    <Col className="text-right mt-6">
                        <p>Firma:…………………………………………………………………</p>
                        <p>Aclaración:…………………………………………………………………</p>
                        <p>DNI:………………………………………………………………..</p>
                    </Col>
                </Row>




                </Container>
            </Container>
            
        </>
    )
}

PDFPage.propTypes = {

}

export default PDFPage
