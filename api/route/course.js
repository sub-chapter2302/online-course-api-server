const express = require('express')
const router = express.Router()

const {createCourse , getAllCourses, getCourse, updateCourse, deleteCourse} = require('../../controller/course')

router.post('/add', async (req,res) => {
    let message = await createCourse(req.body)
    res.json(message)
})

router.get('/',(req,res) => {
    res.json('CHUONG VIP')
})

router.get('/checking',(req,res) => {
    console.log('im res.body',req.body)
})

router.get('/get-all', async (req,res) => {
    let data = await getAllCourses()
    res.json(data)
})

router.get('/get/:id', async (req,res) => {
    let data = await getCourse(req.params.id)
    res.json(data)
})

router.put('/update', async (req,res) => {
    let message
    await updateCourse(req.body).then(res => message = res).catch(err => message = err.json())
    res.json(message)
})

router.delete('/delete', async (req,res) => {
    let message
    await deleteCourse(req.body.id).then(res => message = res).catch(err => message = err.json())
    res.json(message)
})

module.exports = router;