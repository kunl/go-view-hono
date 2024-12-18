import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import goViewHandler from './goview/index'
import { jwtVerify } from './goview/utils'


const app = new Hono<{ Bindings: Bindings }>()



app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const url = [
  '/api/goview/sys/login',
  '/api/goview/sys/logout', 
  '/api/goview/sys/register', 
  '/api/goview/sys/getOssInfo',
  '/api/goview/project/getData'
]

const userAuth = createMiddleware<{ Bindings: Bindings, Variables: Variables }>(async (c, next) => {
  const token = c.req.header(c.env.TOKEN_NAME)
  const path = c.req.path

  if (url.includes(path)) {
    return await next()
  }

  if (!token) {
    return c.json({
      code: 401,
      msg: 'token 不存在'
    })
  }

  const secretKey = c.env.JWT_SECRET

  const decodedPayload = await jwtVerify(token, secretKey)

  const user = decodedPayload as User

  c.set('user', user)
  c.set('createUserId', user.id)

  await next()
})


app.use('/api/goview/*', userAuth)

app.route('/api/goview', goViewHandler)

export default app
