const bcrypt = require('bcryptjs');
const { response, request } = require('express');
const User = require('../models/User');


const getUsers = async(req = request, res = response) => {
   
    const { limite = 5, desde } = req.query;
    const query = { state : true};

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)    
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

  
    res.json({
        total,
        users
    });
}

const putUsers = async (req, res) => {
    const { id } = req.params;
    const {_id, email, password, google, ...rest } = req.body;

    //TODO validar contra base de datos.
    if (password) {

        //Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync(password, salt);
        // rest.email = email;
    }

    const user = await User.findByIdAndUpdate(id, rest, {new : true});

    res.json(user);
}

const postUsers = async (req, res) => {

    const { name, password, email, role } = req.body;
    const user = new User({ name, password, email, role });


    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    //Guardar en la base de datos
    await user.save();

    res.json(user);
}

const deleteUsers = async(req, res) => {
    
    const {id} = req.params;

    const user = await User.findByIdAndUpdate(id, {state : false});
    const userAutenticated = req.user;
    res.json({user, userAutenticated});
}



module.exports = {
    getUsers,
    putUsers,
    postUsers,
    deleteUsers
}