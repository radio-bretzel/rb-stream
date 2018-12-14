const StreamReader = require('./services/StreamReader')
const express = require('express')
const bodyParser = require('body-parser')

console.log('# Welcome on RadioBretzel ! #')

var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(8001)

console.log('Server running on port 8001')


let data = {
  teams: []
}

// TEAMS

app.get('/teams', function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(data.teams))
})

app.get('/teams/:name', function (req, res) {

  let team = data.teams.find(team => {
    return team.name === req.params.name
  })

  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(team))
})

app.post('/teams', function (req, res) {

  let team = {
    name: req.body.name,
    channels: []
  }

  data.teams.push(team)

  console.log('Team added')

  res.status(201).send()
})

app.put('/teams/:name', function (req, res) {
  let team = data.teams.find(team => {
    return team.name === req.params.name
  })

  team.name = req.body.name

  console.log('Team updated')

  res.status(200).send()
})

app.delete('/teams/:name', function (req, res) {
  let teamIndex = data.teams.findIndex(team => {
    return team.name === req.params.name
  })

  data.teams.splice(teamIndex, 1)
  console.log('Team deleted')

  res.status(200).send()
})


// STREAMS

app.get('/teams/:team/channels', function (req, res) {

  let team = data.teams.find(team => {
    return team.name === req.params.team
  })

  let channels = team.channels.map(channel => {
    return channel.name
  })

  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(channels))
})

app.get('/teams/:team/channels/:name', function (req, res) {

  let team = data.teams.find(team => {
    return team.name === req.params.team
  })

  let channel = team.channels.find(channel => {
    return channel.name === req.params.name
  })

  res.writeHead(200, {
    "Content-Type": "audio/mpeg",
    'Transfer-Encoding': 'chunked'
  })

  channel.clients.push(res)
  console.log('Client connected to channel ' + channel.name)
})

app.post('/teams/:team/channels', function (req, res) {
  let team = data.teams.find(team => {
    return team.name === req.params.team
  })

  let channel = {
    name: req.body.name,
    source: req.body.source,
    stream: new StreamReader(req.body.source),
    clients: []
  }
  
  channel.stream.startReading()
  
  channel.stream.on('data', function (chunk) {
    if (channel.clients.length > 0) {
      for (client in channel.clients) {
        channel.clients[client].write(chunk);
      }
    }
  })

  team.channels.push(channel)
  
  console.log('Channel added')

  res.status(201).send()
})

app.put('/teams/:team/channels/:name', function (req, res) {
  let team = data.teams.find(team => {
    return team.name === req.params.team
  })

  let channel = team.channels.find(channel => {
    return channel.name === req.params.name
  })

  channel.name = req.body.name

  console.log('Channel updated')

  res.status(200).send()
})

app.delete('/teams/:team/channels/:name', function (req, res) {
  let team = data.teams.find(team => {
    return team.name === req.params.team
  })

  let channelIndex = team.channels.findIndex(channel => {
    return channel.name === req.params.name
  })

  team.channels.splice(channelIndex, 1)
  console.log('Channel deleted')

  res.status(200).send()
})