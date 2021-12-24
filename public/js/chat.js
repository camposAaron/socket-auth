var url = window.location.hostname.includes('localhost') ?
    'http://localhost:5000/api/auth/' :
    'https://myrest-server-xd.herokuapp.com/api/auth/';

// const socket = io();

let usuario = null;
let socket  = null;

//validar el token del localStorage;
const validarJWT = async() => {

    const token  = localStorage.getItem('token') || ' ';

    if(token.length < 10 ){
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url,{
        headers : { 'x-token' : token }
    })
    .then( resp => resp.json())
    .then( data => {
        localStorage.setItem('token', data.token);
        usuario = data.user;
    })    

    document.title = usuario.name;

    await conectarSocket();
}

const conectarSocket = async() => {
    const socket = io({
        'extraHeaders' : {'x-token' : localStorage.getItem('token')}
    });
}

const main = async() => {
    await validarJWT();
}

main();