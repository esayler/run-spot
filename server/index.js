console.log(chalk.yellow(`Express is spinning up`))

import express from 'express'
import chalk from 'chalk'

const app = express()

app.use('/', (req, res) => {
  res.send('lol')
})

app.listen(3000, () => {
  console.log(chalk.green(`Express is running, listening on port 3000`))
})
