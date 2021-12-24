const { response } = require('express');
const {  } = require('../middlewares/index');
const { Product } = require('../models/index');

const createProduct = async(req, res = response) => {    

    const { name, price, category, description, available } = req.body;

    const productoName =  await Product.findOne({name});

    if(productoName){
       return res.status(400).json({
            msg : `El producto ${productoName.name} ya esta registrado!`
        });
    }

    const data = {
        name, 
        user : req.user._id,
        price,
        category,
        description,
        available
    }

    const product = new Product(data);

    await product.save()

    res.status(201).json(product);
    
}


const getProducts = async(req, res = response) => {
    
    const {limite = 5, desde} = req.query;
    const query =  {state: true, available : true};

   

    const [total, product]  = await Promise.all([
       Product.countDocuments(query),
       Product.find(query).
       populate('user', 'name').
       populate('category', 'name').
       skip(Number(desde)).
       limit(Number(limite))
    ]);

    res.json({
        total,
        product
    });
}

const getProductById = async(req, res = response) => {
    const { id } = req.params;

    const product =  await Product.findById(id).populate('user','name').populate('category','name');

    res.json(product);
}

const deleteProduct = async(req, res =response) => {
    const { id } = req.params;
    
    const product =  await Product.findByIdAndUpdate( id, {state : false}, {new : true});
    
    res.json(product);
}

const updateProduct = async(req, res = response) => {
    const { id } = req.params;
    const { _id, user, ...rest} = req.body;

    user = req.user._id;

    const product = await Product.findByIdAndUpdate( id, {rest, user}, {new : true});

    res.json(product);


}

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
}