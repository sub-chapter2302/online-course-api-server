const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transactionSchema = new Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'course' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    status: {type: String, enum: ['SUCCESS','PENDING','FAIL']},
    review: {type: String},
    rating: {type: Number},
    date: {type: String}
})

module.exports = mongoose.model('transaction',transactionSchema)