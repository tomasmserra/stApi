export const validarForm = async values => {
    const errors = {};
    
    if (!values.nombre) errors.nombre = "Dato obligatorio";
    if (!values.apellido) errors.apellido = "Dato obligatorio";
    if (!values.tipoDocumento) errors.tipoDocumento = "Dato obligatorio"; 
    if (!values.documento) errors.documento = "Dato obligatorio";
    if (!values.nacionalidad) errors.nacionalidad = "Dato obligatorio";
    if (!values.sexo) errors.sexo = "Dato obligatorio";
    if (!values.tipoCodigoIdentificacion) errors.tipoCodigoIdentificacion = "Dato obligatorio";
    if (!values.codigoIdentificacion) errors.codigoIdentificacion = "Dato obligatorio";
    if (!values.fechaNacimiento) errors.fechaNacimiento = "Dato obligatorio";
    if (!values.lugarNacimiento) errors.lugarNacimiento = "Dato obligatorio";
    if (!values.ocupacion) errors.ocupacion = "Dato obligatorio";
    if (!values.lugarResidencia) errors.lugarResidencia = "Dato obligatorio";
    if (!values.estadoCivil) errors.estadoCivil = "Dato obligatorio";
    if (!values.correoElectronico) errors.correoElectronico = "Dato obligatorio";
    if (!values.direccion) errors.direccion = "Dato obligatorio";
    if (!values.altura) errors.altura = "Dato obligatorio";
    if (!values.piso) errors.piso = "Dato obligatorio";
    if (!values.departamento) errors.departamento = "Dato obligatorio";
    if (!values.celular) errors.celular = "Dato obligatorio";
    //if (!values.telefono) errors.telefono = "Dato obligatorio";
    if (!values.pais) errors.pais = "Dato obligatorio";
    if (!values.localidad) errors.localidad = "Dato obligatorio";
    if (!values.codigoPostal) errors.codigoPostal = "Dato obligatorio";
    
    return errors;
}