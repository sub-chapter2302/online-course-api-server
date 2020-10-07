const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStratery = require("passport-google-oauth").OAuth2Strategy
const localStrategy = require('passport-local').Strategy
const User = require('../model/user')
const JWTStrategy = require("passport-jwt").Strategy
const ExtractJWT = require("passport-jwt").ExtractJwt
const jwt = require('jsonwebtoken')

require('dotenv').config()
module.exports = (function() {
    // JWT
    passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'ChuBeSecret'
    }, (jwt_payload, done) => {
      User.findById(jwt_payload.id).then(user => {
        return done(null, user)
      }).catch(err => {
        return done(err, false)
      })
    }))

    passport.use('local-login', new localStrategy({
          usernameField: 'email',
          passwordField: 'password'
        },
        (email, password, done) => { 
          User.findOne({'authenticateMethod.local.email': email}, (err, user) => {
            if(err) done(err)
            if(user) {
              if(user.authenticateMethod.local.password == password) {
                const data = {
                  fullName: user.fullName,
                  email: user.authenticateMethod.local.email,
                  photoUser: user.photoUser,
                  token: jwt.sign({id: user._id}, 'Secret')
                }
                return done(null, data)
              }
              else done(null, false)
            }
            else done(null, false)
          })
        }
    ))

  passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:4000/auth/facebook/callback"
    },
    async (token, tokenSecret, profile, done) => {
      User.findOne({'authenticateMethod.facebook.id': profile.id}, (err, user) => {
        if (err) return done(err)
        if (user) {
            const data = {
                fullName: user.fullName,
                photoUser: user.photoUser,
                token: jwt.sign({id: user._id}, 'Secret')
            }
            return done(null, data)
        }
        else {
          console.log(profile)
          let newUser = new User();
          newUser.fullName = profile.displayName
          newUser.authenticateMethod.facebook.name = profile.displayName
          return done(null, newUser)
        }
      })
    }
  ))

  passport.use(
    new GoogleStratery(
      {
        clientID: process.env.GOOGLE_APP_ID,
        clientSecret: process.env.GOOGLE_APP_SECRET,
        callbackURL:"http://localhost:4000/auth/google/redirect"
      },
      async (token, tokenSecret, profile, done) => {
        User.findOne({'authenticateMethod.google.id': profile.id}, (err, user) => {
          if (err) return done(err)
          if (user) {
            const data = {
                fullName: user.fullName,
                photoUser: user.photoUser,
                token: jwt.sign({id: user._id}, 'Secret')
            }
            return done(null, user)
          }
          else {
            var newUser = new User();
            newUser.fullName = profile.displayName
            newUser.authenticateMethod.google.id = profile.id
            newUser.authenticateMethod.google.name = profile.displayName
            done(null, newUser)
          }
        })
      }
    )
  )

  return passport
})()




