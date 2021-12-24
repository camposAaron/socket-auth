
const btnsignout = document.querySelector('.g_id_signout');
const formulario = document.querySelector('.form');

var url = window.location.hostname.includes('localhost') ?
    'http://localhost:5000/api/auth/' :
    'https://myrest-server-xd.herokuapp.com/api/auth/';

//LOGIN con formulario
 formulario.addEventListener('submit',e => {
    e.preventDefault();
    const formData = {}

    for(let el of formulario.elements){
        if(el.name.length > 0 )
            formData[el.name] =el.value;
    }

    fetch(url+"login",{
        method : "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then( resp => resp.json())
    .then( data => {
        if(data.msg){
            return console.error(data.msg);
        }

        localStorage.setItem('token',data.token);
        window.location = "chat.html";
    })
});

//LOGIN CON GOOGLE.
function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    const id_token = response.credential;

    // const responsePayload = parseJwt(id_token);

    // console.log("ID: " + responsePayload.sub);
    // console.log('Full Name: ' + responsePayload.name);
    // console.log('Given Name: ' + responsePayload.given_name);
    // console.log('Family Name: ' + responsePayload.family_name);
    // console.log("Image URL: " + responsePayload.picture);
    // console.log("Email: " + responsePayload.email);



    fetch(url+"google", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token })
    })
        .then(resp => resp.json())
        .then(data => {

            if(data.msg){
                return console.error(data.msg);
            }
            localStorage.setItem('correo', data.usuario.email);
            localStorage.setItem('token',data.token)
            window.location ='chat.html';

        })
        .catch(err => console.log(err))
}

//SIGN OUT METHOD
btnsignout.addEventListener('click', () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke(localStorage.getItem('correo'), done => {
        localStorage.clear();
        location.reload();
    });
});

//DESCIFRAR JWT
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};



