import { Hono } from "hono";

const route = new Hono<{ Bindings: Bindings }>()
route.get('/:filePath/:fileName', async (c) => {

    const fileName = c.req.param('fileName')
    const filePath = c.req.param('filePath')

    try {
        const file = await c.env.MY_BUCKET.get(filePath + '/' + fileName)

        if (file) {
            return new Response(file.body)
        }

        return c.text('文件不存在', 404)
    } catch (e) {
        return c.status(404)
    }


})

export default route
