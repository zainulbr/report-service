import express from 'express'
import ReportService from '../../../libs/report'

import debug from 'debug'

const log: debug.IDebugger = debug('app:report-controller')

class Controller {
  async generateReport(req: express.Request, res: express.Response) {
    log('generate reprot')
    // Finds the validation errors in this request and wraps them in an object with handy functions
    try {
      const data = req.body.payload
      const templateName = req.body.templateId
      const outputId = String(new Date().getTime()) + '-' + templateName
      await ReportService.Generate(data, templateName, outputId)
      log('genReport')

      res.status(200).send(outputId)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  async uploadTemplate(req: express.Request, res: express.Response) {
    // TBD
    res.status(200).send(``)
  }

  async getReport(req: express.Request, res: express.Response) {
    try {
      log('get reprot')
      const absoluteReportPath = ReportService.Resolve(req.body.reportId)
      res.download(absoluteReportPath)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  async checkStatus(req: express.Request, res: express.Response) {
    // TBD
    res.status(200).send(``)
  }
}

export default new Controller()
