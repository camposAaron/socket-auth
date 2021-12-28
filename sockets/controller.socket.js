const { verificarJWT } = require('../helpers');
const { ChatMensaje } = require('../models');


const chatMensajes = new ChatMensaje();

const socketController = async (socket, io) => {
    //validar JWT
    const usuario = await verificarJWT(socket.handshake.headers['x-token']);
    if (!usuario) {
        return socket.disconnet();
    }

    //agregar usuario 
    chatMensajes.conectarUsuario(usuario);


    //emitir usuarios conectados
    io.emit('usuarios-conectados', chatMensajes.usuariosArr);

    //conectar a una sala especial
    socket.join( usuario.id ); // global, socket.id, usuario.id
    

    //desconectar usuario
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario._id);
        io.emit('usuarios-conectados', chatMensajes.usuariosArr);
    });


    socket.on('enviar-mensaje', ({ mensaje, uid }) => {

        if (uid) {
             socket.to( uid ).emit( 'mensaje-privado', { de: usuario.name, mensaje });
        } else {
            chatMensajes.enviarMensaje(usuario.uid, usuario.name, mensaje);
            io.emit('recibir-mensaje', chatMensajes.ultimos10);
        }
    });
}

module.exports = {
    socketController
}