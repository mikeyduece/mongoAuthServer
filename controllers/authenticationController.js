const jwt = require('jwt-simple')
const config = require('../config')
const User = require('../models/user')

const tokenForUser = user => {
  const timestamp = new Date().getTime()
  // sub is convention for subject - who does this token belong to
  // iat is convention for issued at time
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signin = (req, res, next) => {
//  User has already had their email/pw auth'd
//  we just need to return a token
  res.send({ token: tokenForUser(req.user) })
}

exports.signup = (req, res, next) => {
  const { email, password } = req.body.user

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' })
  }

  User.findOne({ email }, (err, existingUser) => {
    if (err) {
      return next(err)
    }

    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' })
    }

    const user = new User({ email, password })
    user.save(err => {
      if (err) {
        return next(err)
      }
      // Respond indicating user was created
      res.json({ token: tokenForUser(user) })
    })
  })
}