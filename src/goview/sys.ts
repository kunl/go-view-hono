import {Hono} from "hono";
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { decode, sign, verify } from 'hono/jwt'

import * as schema from '../db/schema';
import {response, hashPassword, verifyPassword, jwtVerify} from "./utils";



const route = new Hono<{
    Bindings: Bindings;
    Variables: Variables
}>()

route.get('/', (c) => {
    return c.text('Hello Hono! sys')
})

route.get('/getOssInfo', (c) => {
    const data = {
        "bucketURL": c.env.BUCKET_URL,
        "BucketName": c.env.BUCKET_NAME
    }
    return c.json(response(data))
})


route.post('/login', async (c) => {
    const {username: uname, password} = await c.req.json()

    const db = drizzle(c.env.DB, {schema})

    const user = await db.select().from(schema.users).where(eq(schema.users.username, uname)).get()

    console.log(user?.nickname)
    if(!user || !verifyPassword(password + user.salt, user.password)) {
        return c.json(response({}, 400, '用户密码错误'))
    }

   const {
        id,
        username,
        nickname,
    } = user


    const {JWT_SECRET, JWT_EXPIRES, TOKEN_NAME} = c.env

    const payload = {
        id,
        username,
        nickname,
        exp:  Math.floor(Date.now() / 1000) + JWT_EXPIRES
      }

    const token = await sign(payload, JWT_SECRET)

    const res = {
        userinfo: {
            id,
            username,
            nickname,
     
        },
        token: {
            tokenName: TOKEN_NAME,
            tokenValue: token,
            isLogin: true,
            tokenTimeout: JWT_EXPIRES
        }
    }
    
    return c.json(response(res))
})


route.post('/register', async (c) => {
    const {username, password, nickname} = await c.req.json()

    const db = drizzle(c.env.DB, {schema})

    const salt = Math.random().toString(16).slice(2)
    const pwd =  await hashPassword(password + salt)

    const res = await db.insert(schema.users).values({
        username, password: pwd, nickname, salt
    }).catch((e) => {
        console.log(e)
        return null
    })

    if(!res) {
        return c.json(response({}, 400, '注册失败'))
    }
 
    return c.json(response({}, 200, '注册成功'))
})


route.get('/logout', async (c) => {
    const query = c.req.query('Cookie') || ''
    const {TOKEN_NAME} = c.env

    const tokenToVerify = query.replace(TOKEN_NAME + '=', '')

    const secretKey = c.env.JWT_SECRET
 

    return c.json(response({}, 200, '注销成功'))
})

export default route
