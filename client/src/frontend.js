// if user is running mozilla then use it's built-in WebSocket
const WebSocket = window.WebSocket || window.MozWebSocket

const connection = new WebSocket('ws://localhost:8050')

connection.onopen = function () {
  // connection is opened and ready to use
}

connection.onerror = function (error) {
  // an error occurred when sending/receiving data
}

connection.onmessage = function (message) {
  // try to decode json (assume that each message from server is json)
  try {
    const json = JSON.parse(message.data)
  } catch (e) {
    console.log('This doesn\'t look like a valid JSON: ', message.data)
  }
  // handle incoming message
}
