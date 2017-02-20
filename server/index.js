import express from 'express'
import chalk from 'chalk'
import passport from 'passport'
import session from 'express-session'
import { CLIENT_ID, CLIENT_SECRET } from '../secret'
import { Strategy as SpotifyStrategy } from 'passport-spotify'
import morgan from 'morgan'

console.log(chalk.yellow(`Express is spinning up`))
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((obj, done) => done(null, obj))

passport.use(new SpotifyStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/callback',
},
(accessToken, refreshToken, profile, done) => {
  process.nextTick(_ => {
    // user profile is returned to represent logged-in user
    // TODO: return user record associated with user profile from DB instead.
    return done(null, profile)
  })
}
))

const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/')
}

const app = express()

app.use(session({ secret: 'keyboard cat' }))
app.use(passport.initialize())
app.use(passport.session())
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('Hello! Login by visiting /auth/spotify')
})

app.get('/fail', (req, res) => {
  res.send('Login failed!')
})

app.get('/account', checkAuth, (req, res) => {
  res.send({ user: req.user, session: req.session })
})

app.use('/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private'],
    showDialog: true,
  }), () => {} // will be redirected to spotify for authen, so this function won't be called
)

app.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/fail' }),
  (req, res) => {
    // console.log(res)
    res.redirect('/account')
  }
)

app.get('/logout', (req, res) => {
  req.logout()
  res.send('you successfully logged out')
  // res.redirect('/')
})

app.listen(3000, () => {
  console.log(chalk.green(`Express is running, listening on port 3000`))
})
