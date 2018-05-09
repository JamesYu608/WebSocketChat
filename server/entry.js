const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')

const WebSocketServer = require('websocket').server

const http = require('http')
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
const server = http.createServer(app)
server.listen(port, () => console.log(`Server is running on port: ${port}`))

// Create the WebSocket server
const wsServer = new WebSocketServer({
  httpServer: server
})

wsServer.on('request', request => {
  const connection = request.accept(null, request.orient)

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', message => {
    if (message.type === 'utf8') {
      // process WebSocket message
    }
  })

  connection.on('close', connection => {
    // close user connection
  })
})
