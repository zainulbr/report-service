// import routes from './routes'
// import path from 'path'
const port = process.env.PORT || 3000
// const apiVersion = process.env.API_VERSION || '/api/v1'

const express = require('express')

const app = express()

// global middleware
// set middleware json parser
app.use(express.json())

app.get('/', (req, res) => res.json({ ping: true }))

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

process.on('SIGTERM', shutDown)
process.on('SIGINT', shutDown)

let connections = []

server.on('connection', (connection) => {
  connections.push(connection)
  connection.on(
    'close',
    () => (connections = connections.filter((curr) => curr !== connection)),
  )
})

function shutDown() {
  console.log('Received kill signal, shutting down gracefully')
  server.close(() => {
    console.log('Closed out remaining connections')
    process.exit(0)
  })

  setTimeout(() => {
    console.error(
      'Could not close connections in time, forcefully shutting down',
    )
    process.exit(1)
  }, 10000)

  connections.forEach((curr) => curr.end())
  setTimeout(() => connections.forEach((curr) => curr.destroy()), 5000)
}
