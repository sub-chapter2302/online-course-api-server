const express = require('express')
const router = express.Router()
const db = require('mongoose')
const Transaction = require('../../model/transaction')
const { getCourse, updateCourse } = require('../../controller/course')
const { getAllTransactions, 
        getTransaction, 
        createTransaction, 
        updateTransaction, 
        deleteTransaction } = require('../../controller/transaction')


router.get('/get-all', async (req, res) => {
    let data = await getAllTransactions()
    res.json(data)
})

router.get('/get/:id', async (req, res) => {
    let data = await getTransaction(req.params.id)
    res.json(data)
})

router.post('/add', async (req, res) => {
    let user = req.body.user
    let cids = req.body.cids
    let transactions = []
    const session = await db.startSession()
    session.startTransaction()
    await cids.reduce(async (currVal, cid) => {
        let course = await getCourse(cid, session)
        let trans = new Transaction()
        if (course.quantity == course.maxStudent) { 
            trans = await createTransaction({ user: user, course: course, status: 'FAIL' }, session)
            transactions.push({trans: trans, message: 'FULL'})
        }
        else {
            if((currVal + course.price) <= user.balance)
            {
                trans = await createTransaction({ user: user, course: course, status: 'SUCCESS' }, session)
                let newCourse = {
                    _id: course._id,
                    quantity: course.quantity + 1,
                    isActive: (course.quantity + 1 == course.maxStudent) ? false : true
                }
                await updateCourse(newCourse, session)
                await transactions.push({trans: trans, message: ''})
                return currVal + course.price
            } 
            else {
                trans = await createTransaction({ user: user, course: course, status: 'PENDING' }, session)
                transactions.push({trans: trans, message: 'BALANCE PROBLEM'})
            }
        }
    }, 0)

    await session.commitTransaction()
    session.endSession()
    res.json(transactions)
})

router.put('/update', async (req, res) => {
    const session = await db.startSession()
    session.startTransaction()
    let course = await getCourse(req.body.course._id, session)
    let message = await updateTransaction(req.body , session)
    switch(req.body.status) {
        case 'SUCCESS':
            if(course.quantity < course.maxStudent)
            {
                let newCourse = {
                    _id: course._id,
                    quantity: course.quantity + 1,
                    isActive: (course.quantity + 1 == course.maxStudent) ? false : true
                }
                if(req.body.rating) newCourse.rating = (req.body.rating + course.rating)/2
                await updateCourse(newCourse, session)
            }
            break
        default: break
    }
    await session.commitTransaction()
    session.endSession()
    res.json(message)
})

router.delete('/delete', async (req, res) => {
    let message = await deleteTransaction(req.body.id)
    res.json(message)
})

router.get('/add-test', async (req, res) => {
    let user = { _id: '5f3bcad317c87f2d888a5601', fullName: 'Erhart Coltan', balance: 85 }
    let cids = ['5f3bca3d17c87f2d888a55e3', '5f3bca3d17c87f2d888a55e4', '5f3bca3d17c87f2d888a55e5']
    let transactions = []
    const session = await db.startSession()
    session.startTransaction()
    await cids.reduce(async (currVal, cid) => { 
        let course = await getCourse(cid, session)
        
        let trans = new Transaction()
        if (course.quantity == course.maxStudent) { 
            trans = await Transaction.create([{ user: user, course: course, status: 'FAIL' }], { session: session })
            transactions.push({trans: trans, message: 'FULL'})
        }
        else {
            if((currVal + course.price) <= user.balance)
            {
                trans = await Transaction.create([{ user: user, course: course, status: 'SUCCESS' }], { session: session });
                await updateCourse(course, newCourse => {
                    newCourse.quantity += 1
                    newCourse.isActive = (newCourse.quantity == newCourse.maxStudent) ? false : true
                })
                await transactions.push({trans: trans, message: ''})
                return currVal + course.price
            } 
            else {
                trans = await Transaction.create([{ user: user, course: course, status: 'PENDING' }], { session: session })
                transactions.push({trans: trans, message: 'BALANCE PROBLEM'})
            }
        }
    }, 0)

    await session.commitTransaction()
    session.endSession()
    await console.log(transactions)
    await res.json(transactions)
})

module.exports = router