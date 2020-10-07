const express = require('express')
const app      = express()

require('dotenv').config()

const port     = process.env.PORT || 4000
const mongoose = require('mongoose')
const passport = require('../config/passport')
const authRoute = require('../api/route/auth')
const courseRoute = require('../api/route/course')
const userRoute = require('../api/route/user')
const transRoute = require('../api/route/transaction')
const cookieParser = require('cookie-parser')
const bodyParser   = require('body-parser')
const session      = require('express-session')
const cors = require('cors')

app.use(express.json());
mongoose.connect(process.env.DATABASE_URL).then(() => console.log('DB Connected!')) // connect tới database 
// Cấu hình ứng dụng express
app.use(cors(
  // origin: "http://localhost:3000",
  // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  // credentials: true // allow session cookie from browser to pass through
))
app.use(cookieParser()); //Parse cookie
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
/* app.use(session({
     name: 'ChubeRedizz',
     secret: 'ssshhhhh',
     saveUninitialized: false,
     resave: false,
     cookie: {
       secure: true,
       httpOnly: true
     }
 })) */ 

app.use(passport.initialize());
//app.use(passport.session());

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated"
    })
  } else {
    next();
  }
}

const checkRole = (roles = []) => {
  return async (req, res, next) => {
    let check = await roles.some(role => {
      return req.user.role.includes(role)
    })
    if (check) res.json('ACCESS GRANTED')
    else res.json('ACCESS DENIED') 
  }
}

app.get("/", checkRole(['teacher']), (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies
  })
})

app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/course', courseRoute)
app.use('/trans', transRoute)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})