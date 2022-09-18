const socket = require("socket.io")

let _io;

const setIO = (server) => {
    _io = socket(server, {
        cors : {
          origin : "*",
          headers : {
            "Access-Control-Allow-Origin" : "*"
          }
        },
        allowEIO3: true,
      })
      return _io
}

const getIO = () => {
    return _io
}

module.exports = {
    getIO,
    setIO
}