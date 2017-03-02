# Run Spot

## :boom: Overview

A React.js app to organize/sort your [Spotify](https://www.spotify.com/) :musical_note: playlists for running based on track BPM.

## :sparkles: Features

- _React/Redux, Webpack 2, React Router 4 (beta), Sass, Express 4_
- _Testing using Karma with Mocha/Chai/Enzyme/Sinon_

## :fire: TODO:
- [ ] Switch to `isomorphic-fetch`
- [ ] Prepare backend for deployment
- [ ] Add backend session store
- [ ] backend Cache
- [ ] Add backend db


## :wrench: Installation (MacOS):
- install `yarn` if you don't already have it: [yarn installation instructions](https://yarnpkg.com/en/docs/getting-started)
- then run:
```shell
yarn
```

## :tada: Usage:
### to start the development server
```shell
yarn serve
```
- then navigate to [http://localhost:8000/](http://localhost:8000/)
- saved changes should rebuild and be hot swapped - no need to refresh browser

### to start the test runner
```shell
yarn test
```
- karma will start listening to file changes and run tests automatically on file changes
