import { BehaviorSubject } from 'rxjs';
import { handleResponse } from '../helpers';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    register,
    validarRegistro,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

async function validarRegistro (token, email){
    debugger
    let url = `${process.env.REACT_APP_API_URL}/api/registro/validado?correoElectronico=${email}&token=${token}`
    console.log(url)

    const data = await fetch(url)
    const result = await data.json();
    console.log(result)

    return result

}

async function login(correoElectronico, clave) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correoElectronico, clave })
    };

    let url = `${process.env.REACT_APP_API_URL}/api/login/cliente`
    console.log(url)

    const data = await fetch(url, requestOptions)
    const result = await data.json();

    return result

}

async function register(correoElectronico, clave){
    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correoElectronico, clave })
    };
    let url = `${process.env.REACT_APP_API_URL}/api/registro/inicio`

    const data = await fetch(url, requestOptions)
    const result = await data.json();
    return result
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}
