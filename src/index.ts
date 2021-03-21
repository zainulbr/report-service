import './init'
import { CommonRoutesConfig } from './routes/common'
import { ReportRoutes } from './routes/report'
import CommonMiddleware from './routes/common/middleware'
import express from 'express'
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import Configuration from './helper/configuration/index'

const port = process.env.PORT || 3000
const apiVersion = process.env.API_VERSION || '/api/v1'

const app = express()

const routes: Array<CommonRoutesConfig> = []

// global middleware
// set middleware json parser
app.use(express.json())

// here we are adding middleware to allow cross-origin requests
app.use(cors())

// gzip compression
app.use(compression())

// can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
app.use(helmet())

// token validation
app.use(CommonMiddleware.validateToken(Configuration.HookTokenURL))

// register routes
routes.push(new ReportRoutes(app, apiVersion))

console.log(Configuration)

const server = app.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    console.log(`Routes configured for ${route.getName()}`)
  })
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
