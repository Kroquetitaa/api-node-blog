require('dotenv').config()
import jwt from 'jwt-simple'
import moment from 'moment'

const JWT: string | undefined = process.env.SECRET_KEY_JWT

export const createToken = (user: any) => {
  const payload = {
    id: user._id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix(),
  }
  if (JWT) return jwt.encode(payload, JWT)
}

export const decodedAndRefreshToken = (token: any, res: any) => {
    let decodedToken = token
    if (JWT) {
        decodedToken = jwt.decode(token, JWT)
    }
    const now = moment().unix()
    if (decodedToken.exp <= now) {
        return res.status(401).json({ message: 'Token has expired' });
      }
      const newTokenPayload = {
        id: decodedToken.id,
        email: decodedToken.email,
        first_name: decodedToken.first_name,
        last_name: decodedToken.last_name,
        iat: moment().unix(),
        exp: moment().add(7, 'days').unix(),
      };
      if (JWT) {
        return jwt.encode(newTokenPayload, JWT)
      }
}