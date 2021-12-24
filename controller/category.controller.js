const { response, request } = require("express");
const {
    Category
} = require('../models/index');



const getCategories = async(req = request, res = response) => {
    
    const { limite = 5, desde } = req.query;
    const query = { state : true };
  
    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
        .populate('user','name')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        categories
    });
}


const getCategory = async(req = request, res = response) =>{
    
    const { id }=  req.params;
    const category = await Category.findById({_id : id}).populate('user', 'name');

    res.json({
        category
    });

}

const createCategory = async(req = request, res = response) =>{
   
    const  name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });
    

    if(categoryDB){
        return res.status(400).json({
            msg :  `La categoria ${ categoryDB.name } ya esta registrada!`
        });
    }

    //generar la data a guardar
    const data = {
        name,
        user : req.user._id
    }

    const category = new Category(data);

    //guardar en DB
    await category.save();


    res.status(201).json(category);
} 

//Actualizar Categoria  --ADMIN_ROLE autenticado
const updateCategory = async(req = request, res = response) =>{
    
    const { id }=  req.params;
    let { state, name} = req.body
    
    //id usuario que modifico la categoria
    const user = req.user._id; 

    name = name.toUpperCase();


    const category = await Category.findByIdAndUpdate(id, {state, name, user}, {new : true});

    res.json(category);
}


const deleteCategory = async(req = request, res = response) =>{
    const { id } =  req.params;

    const category = await Category.findByIdAndUpdate(id, {state : false}, {new : true});

    res.json(category);

}



module.exports = {
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
    createCategory
}