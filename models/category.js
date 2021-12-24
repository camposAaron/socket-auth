const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
    name : {
        type : String,
        required : [true, 'El nombre de la categoria es obligatorio'],
        unique: true
    },
    state : {
        type : Boolean,
        default : true,
        required : true
    },
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required  : true
    }
});

CategorySchema.methods.toJSON = function() {
    const { __v, state , ...categories } = this.toObject();
    return categories;  
}


module.exports = model("Category", CategorySchema);