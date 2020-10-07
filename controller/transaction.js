const Transaction = require('../model/transaction')

const getAllTransactions = async (session) => {
    return await new Promise(async (resolve, reject) => {
        let get = await Transaction.find({}, err => { if(err) reject(err) })
        if(session) await resolve(get.session(session))
        resolve(get)
    })
}

const getTransaction = async (tid, session) => {
    return await new Promise(async (resolve, reject) => {
        let get = await Transaction.findOne({ '_id': tid }, (err) => { if (err) reject(err) })
        if(session) await resolve(get.session(session))
        resolve(get) 
    })
}

const createTransaction = async (data, session) => {
    return await new Promise(async (resolve, reject) => {
        session 
        ? await Transaction.create([ data ], { session: session }, (err, res) => {
            if(err) reject('Fail')
            resolve(res) 
        })
        : await Transaction.create([ data ],  (err, res)  => { 
            if(err) reject('Fail') 
            resolve(res)
        })
    })
}

const updateTransaction = async (data, callback) => {
    return await new Promise(async (resolve, reject) => {
        await callback(data)
        await Transaction.updateOne({ _id: data._id }, { $set: data }, err => { if(err) reject('Fail') })
        await resolve('Success')
    })
}

const deleteTransaction = async (tid, session) => {
    return await new Promise((resolve, reject) => { 
        let del = Transaction.findByIdAndDelete(tid, err => { if(err) reject('Fail') })
        if(session) del.session(session)
        else del
        resolve('Success')
    })
}

module.exports = { 
    createTransaction,
    getAllTransactions, 
    getTransaction, 
    updateTransaction,
    deleteTransaction 
}