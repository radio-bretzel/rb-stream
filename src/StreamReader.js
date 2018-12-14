const https = require('https');
const EventEmitter = require('events')

module.exports = class StreamReader extends EventEmitter {
  constructor(URL_TO_STREAM) {
    super()
    
    this.URL_TO_STREAM = URL_TO_STREAM
  }

  startReading () {
    https.get(this.URL_TO_STREAM, (res) => {

      res.on('data', (chunk) => {
        this.emit('data', chunk)
      });

    })
  }


}