//Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMsg = document.querySelector('#txtMsg');
const ulUsuarios = document.querySelector('#ulUsuarios');
const btnLogout = document.querySelector('#btnLogout');
const ulMensajes = document.querySelector('#ulMensajes');



var url = window.location.hostname.includes('localhost') ?
    'http://localhost:5000/api/auth/' :
    'https://myrest-server-xd.herokuapp.com/api/auth/';

// const socket = io();

let usuario = null;
let socket = null;

//validar el token del localStorage;
const validarJWT = async () => {

    const token = localStorage.getItem('token') || ' ';

    if (token.length < 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, {
        headers: { 'x-token': token }
    })
        .then(resp => resp.json())
        .then(data => {
            localStorage.setItem('token', data.token);
            usuario = data.user;
        })

    document.title = usuario.name;

    await conectarSocket();
}

const conectarSocket = async () => {
    socket = io({
        'extraHeaders': { 'x-token': localStorage.getItem('token') }
    });

    socket.on('connect', () => {
        console.log('sockets conectados');
    });


    socket.on('disconnect', () => {
        console.log('offline');
    });

    socket.on('recibir-mensaje', dibujarChat);

    socket.on('usuarios-conectados', dibujarUsuarios);


    socket.on('mensaje-privado', ( payload ) => {
        console.log('Privado:', payload )
    });

}

const dibujarUsuarios = (usuarios = []) => {
    let userHtml = '';
    usuarios.forEach(({ name, uid }) => {
        userHtml +=
            `<li>    
                <p>
                    <h5 class="text-success">${name} </h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p> 
             </li>`;
    });
    ulUsuarios.innerHTML = userHtml;
}

const dibujarChat = ( historial = [] ) => {
    let historialHTML = ''
    console.log(historial);
    historial.forEach(({uid, nombre, mensaje})=>{
        historialHTML += `
            <li class="list-group-item bg-light">
                <p>
                    <h5 class="text-primary"> ${nombre}</h5>
                </p>
                <p>
                    ${mensaje}
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = historialHTML;
}

txtMsg.addEventListener('keyup', ({keyCode}) => {
    if(keyCode !== 13 ){ return ;};
    if(txtMsg.value === '' ){ return ;};
    const uid = txtUid.value;
    socket.emit('enviar-mensaje', { mensaje : txtMsg.value, uid});
    txtMsg.value = '';
});

const main = async () => {
    await validarJWT();
}

main();