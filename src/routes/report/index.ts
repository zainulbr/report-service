import { CommonRoutesConfig } from '../common'
import reportController from './controller'
import reportMiddleware from './middleware'
import express from 'express'
import { body } from 'express-validator'

export class ReportRoutes extends CommonRoutesConfig {
  name: string
  constructor(app: express.Application, baseApi: string) {
    super(app, baseApi, 'report')
  }

  configureRoutes() {
    // generate report
    this.app.post(
      this.api,
      body('payload').notEmpty().isObject(),
      body('templateId').notEmpty().isString(),
      reportMiddleware.validateRequest,
      reportController.generateReport,
    )

    // dispatch reportId
    this.app.param('reportId', reportMiddleware.extractReportId)
    this.app.get(
      this.api + '/:reportId',
      body('reportId').notEmpty(),
      reportController.getReport,
    )

    return this.app
  }
}
