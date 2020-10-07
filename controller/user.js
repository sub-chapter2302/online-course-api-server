const User = require('../model/user')

const getAllUsers = async session => {
    return await new Promise(async (resolve, reject) => {
        let get = await User.find({}, err => { if(err) reject(err) })
        if(session) await resolve(get.session(session))
        resolve(get)
    })
}

const getUser = async (uid,session) => {
    return await new Promise(async (resolve, reject) => {
        let get = await User.findOne({ '_id': uid }, (err) => { if (err) reject(err) })
        if(session) await resolve(get.session(session))
        resolve(get) 
    })
}

const createUser = async (data, session) => {
    return await new Promise(async (resolve, reject) => {
        session 
        ? await User.create([ data ], { session: session }, (err, res) => {
            if(err) reject('Fail')
            resolve(res) 
        })
        : await User.create([ data ],  (err, res)  => { 
            if(err) reject('Fail') 
            resolve(res)
        })
    })
}

const updateUser = async (data, session) => {
    return await new Promise(async (resolve, reject) => {
        let update = await User.updateOne({ _id: data._id }, { $set: data }, err => { if(err) reject('Fail') })
        await session ? update.session(session) : update
        await resolve('Success')
    })
}

const deleteUser = async (uid, session) => {
    return await new Promise(async (resolve, reject) => { 
        let del = await User.findByIdAndDelete(uid, err => { if(err) reject('Fail') })
        await session ? del.session(session) : del
        await resolve('Success')
    })
}

module.exports = { 
    createUser,
    getAllUsers, 
    getUser, 
    updateUser,
    deleteUser 
}