const { request, response } = require('express');

const JWT = require('jsonwebtoken');
const User = require('../models/User');

const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');
    
    if(!token){
         return res.status(401).json({
             msg : 'No hay token en la petición'
         });
    }

     try{
        const { uid } = JWT.verify(token, process.env.SECRETORPRIVATEKEY);
        req.uid = uid;

        //leer el usuario que corresponde al uid
        const user =  await User.findById( uid );

        //comprobar si el usuario existe
        if(!user){
            return res.status(401).json({
                msg : 'Token no válido -Usuario no existe en DB'
            })
        }

        //comprobar si el usuario esta activo
        if(!user.state){
            return res.status(401).json({
                msg : 'Token no válido -Usuario estado :false'
            })
        }

        req.user = user;     
        next();
    
    }catch(err){
    
        console.log(err);
        return res.status(401).json({
            msg : 'Token no válido'
        });

    }


}

module.exports = {validarJWT};

