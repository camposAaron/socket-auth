const { response, request } = require('express');
const User = require('../models/User');

const bcriptjs = require('bcryptjs');
const { generateJWT } = require('../helpers');
const { googleVerify } = require('../helpers/googe-verify');



const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        //verificar si el email existe
        const usuario = await User.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos -correo'
            });
        }

        //Si el usuario esta activo
        if (!usuario.state) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos -estado = false'
            })
        }

        //verificar la contraseña
        const validPassword = bcriptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            res.status(400).json({
                msg: 'Usuario / password no son correctos -constraseña = false'
            })
        }

        //generar el JWT
        const token = await generateJWT(usuario.id);


        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

const googleSignin = async (req, res = response) => {

    const { id_token } = req.body;

    try {
        const { name, email, img } = await googleVerify(id_token);

        let usuario = await User.findOne({email});

        if(!usuario){
            //crear usuario
            const data = {
                name,
                email,
                password : ':P',
                img,
                google : true
            };

            usuario = new User(data);
            await usuario.save();
        }

        //si el usuario de google tiene el estado en false
        if(!usuario.state){
            return res.status(401).json({
                msg: 'Hable con el administrador, Usuario bloqueado'
            });
        }


      //generar el JWT
        const token = await generateJWT(usuario.id);
    

        res.json({
            usuario,
            token
        });

    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'El token de google no es valido'
        });
    }

}

const renovarJWT = async(req, res ) => {
    const { user } = req;

    //generar el JWT
    const token = await generateJWT(user.id);

    res.status(201).json({
        user,
        token
    })
    
}

module.exports = {
    login,
    googleSignin,
    renovarJWT
}