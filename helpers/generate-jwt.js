const JWT = require('jsonwebtoken');
const { User } = require('../models');


const generateJWT = (uid) => {
    return new Promise((resolve, reject)=>{
        const payload = { uid };
        JWT.sign(payload, process.env.SECRETORPRIVATEKEY, {expiresIn : '4h'}, (err, token)=>{
            if( err ){
                console.log(err);
                reject('No se pudo generar el token');
            }else{
                resolve(token);
            }
        })
    
    })
}

const verificarJWT = async(token) => {
    try{

        if(token.length < 10 ){
            return null;
        }

        const { uid } = JWT.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await User.findById( uid );
       

        if(usuario){
            if(!usuario.state){
                return null;
            }

            return usuario;
        }else{
            return null;
        }

    }catch(error){
        return null;
    }
   
}

module.exports = {
    generateJWT,
    verificarJWT
}



// const generateJWT = ( uid ) => {
//     return new Promise( (resolve, reject) => {
//         const payload = { uid };
//         JWT.sign(payload , process.env.SECRETPRIVATEKEY , {expiresIn : '4h'}, 
//         (err, token)=>{
//             if( err ){
//                 console.log(err);
//                 reject('No se pudo generar el token')l
//             }else{
//                 resolve(token);
//             }
//         })
//     })
// }