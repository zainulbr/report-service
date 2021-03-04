import express from 'express'

export function getTokenFromRequest(req: express.Request): string {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[1]
  }
  if (req.query && req.query.token) {
    return <string>req.query.token
  }

  //   if (req.headers.cookie) {
  //   }
  return ''
}
