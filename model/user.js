const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    fullName: {type: String},
    bio: {type: String},
    role: [{type: String, enum: ['student','teacher','admin','god']}],
    address: {type: String},
    sex: {type: String, enum: ['Male','Female']},
    birthday: {type: String},
    photoUser: {type: String},
    authenticateMethod: {
        local: {
            email: {type:String},
            password: {type:String},
        },
        facebook: {
            name: {type:String},
            id: {type:String}
        },
        google: {
            email : {type:String},
            name: {type:String},
            id: {type:String}
        }    
    },
    workPlace: [{type: String}],
    rating: {type: String},
    bankId: {type: String},
    phoneNumber: {type: String},
    balance: {type: Number}
})

module.exports = mongoose.model('user', userSchema)