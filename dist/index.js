'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _passportSpotify = require('passport-spotify');

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require('path');

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _spotifyWebApiNode = require('spotify-web-api-node');

var _spotifyWebApiNode2 = _interopRequireDefault(_spotifyWebApiNode);

var _fetchUtils = require('../utils/fetchUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();


var environment = process.env.NODE_ENV || 'development';
var app = (0, _express2.default)();

if (environment === 'development') {
  var morgan = require('morgan');
  app.use(morgan('dev'));
  var webpack = require('webpack');
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var config = require('../webpack.config.js');
  var compiler = webpack(config);

  app.use(webpackHotMiddleware(compiler));

  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    },
    inline: true,
    noInfo: true
  }));
}

app.use(_express2.default.static((0, _path.resolve)(__dirname, '../public')));

app.set('port', process.env.PORT || 3000);

var spotifyApi = new _spotifyWebApiNode2.default({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/api/callback'
});

_passport2.default.serializeUser(function (user, done) {
  return done(null, user);
});
_passport2.default.deserializeUser(function (obj, done) {
  return done(null, obj);
});

_passport2.default.use(new _passportSpotify.Strategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/callback'
}, function (accessToken, refreshToken, profile, done) {
  process.nextTick(function (_) {
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);
    // user profile is returned to represent logged-in user
    // TODO: return user record associated with user profile from DB instead
    return done(null, profile);
  });
}));

var getRefreshedToken = function getRefreshedToken(req, res, next) {
  spotifyApi.refreshAccessToken().then(function (data) {
    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
    next();
  }, function (err) {
    console.error(_chalk2.default.red('Could not refresh access token: ', err));
    next();
  });
};

var checkAuth = function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

app.use((0, _cors2.default)());
app.options('*', (0, _cors2.default)());
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
// app.use(getRefreshedToken)
app.use((0, _expressSession2.default)({ secret: 'keyboard cat' }));
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());

app.get('/api/me', function (req, res) {
  spotifyApi.getMe().then(function (data) {
    // data is an object with body, headers, and statusCode
    res.send(data);
  }, function (err) {
    console.error(_chalk2.default.red('err', err));
    res.status(err.statusCode).json(err);
  });
});

app.get('/api', function (req, res) {
  res.send('Hello! Login by visiting /auth/spotify');
});

app.get('/api/tracks/:userId/:playlistId/:offset/:limit', function (req, res) {
  spotifyApi.getPlaylistTracks('' + req.params.userId, '' + req.params.playlistId, {
    offset: '' + req.params.offset,
    limit: '' + req.params.limit
  }).then(function (data) {
    return res.status(200).json(data.body);
  }, function (err) {
    console.error(_chalk2.default.red('error in GET /api/tracks/:userId/:playlistId/:offset/:limit', _util2.default.inspect(err)));
    res.status(500).json(err);
  });
});

app.get('/api/get_playlists', function (req, res) {
  var _req$query = req.query,
      offset = _req$query.offset,
      limit = _req$query.limit;

  (0, _isomorphicFetch2.default)('https://api.spotify.com/v1/me/playlists?offset=' + offset + '&limit=' + limit, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + spotifyApi.getAccessToken()
    }
  }).then(_fetchUtils.checkStatus).then(_fetchUtils.parseJSON).then(function (response) {
    res.status(200).json(response);
  }).catch(function (err) {
    console.error(_chalk2.default.red('error in GET /api/get_playlists', _util2.default.inspect(err)));
    res.json(err);
  });
});

app.get('/api/audiofeatures/:trackId', function (req, res) {
  return spotifyApi.getAudioFeaturesForTrack(req.params.trackId).then(function (data) {
    return res.json(data.body);
  }, function (err) {
    console.error(_chalk2.default.red('error in GET /api/audiofeatures/:trackId', _util2.default.inspect(err)));
    res.json(err);
  });
});

app.get('/api/fail', function (req, res) {
  res.send('Login failed!');
});

app.get('/api/account', checkAuth, function (req, res) {
  res.send({ user: req.user, session: req.session });
});

app.use('/api/auth/spotify', _passport2.default.authenticate('spotify', {
  session: false,
  scope: ['user-read-email', 'playlist-modify-private', 'user-read-private', 'playlist-read-private', 'user-library-read'],
  showDialog: true
}), function () {} // will be redirected to spotify for authen,
// so this function won't be called
);

app.get('/api/callback', _passport2.default.authenticate('spotify', { failureRedirect: '/fail' }), function (req, res) {
  res.redirect('/playlists');
});

app.get('/api/logout', function (req, res) {
  req.logout();
  spotifyApi.resetAccessToken();
  spotifyApi.resetRefreshToken();
  res.redirect('/playlists');
});

app.post('/api/playlists', function (req, res) {
  var name = req.body.name;
  (0, _isomorphicFetch2.default)('https://api.spotify.com/v1/users/' + req.user.id + '/playlists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + spotifyApi.getAccessToken()
    },
    body: JSON.stringify({
      name: name,
      public: false,
      collaborative: false
    })
  }).then(_fetchUtils.checkStatus).then(_fetchUtils.parseJSON).then(function (response) {
    res.status(200).json(response);
  }).catch(function (err) {
    _chalk2.default.red('error in POST /api/new', _util2.default.inspect(err));
    res.json(err);
  });
});

app.post('/api/add', function (req, res) {
  var href = req.body.href;
  var uris = req.body.uris;
  (0, _isomorphicFetch2.default)(href + '/tracks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + spotifyApi.getAccessToken()
    },
    body: JSON.stringify({
      uris: uris
    })
  }).then(_fetchUtils.checkStatus).then(_fetchUtils.parseJSON).then(function (payload) {
    res.status(200).json(payload);
  }).catch(function (err) {
    _chalk2.default.red('error in POST /api/add', _util2.default.inspect(err));
    res.status(err.response.status).json(err.response);
  });
});

app.get('*', function (request, response) {
  response.sendFile((0, _path.resolve)(__dirname, '..', 'public', 'index.html'));
});

if (!module.parent) {
  app.listen(app.get('port'), function () {
    console.log('Express running on ' + app.get('port') + '.');
  });
}