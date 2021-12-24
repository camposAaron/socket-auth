const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    name : {
        type:  String,
        required: [true, 'The name is requerid']
    },
    email : {
        type: String,
        required : [true, 'An email is required'],
        unique: true
    },
    password : {
        type: String,
        required: [true, 'A password is required'],
    },
    img : {
        type: String,
    },
    role : {
        type : String,
        required: true,
        default: 'USER_ROLE',
        emun : ['ADMIN_ROLE', 'USER_ROLE']
    },
    state : {
        type: Boolean,
        default : true
    },
    google:{
        type: Boolean,
        default : false
    }
});

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;  
}

module.exports = model('User', UserSchema);