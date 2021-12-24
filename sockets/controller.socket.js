const { verificarJWT } = require('../helpers');

const socketController = async( socket ) => {
    const usuario = await verificarJWT(socket.handshake.headers['x-token']);
    if(!usuario){
        return socket.disconnet();
    }
}

module.exports = {
    socketController
}