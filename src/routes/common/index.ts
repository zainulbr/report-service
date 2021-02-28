import express from 'express'
import path from 'path'
export abstract class CommonRoutesConfig {
  app: express.Application
  name: string
  baseApi: string
  api: string

  constructor(app: express.Application, baseApi: string, name: string) {
    this.app = app
    this.name = name
    this.baseApi = baseApi
    this.api = path.join(this.baseApi, this.name)
    this.configureRoutes()
  }

  getName() {
    return this.name
  }

  abstract configureRoutes(): express.Application
}
