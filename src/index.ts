import { Hono,  } from 'hono'
import { html, raw } from 'hono/html'
import { cors } from 'hono/cors'
import { createMiddleware } from 'hono/factory'
import goViewHandler from './goview/index'
import { jwtVerify } from './goview/utils'


const app = new Hono<{ Bindings: Bindings }>()



app.get('/', (c) => {
 

  return c.html(
    html`
      <html>
        <head>
          <title>Go View</title>
        </head>
        <body>
          Hello Hono! \n运行在 cloudflare 上的 <a href="https://gitee.com/dromara/go-view" target="_blank">go-view</a> 服务端
        </body>
      </html>
    `
  )
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

  try {
    const decodedPayload = await jwtVerify(token, secretKey)
    const user = decodedPayload as User

    if (!user) {
      return c.json({
        code: 401,
        msg: 'token 无效'
      })
    }

    console.log('login user', user.id)
    c.set('user', user)
    c.set('createUserId', user.id)

  } catch (e) {
    return c.json({
      code: 401,
      msg: 'token 失效'
    })
  }



  await next()
})


app.use('/api/goview/*',
  cors({
    origin: '*',
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
    maxAge: 600,
    credentials: true,
  })
)

app.use('/api/goview/*', userAuth)

app.route('/api/goview', goViewHandler)

export default app
