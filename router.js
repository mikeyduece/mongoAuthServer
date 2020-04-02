const AuthenticationController = require('./controllers/authenticationController')
const passportService = require('./services/passport')
const passport = require('passport')

const requireAuth = passport.authenticate(
  'jwt',
  { session: false }
)

const requireSignIn = passport.authenticate(
  'local',
  { session: false }
)

module.exports = app => {
  app.get('/', requireAuth, (req, res) => {
    res.send({ hi: 'there' })
  })
  app.post('/signin', requireSignIn, AuthenticationController.signin)
  app.post('/signup', AuthenticationController.signup)
}