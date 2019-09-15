const express = require('express')
const ffmpeg = require('fluent-ffmpeg');
const WebSocket = require('ws');

// Config
const PORT_SERVER = 8080;
const PORT_WS = 8082;

// Start websocket relay
const ws_server = new WebSocket.Server({port: PORT_WS, perMessageDeflate: false});

// ffmpeg
const ff_command = ffmpeg()
  .input('/dev/video0')
  .inputFormat('v4l2')
  .inputFPS(25)
  .inputOptions('-video_size 640x480')
  .noAudio()
  .outputFormat('mpegts')
  .videoCodec('mpeg1video')
  .videoBitrate('1000k')
  .size('640x480')
  .outputOptions('-bf 0')

let ff_stream = ff_command.pipe();
ff_stream.on('data', function(chunk) {
  ws_server.clients.forEach(function each(client) {
    if (client !== ws_server && client.readyState === WebSocket.OPEN) {
      client.send(chunk);
    }
  });
})

// Serve static files
const app = express();

const options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['html'],
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}
app.use(express.static('src', options));
app.get('/jsmpeg.min.js', function(req, res) {
    res.sendFile(__dirname + '/jsmpeg/jsmpeg.min.js');
});

app.listen(PORT_SERVER);
