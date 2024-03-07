import { StatusCodes } from 'http-status-codes'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jwt-simple'
import moment from 'moment'

interface AuthenticatedRequest extends Request {
  user?: any
}

const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    return res.status(403).send({
      status: 'Error',
      message: 'No Token provided',
    })
  }

  const token = req.headers.authorization.replace(/['"]+/g, '')

  try {
    if (!SECRET_KEY_JWT) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: 'Error',
        message: 'No secret key provided',
      })
    }
    const payload = jwt.decode(token, SECRET_KEY_JWT)
    if (payload.exp <= moment().unix()) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        status: 'Error',
        message: 'Expired Token',
      })
    }
    req.user = payload
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).send({
      status: 'Error',
      message: 'Invalid Token',
      err,
    })
  }

  next()
}
