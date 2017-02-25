import express from 'express'
import chalk from 'chalk'
import passport from 'passport'
import session from 'express-session'
import { CLIENT_ID, CLIENT_SECRET } from '../secret'
import { Strategy as SpotifyStrategy } from 'passport-spotify'
import morgan from 'morgan'
import cors from 'cors'
// const api = require('./api')

import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import historyApiFallback from 'connect-history-api-fallback'
import webpackConfig from '../webpack.config.js'
const { resolve } = require('path')

import util from 'util'

import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/api/callback',
})

console.log(chalk.yellow(`Express is spinning up`))
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((obj, done) => done(null, obj))

passport.use(new SpotifyStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/callback',
},
(accessToken, refreshToken, profile, done) => {
  process.nextTick(_ => {
    spotifyApi.setAccessToken(accessToken)
    spotifyApi.setRefreshToken(refreshToken)
    // user profile is returned to represent logged-in user
    // TODO: return user record associated with user profile from DB instead.
    console.log('The credentials are ' + util.inspect(spotifyApi.getCredentials()))
    return done(null, profile)
  })
}
))

const getRefreshedToken = (req, res, next) => {
  spotifyApi.refreshAccessToken()
    .then(data => {
      console.log('The access token has been refreshed!')
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token'])
      next()
    }, err => {
      console.log('Could not refresh access token', err)
      next()
    })
}

const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/')
}

const app = express()
app.use(cors())
app.options('*', cors())
// app.use(getRefreshedToken)
app.use(session({ secret: 'keyboard cat' }))
app.use(passport.initialize())
app.use(passport.session())
app.use(morgan('dev'))

// app.use('/api', api)

app.get('/api/me', (req, res) => {
  spotifyApi.getMe()
    .then(function (data) {
      res.send(data)
    }, function (err) {
      console.log('Something went wrong!', err)
    })
})

app.get('/api', (req, res) => {
  res.send('Hello! Login by visiting /auth/spotify')
})

app.get('/api/tracks/:userId/:playlistId', (req, res) => {
  spotifyApi.getPlaylistTracks(`${req.params.userId}`, `${req.params.playlistId}`, { 'offset': 0, 'limit': 20, 'fields': 'items' })
    .then(data => res.json(data.body),
    err => console.log('Something went wrong!', util.inspect(err)))
})

app.get('/api/playlists', (req, res) => spotifyApi.getUserPlaylists(req.user.id)
  .then(data => res.json(data.body),
    err => console.log('Something went wrong!', util.inspect(err))
))

app.get('/api/fail', (req, res) => {
  res.send('Login failed!')
})

app.get('/api/account', checkAuth, (req, res) => {
  res.send({ user: req.user, session: req.session })
})

app.use('/api/auth/spotify',
  passport.authenticate('spotify', {
    scope: [
      'user-read-email',
      'user-read-private',
      'playlist-read-private',
      'user-library-read',
    ],
    showDialog: true,
  }), () => {} // will be redirected to spotify for authen, so this function won't be called
)

app.get('/api/callback',
  passport.authenticate('spotify', { failureRedirect: '/fail' }),
  (req, res) => {
    res.redirect(`http://localhost:8000/playlists`)
  }
)

app.get('/api/logout', (req, res) => {
  req.logout()
  res.send('you successfully logged out')
})

app.listen(3000, () => {
  console.log(chalk.green(`Express is running, listening on port 3000`))
})

const reactServer = new WebpackDevServer(webpack(webpackConfig), {
  contentBase: '/',
  proxy: {
    '/api': `http://localhost:3000`,
  },
  stats: {
    colors: true,
  },
  hot: true,
  historyApiFallback: true,
})

reactServer.use('/', express.static(resolve(__dirname, '../public')))

reactServer.listen(8000, () => console.log(chalk.green(`React is listening on port 8000`)));
