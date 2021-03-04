import express from 'express'
import axios from 'axios'
import { getTokenFromRequest } from '../../../helper/token'
export default {
  validateToken(HookTokenURL: string) {
    return async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (!HookTokenURL) {
        return
      }
      const token = getTokenFromRequest(req)

      // validate token
      try {
        const resp = await axios.post(HookTokenURL, null, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })

        if (resp.status >= 400) {
          return res.status(401).json({ errors: 'Unauthorized' })
        }
      } catch (error) {
        console.error(error)
        return res.status(401).json({ errors: 'Unauthorized' })
      }

      next()
    }
  },
}
