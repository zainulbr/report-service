import express from 'express'
import { validationResult } from 'express-validator'

export default {
  extractReportId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    if (!req.params.reportId) {
      return
    }
    req.body.reportId = req.params.reportId
    next()
  },
  validateRequest(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
}
