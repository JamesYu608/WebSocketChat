const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

const apiRouter = require('./routes/api')

app.use(morgan('combined'))
app.use(bodyParser.json())

// Server routing
app.use('/api', apiRouter)

if (process.env.NODE_ENV !== 'production') {
  const webpackMiddleware = require('webpack-dev-middleware')
  const webpack = require('webpack')
  const webpackConfig = require('../webpack.config')
  app.use(webpackMiddleware(webpack(webpackConfig)))
} else {
  app.use(express.static(path.resolve(__dirname, '../client/build')))
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../client/build/index.html')))
}

const port = process.env.PORT || 8050
app.listen(port, () => console.log(`Server is running on port: ${port}`))
