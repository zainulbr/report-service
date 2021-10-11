import express from 'express'
import ReportService, { SelectService } from '../../../libs/report'
import { SERVICE_CARBONE, SERVICE_DOCX } from '../../../libs/report/abstract'
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
      let data = {}
      const templateName = req.body.templateId as string

      if (req.body.isContainsImage) SelectService(SERVICE_DOCX)
      else SelectService(SERVICE_CARBONE)

      // validate template
      if (!ReportService().TemplateExists(templateName)) {
        res.status(400).send('Template not found')
        return
      }

      // generate file name
      const outputId = req.body.outputId
        ? req.body.outputId
        : String(new Date().getTime()) + '-' + templateName
      console.log(outputId)

      // get cached by output name
      if (fs.existsSync(ReportService().Resolve(outputId))) {
        console.log('get from cache')
        res.status(200).send(outputId)
        return
      }

      // request template data
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

      // generate report
      const responseFileName = await ReportService().Generate(
        data,
        templateName,
        outputId,
        req.body?.opts || {},
      )

      res.status(200).send(responseFileName)
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

  async reportExists(req: express.Request, res: express.Response) {
    try {
      log('check report')
      const absoluteReportPath = ReportService().Resolve(req.body.reportId)
      if (fs.existsSync(absoluteReportPath)) {
        res.status(200).send({})
        return
      }

      res.status(204).send({})
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
