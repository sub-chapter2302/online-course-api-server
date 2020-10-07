const express = require('express')
const router = express.Router()
const {createUser , getAllUsers, getUser, updateUser, deleteUser} = require('../../controller/user')

router.post('/add', async (req,res) => {
    let user = await createUser(req.body)
    res.json(user)
})

router.get('/',(req,res) => {
    console.log('xxxxxx', req.user)
    res.json(req.isAuthenticated());
})

router.get('/get-all', async (req,res) => {
    console.log('cookie: ', req.headers.cookie)
    let user = await getAllUsers()
    res.json(user)
})
router.get('/get/:id', async (req,res) => {
    let user = await getUser(req.params.id)
    res.json(user)
})

router.put('/update', async (req,res) => {
    let message 
    await updateUser(req.body).then(res => message = res).catch(err => message = err.json())

    // await updateUser(req.body, newUser => {
    //     newUser.fullName = req.body.fullName
    //     newUser.bio = req.body.bio
    //     newUser.address = req.body.address
    //     newUser.birthday = req.body.birthday
    //     newUser.photoUser = req.body.photoUser
    //     newUser.authenticateMethod.local.email = req.body.email
    //     newUser.authenticateMethod.local.password = req.body.password
    //     newUser.workPlace = req.body.workPlace
    //     newUser.bankId = req.body.bankId
    //     newUser.phoneNumber = req.body.phoneNumber
    //     newUser.balance = req.body.balance     
    // }).then(res => message = res)
    // .catch(err => message = err)

    res.json(message)
})

router.delete('/delete', async (req,res) => {
    let message
    await deleteUser(req.body.id).then(res => message = res).catch(err => message = err.json())
    res.json(message)
})

module.exports = router;