const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')
const WebSocketServer = require('websocket').server
const http = require('http')
const app = express()
const apiRouter = require('./routes/api')

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat'

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
server.listen(port, () => console.log(`[${new Date()}] Server is running on port: ${port}`))

// Create the WebSocket server
const wsServer = new WebSocketServer({
  // WebSocket server is tied to a HTTP server. WebSocket
  // request is just an enhanced HTTP request.
  httpServer: server
})

/**
 * Global variables
 */
// latest 100 messages
let history = []
// list of currently connected clients (users)
const clients = []

/**
 * Helper function for escaping input strings
 */
function htmlEntities (str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// Array with some colors
const colors = ['red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange']

wsServer.on('request', request => {
  console.log(`[${new Date()}] Connection from origin: ${request.origin}`)
  // Accept connection - you should check 'request.origin' to
  // make sure that client is connecting from your website (same origin policy)
  const connection = request.accept(null, request.orient)
  // We need to know client index to remove them on 'close' event
  const index = clients.push(connection) - 1
  let userName = false
  let userColor = false
  console.log(`${new Date()} Connection accepted`)

  // Send back chat history
  if (history.length > 0) {
    connection.sendUTF(
      JSON.stringify({type: 'history', data: history})
    )
  }

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', message => {
    if (message.type === 'utf8') { // accept only text
      // process WebSocket message
      if (!userName) { // first message sent by user is their name
        // remember user name
        userName = htmlEntities(message.utf8Data)
        // get random color and send it back to the user
        userColor = colors.shift()
        connection.sendUTF(
          JSON.stringify({type: 'color', data: userColor})
        )
        console.log(`[${new Date()}] User is known as: ${userName} with ${userColor} color`)
      } else { // log and broadcast the message
        console.log(`[${new Date()}] Received Message from ${userName}: ${message.utf8Data}`)

        // we want to keep history of all sent messages
        const obj = {
          time: (new Date()).getTime(),
          text: htmlEntities(message.utf8Data),
          author: userName,
          color: userColor
        }
        history.push(obj)
        history = history.slice(-100)
        // broadcast message to all connected clients
        const json = JSON.stringify({type: 'message', data: obj})
        for (let i = 0; i < clients.length; i++) {
          clients[i].sendUTF(json)
        }
      }
    }
  })

  connection.on('close', connection => {
    // close user connection
    if (userName !== false && userColor !== false) {
      console.log(`[${new Date()} Peer ${connection.remoteAddress} disconnected]`)
      // remove user from the list of connected clients
      clients.splice(index, 1)
      // push back user's color to be reused by another user
      colors.push(userColor)
    }
  })
})
