import bcrypt from 'bcrypt'

export const hashPassword = (password: string, num: number) => {
    return bcrypt.hash(password, num)
  }
  
  export const comparePassword = (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash)
  }
  