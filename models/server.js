const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller.socket'); 

class Server{
    
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.server =  require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.path = {
            auth :       '/api/auth',
            find :       '/api/find',
            users :      '/api/user',
            products:     '/api/product',
            categories : '/api/category',
            uploads :    '/api/uploads'
        }
        
        
        //Conectar a base de datos
        this.connectDB();
        //Middlewares
        this.middlewares();
        //Rutas de mi aplicacion
        this.routes();
        //eventos de sockets
        this.sockets();
    }

    async connectDB(){
        await dbConnection();
    }

    middlewares(){

        //CORS
        this.app.use(cors());
        //lectura y parseo a json
        this.app.use(express.json());
        //Servir carpeta pública
        this.app.use( express.static('public'));

        //fileupload - carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath : true
        }));
    }

    routes(){
        this.app.use(this.path.auth, require('../routes/auth'));
        this.app.use(this.path.find, require('../routes/find'));
        this.app.use(this.path.users, require('../routes/user'));
        this.app.use(this.path.products, require('../routes/product'));
        this.app.use(this.path.categories, require('../routes/category'));
        this.app.use(this.path.uploads, require('../routes/upload'));
    }

    sockets(){
        this.io.on('connection', socketController);
    }

    listen(){
        this.server.listen(this.port, ()=>{
            console.log('Escuchando en el puerto: ', this.port);
        });        
    }


}

module.exports =  Server;