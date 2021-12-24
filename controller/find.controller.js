const {response} = require('express');
const { ObjectId} = require('mongoose').Types;
const {User, Product, Category }  = require('../models/index');


const myCollections = ['users','rols','products','categories']

const findUsers = async( term , res ) => {
    
    const isMongoID = ObjectId.isValid(term); //true
    
    //verificar si el termino es un id de mongo
    if(isMongoID){
        const user = await User.findById(term);
        return res.json({
            results :  [ (user) ? (user) : [] ]
        });
    }

    //hacer el termino insensible a mayusculas.
    const regex =  new RegExp(term, 'i');

    const users = await User.find({
        $or : [{name : regex}, {email : regex}],
        $and : [{state : true}]
    });

    res.json({
        results : users
    });

}

const findCategories = async(term, res) => {
    const isMongoID = ObjectId.isValid(term);
    if(isMongoID){
        const category = await Category.findById(term).populate('user', 'name');
        return res.json({
            results : [ (category) ? (category) : [] ]
        }); 
    }

    const regex = new RegExp(term, 'i');
    const categories = await Category.find({name : regex , state : true}).populate('user', 'name');
    res.json({
        results : categories
    });
}

const findProducts = async(term, res) => {
    const isMongoID = ObjectId.isValid(term);
    
    if(isMongoID){
        const product = await Product.findById(term)
        .populate('user','name').populate('category', 'name');
        return res.json({
            results : [ (product) ? (product) : [] ]
        }); 
    }

    const regex = new RegExp(term, 'i');

    const products =  await Product.find({ name : regex, state : true})
    .populate('user','name').populate('category', 'name');

    res.json({
        results : products
    }); 
}

const finder = (req, res = response) => {
    const { collection, term } = req.params;
    
    if(!myCollections.includes(collection)){
        res.status(400).json({msg : `La coleccion ${collection} no es valida`});
    }

   switch(collection){
    case 'users':
        findUsers(term, res);   
        break;        
    case 'products':
        findProducts(term, res);
        break;
    case 'categories':
        findCategories(term, res);
        break;
    default :
        res.status(500).json('Error al realizar la busqueda');
        break;
    }
}

module.exports = {
    finder
}