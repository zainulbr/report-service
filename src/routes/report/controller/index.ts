import express from 'express'
import ReportService from '../../../libs/report'
import debug from 'debug'
import axios from 'axios'
import { getTokenFromRequest } from '../../../helper/token/index'
import fs from 'fs'
const log: debug.IDebugger = debug('app:report-controller')

class Controller {
  async generateReport(req: express.Request, res: express.Response) {
    log('generate reprot')
    // Finds the validation errors in this request and wraps them in an object with handy functions
    try {
      let data = req.body.payload
      const templateName = req.body.templateId

      if (req.body.url) {
        const token = getTokenFromRequest(req)
        const resp = await axios.get(req.body.url, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
        if (resp.status >= 400) {
          return res.status(400).json(resp.data)
        }
        data = resp.data
      }
      const outputId = req.body.outputId
        ? req.body.outputId
        : String(new Date().getTime()) + '-' + templateName

      //
      if (fs.existsSync(ReportService().Resolve(outputId))) {
        res.status(200).send(outputId)
        return
      }

      await ReportService().Generate(data, templateName, outputId)

      res.status(200).send(outputId)
    } catch (error) {
      console.log(error)
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
      const absoluteReportPath = ReportService().Resolve(req.body.reportId)
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
