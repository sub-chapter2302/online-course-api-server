const express  = require('express')
const router   = express.Router();
const passport = require('passport')
const jwt = require('jsonwebtoken')

module.exports = (function() {
  router.get("/login/success", (req, res) => {
    console.log('req.user: ', req.user)
    res.status(200).json(req.user)
  })

  router.get("/login/failed", (req, res) => {
    res.status(401).json({
      success: false,
      message: "user failed to authenticate."
    })
  })

  router.get('/local', passport.authenticate('local-login', {session: false}),
    (req, res) => {
      if(req.user)
        res.status(200).json(req.user)
      else 
        res.status(400).json('Fail Bruh')
    }
  )

  router.get('/facebook',passport.authenticate('facebook', { scope:'email' }))
  
  router.get('/google',passport.authenticate('google', { scope: ['profile', 'email'] }))

	router.get(
    '/facebook/callback',
    passport.authenticate('facebook',  {session: false}),
    (req, res) => {
      if(req.user)
        res.status(200).json(req.user)
      else 
        res.status(400).json('Fail Bruh')
    }
  )

  router.get(
    "/google/redirect",
    passport.authenticate("google",  {session: false}),
    (req, res) => {
      if(req.user)
        res.status(200).json(req.user)
      else 
        res.status(400).json('Fail Bruh')
    }
  )

  router.get('/logout', function(req, res){
	  req.logout()
	  res.status(200).json('success')
	})

  router.get('/check', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json(req.user)
  })

  return router;    
})()
