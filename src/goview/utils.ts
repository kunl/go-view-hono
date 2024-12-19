import dayjs from 'dayjs'
import bcrypt from 'bcryptjs'
import { verify } from 'hono/jwt'

export const response = (data: unknown, code = 200, msg = '返回成功') => {
    return {
        code,
        msg,
        data
    }
}


export const dayjsNow = () => dayjs().format('YYYY-MM-DD HH:mm:ss')

export const verifyPassword = (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash)
}

export const hashPassword = async (password: string) => {
    return bcrypt.hash(password, 10)
}

export const jwtVerify = async (token: string, secretKey: string) => {
    return await verify(token, secretKey)
}