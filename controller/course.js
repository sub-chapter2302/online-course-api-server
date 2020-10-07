const Course = require('../model/course')

const getAllCourses = async (session) => {
    return await new Promise(async (resolve, reject) => {
        let courses = await Course.find({}, err => { if(err) reject(err) })
        if (session) await resolve(courses.session(session))
        resolve(courses)
    })
}

const getCourse = async (cid, session) => {
    return await new Promise(async (resolve, reject) => {
        let course = await Course.findOne({ _id: cid }, (err) => { if (err) reject(err) })
        if (session) await resolve(course.session(session)) 
        resolve(course)
    })
}

const createCourse = async (data, session) => {
    console.log('create data: ', data)
    return await new Promise(async (resolve, reject) => {
        session 
        ? await Course.create([ data ], { session: session }, (err, res) => {
            if(err) reject('Fail')
            resolve(res) 
        })
        : await Course.create([ data ],  (err, res)  => { 
            if(err) reject('Fail') 
            resolve(res)
        })
    })
}

const updateCourse = async (data, session) => {
    console.log('update data: ', data)
    return await new Promise(async (resolve, reject) => {
        let update = await Course.updateOne({ _id: data._id }, { $set: data }, err => { if(err) reject('Fail') })
        await session ? update.session(session) : update
        await resolve('Success')
    })
}

const deleteCourse = async (cid, session) => {
    return await new Promise(async (resolve, reject) => { 
        let del = await Course.findByIdAndDelete(cid, err => { if(err) reject('Fail') })
        await session ? del.session(session) : del
        await resolve('Success')
    })
}

module.exports = { 
    getAllCourses, 
    getCourse, 
    createCourse, 
    updateCourse, 
    deleteCourse 
}  