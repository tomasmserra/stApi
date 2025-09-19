import { BehaviorSubject } from 'rxjs';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
const token = "";

export const aperturaService = {
    guardarPaso1,
    guardarPaso2,
    guardarPaso3,
    guardarPaso4,
    guardarPaso5,
    obtenerUltimoPasoCompletado,
    obtenerPaso,
    obtenerPedidoIndividuo,
    //confirmarApertura,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

async function obtenerPedidoIndividuo () {
    
    let result = {}
    try {
        const requestOptions = {
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
        };
    
        let url = `${process.env.REACT_APP_API_URL}/api/apertura/individuo/`
    
        const data = await fetch(url, requestOptions)
        debugger
        if (data.status === 403)
            localStorage.removeItem("token");
        

        result = await data.json();

        } catch (error) {
            console.error(error);
        } 

        return result
}

async function obtenerPaso (paso){
    let result = {}
    try {
        const requestOptions = {
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
        };
    
        let url = `${process.env.REACT_APP_API_URL}/api/apertura/individuo/${paso}`
    
        const data = await fetch(url, requestOptions)
        
        if (data.status === 403)
            localStorage.removeItem("token");
        

        result = await data.json();

      } catch (error) {
        console.error(error);
      } 

      return result

}

async function obtenerUltimoPasoCompletado (){
    let result = {}
    try {
        const requestOptions = {
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
        };
    
        let url = `${process.env.REACT_APP_API_URL}/api/cuenta/apertura/individuo/ultimoRegistro`
    
        const data = await fetch(url, requestOptions)
        
        if (data.status === 403)
            localStorage.removeItem("token");
        
        result = await data.json();

      } catch (error) {
        console.error(error);
      } 

      return result

}

async function guardarPaso1 (datos){
debugger

    let body = JSON.stringify({
            datosContacto: obtenerDatosContacto(datos),
            datosPersonales: obtenerDatosPersonales(datos),
            datosFiscales: obtenerDatosFiscales(datos)
        } 
    )
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
        body
    };

    let url = `${process.env.REACT_APP_API_URL}/api/apertura/individuo/paso/1`
    console.log(url)

    const data = await fetch(url, requestOptions)
    const result = await data.json();

    return result

}

async function guardarPaso2 (datos){

    let body = JSON.stringify({"cotitulares":datos.map(x => {
        return {
            datosContacto: x.datosContacto || obtenerDatosContacto(x),
            datosPersonales: x.datosPersonales || obtenerDatosPersonales(x),
            datosFiscales: x.datosFiscales || obtenerDatosFiscales(x)
        }
    })})
        
    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
        body
    };

    let url = `${process.env.REACT_APP_API_URL}/api/apertura/individuo/paso/2`

    const data = await fetch(url, requestOptions)
    const result = await data.json();

    return result

}

async function guardarPaso3 (cuentas){
    
    let body = JSON.stringify({"cuentas": cuentas})
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
        body
    };

    let url = `${process.env.REACT_APP_API_URL}/api/apertura/individuo/paso/3`
    
    debugger
    const data = await fetch(url, requestOptions)
    const result = await data.json();
    
    return result

}

// async function guardarPaso4 (declaracionJurada){
    
//     let body = JSON.stringify({"declaracionJurada": declaracionJurada})
//     const requestOptions = {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
//         body
//     };

//     let url = `${process.env.REACT_APP_API_URL}/api/apertura/individuo/paso/4`
//     console.log(url)

//     const data = await fetch(url, requestOptions)
//     const result = await data.json();

//     return result

// }

async function guardarPaso4 (declaracionFinanciera){
    var declaracionFinanciera2 = 
        {
          adjuntos: [
            {
              nombre: "",
              path: ""
            }
          ],
          origenes: declaracionFinanciera.origen
        }
      
    debugger

    let body = JSON.stringify({"declaracionFinanciera": declaracionFinanciera2})
    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
        body
    };

    let url = `${process.env.REACT_APP_API_URL}/api/apertura/individuo/paso/4`
    
    const data = await fetch(url, requestOptions)
    const result = await data.json();
    
    return result

}


async function guardarPaso5 (perfilDeRiesgo){
    
    let body = JSON.stringify({"perfilDeRiesgo": perfilDeRiesgo})

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
        body
    };

    let url = `${process.env.REACT_APP_API_URL}/api/apertura/individuo/paso/5`

    const data = await fetch(url, requestOptions)
    const result = await data.json();

    return result

}



const obtenerDatosContacto = datos => {
    return {
        altura: datos.altura,
        celular: datos.celular,
        codigoPostal: datos.codigoPostal,
        correoElectronico: datos.correoElectronico,
        correoElectronico2: datos.correoElectronico2,
        correoElectronico3: datos.correoElectronico3,
        departamento: datos.departamento,
        direccion: datos.direccion,
        localidad: datos.localidad,
        pais: datos.pais,
        piso: datos.piso,
        telefono: datos.telefono
      }
}

const obtenerDatosPersonales = datos => {
    return {
        apellido: datos.apellido,
        codigoIdentificacion: datos.codigoIdentificacion,
        documento: datos.documento,
        estadoCivil: datos.estadoCivil,
        fechaNacimiento: datos.fechaNacimiento,
        lugarNacimiento: datos.lugarNacimiento,
        lugarResidencia: datos.lugarResidencia,
        nacionalidad: datos.nacionalidad,
        nombre: datos.nombre,
        ocupacion: datos.ocupacion,
        sexo: datos.sexo,
        tipoCodigoIdentificacion: datos.tipoCodigoIdentificacion,
        tipoDocumento: datos.tipoDocumento
      }
}

const obtenerDatosFiscales = datos => {
    return {
        declaraUIF: datos.declaraUIF === 'true',
        esFATCA: datos.esFATCA === 'true',
        motivoFatca: datos.motivoFatca,
        esPep: datos.esPep === 'true',
        motivoPep: datos.motivoPep
      }
}