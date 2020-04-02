const User = require('../models/user')
const config = require('../config')
// Dependencies
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')

//Create local Strategy
const localOptions = {
  usernameField: 'email'
}

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  console.log(email)
// Verify username and pw, call done with user if correct information
  User.findOne({ email }, (err, user) => {
    if (err) {return done(err)}
    if (!user) {return done(null, false)}

  //  compare passwords
  user.comparePassword(password, function(err, isMatch) {
    if (err) {return done(err)}
    if (!isMatch) {return done(null, false)}

    return done(null, user)
   })
  })
// Else call done with false
})

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}

//Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
// See if user id in payload exists in db
// If yes, call done with user object
// If no call done without a user object
  User.findById(payload.sub, (err, user) => {
    if (err) {
      return done(err, false)
    }

    user ? done(null, user) : done(null, false)
  })
})

//Tell Passport to use this stratgey
passport.use(jwtLogin)
passport.use(localLogin)