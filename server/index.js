require('dotenv').config()
import express from 'express'
import chalk from 'chalk'
import passport from 'passport'
import session from 'express-session'
import { Strategy as SpotifyStrategy } from 'passport-spotify'
import cors from 'cors'
import fetch from 'isomorphic-fetch'
import bodyParser from 'body-parser'
import { resolve } from 'path'
import util from 'util'
import SpotifyWebApi from 'spotify-web-api-node'
import { checkStatus, parseJSON } from '../utils/fetchUtils'

const environment = process.env.NODE_ENV || 'development'
const app = express()

if (environment === 'development') {
  const morgan = require('morgan')
  app.use(morgan('dev'))
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const config = require('../webpack.config.js')
  const compiler = webpack(config)

  app.use(webpackHotMiddleware(compiler))

  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
    },
    inline: true,
    noInfo: true,
  }))
}

app.use(express.static(resolve(__dirname, '../public')))

app.set('port', process.env.PORT || 3000)

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: '/api/callback',
})

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((obj, done) => done(null, obj))

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: '/api/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(_ => {
        spotifyApi.setAccessToken(accessToken)
        spotifyApi.setRefreshToken(refreshToken)
        // user profile is returned to represent logged-in user
        // TODO: return user record associated with user profile from DB instead
        return done(null, profile)
      })
    }
  )
)

const getRefreshedToken = (req, res, next) => {
  spotifyApi.refreshAccessToken().then(
    data => {
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token'])
      next()
    },
    err => {
      console.error(chalk.red('Could not refresh access token: ', err))
      next()
    }
  )
}

const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

app.use(cors())
app.options('*', cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(getRefreshedToken)
app.use(session({ secret: 'keyboard cat' }))
app.use(passport.initialize())
app.use(passport.session())

app.get('/api/me', (req, res) => {
  spotifyApi.getMe().then(
    data => {
      // data is an object with body, headers, and statusCode
      res.send(data)
    },
    err => {
      console.error(chalk.red('err', err))
      res.status(err.statusCode).json(err)
    }
  )
})

app.get('/api', (req, res) => {
  res.send('Hello! Login by visiting /auth/spotify')
})

app.get('/api/tracks/:userId/:playlistId/:offset/:limit', (req, res) => {
  spotifyApi
    .getPlaylistTracks(`${req.params.userId}`, `${req.params.playlistId}`, {
      offset: `${req.params.offset}`,
      limit: `${req.params.limit}`,
    })
    .then(
      data => res.status(200).json(data.body),
      err => {
        console.error(
          chalk.red(
            'error in GET /api/tracks/:userId/:playlistId/:offset/:limit',
            util.inspect(err)
          )
        )
        res.status(500).json(err)
      }
    )
})

app.get('/api/get_playlists', (req, res) => {
  const { offset, limit } = req.query
  fetch(
    `https://api.spotify.com/v1/me/playlists?offset=${offset}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + spotifyApi.getAccessToken(),
      },
    }
  )
    .then(checkStatus)
    .then(parseJSON)
    .then(response => {
      res.status(200).json(response)
    })
    .catch(err => {
      console.error(
        chalk.red('error in GET /api/get_playlists', util.inspect(err))
      )
      res.json(err)
    })
})

app.get('/api/audiofeatures/:trackId', (req, res) =>
  spotifyApi.getAudioFeaturesForTrack(req.params.trackId).then(
    data => res.json(data.body),
    err => {
      console.error(
        chalk.red('error in GET /api/audiofeatures/:trackId', util.inspect(err))
      )
      res.json(err)
    }
  )
)

app.get('/api/fail', (req, res) => {
  res.send('Login failed!')
})

app.get('/api/account', checkAuth, (req, res) => {
  res.send({ user: req.user, session: req.session })
})

app.use(
  '/api/auth/spotify',
  passport.authenticate('spotify', {
    session: false,
    scope: [
      'user-read-email',
      'playlist-modify-private',
      'user-read-private',
      'playlist-read-private',
      'user-library-read',
    ],
    showDialog: true,
  }),
  () => {} // will be redirected to spotify for authen,
           // so this function won't be called
)

app.get(
  '/api/callback',
  passport.authenticate('spotify', { failureRedirect: '/fail' }),
  (req, res) => {
    res.redirect(`/playlists`)
  }
)

app.get('/api/logout', (req, res) => {
  req.logout()
  spotifyApi.resetAccessToken()
  spotifyApi.resetRefreshToken()
  res.redirect(`/playlists`)
})

app.post('/api/playlists', (req, res) => {
  const name = req.body.name
  fetch(`https://api.spotify.com/v1/users/${req.user.id}/playlists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + spotifyApi.getAccessToken(),
    },
    body: JSON.stringify({
      name,
      public: false,
      collaborative: false,
    }),
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(response => {
      res.status(200).json(response)
    })
    .catch(err => {
      chalk.red('error in POST /api/new', util.inspect(err))
      res.json(err)
    })
})

app.post('/api/add', (req, res) => {
  const href = req.body.href
  const uris = req.body.uris
  fetch(`${href}/tracks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + spotifyApi.getAccessToken(),
    },
    body: JSON.stringify({
      uris,
    }),
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(payload => {
      res.status(200).json(payload)
    })
    .catch(err => {
      chalk.red('error in POST /api/add', util.inspect(err))
      res.status(err.response.status).json(err.response)
    })
})

app.get('*', function (request, response) {
  response.sendFile(resolve(__dirname, '..', 'public', 'index.html'))
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`Express running on ${app.get('port')}.`)
  })
}
