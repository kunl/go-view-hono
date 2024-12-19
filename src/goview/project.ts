import { Hono } from "hono";
import { response, dayjsNow } from "./utils";

import { drizzle } from 'drizzle-orm/d1';
import { eq, count } from 'drizzle-orm';
import * as schema from '../db/schema';



const route = new Hono<{ Bindings: Bindings, Variables: Variables }>()

route.get('/', (c) => {
    return c.text('Hello Hono! project')
})

route.post('/create', async (c) => {
    const { projectName, remarks } = await c.req.json()
    const createUserId = c.var.createUserId

    const db = drizzle(c.env.DB, { schema })
    const projectCount = await db.select({ count: count() }).from(schema.projects).where(eq(schema.projects.createUserId, createUserId));

    const {PROJECT_COUNT_UN_LIMIT_USER, PROJECT_COUNT_LIMIT} = c.env
    const unLimitUser = PROJECT_COUNT_UN_LIMIT_USER.split(',')

        // 根据用户，限制创建 项目的数量 PROJECT_COUNT_LIMIT
    if (projectCount[0].count >= PROJECT_COUNT_LIMIT && !unLimitUser.includes(createUserId.toString())) {
        return c.json(response({}, 400, '项目数量已达上限')
        )
    }

    const projectId =  crypto.randomUUID()

    const it = await db.insert(schema.projects).values({
        projectId,
        projectName, remarks,
        createTime: dayjsNow(),
        createUserId
    }).returning()



    return c.json(response({...it[0], id:projectId }, 200, '创建成功'))
})




route.post('/save/data', async (c) => {
    const formData = await c.req.formData()
    const createUserId = c.var.createUserId

    const projectId = formData.get('projectId') as string
    const content = formData.get('content') as string

    const updateTime = dayjsNow()


    const db = drizzle(c.env.DB, { schema })

    const res = await db.insert(schema.projectDatas).values({
        projectId,
        content,
        createTime: dayjsNow(),
        createUserId
    }).onConflictDoUpdate({
        target: schema.projectDatas.projectId,
        set: {
            content,
            updateTime
        }
    }).returning()



    return c.json(response({ ...res[0] }, 200, '保存成功'))
})

route.post('/edit', async (c) => {
    const { id, projectName, indexImage, remarks } = await c.req.json()
    const createUserId = c.var.createUserId
    const db = drizzle(c.env.DB, { schema })

    await db.update(schema.projects).set({
        projectName, indexImage, remarks, createUserId,
        updateTime: dayjsNow()
    }).where(eq(schema.projects.projectId, id!))

    return c.json(response({}))
})


//项目状态[-1未发布,1发布]
route.put('/publish', async (c) => {
    const { id, state } = await c.req.json()
    const db = drizzle(c.env.DB, { schema })

    await db.update(schema.projects).set({
        state,
        updateTime: dayjsNow()
    }).where(eq(schema.projects.projectId, id!))

    return c.json(response({}))
})

route.delete('/delete', async (c) => {
    const id = c.req.query('ids')
    const db = drizzle(c.env.DB, { schema })

    await db.delete(schema.projects).where(eq(schema.projects.projectId, id!))
    await db.delete(schema.projectDatas).where(eq(schema.projectDatas.projectId, id!))

    return c.json(response({}, 200, '删除成功'))
})


route.get('/list', async (c) => {
    const db = drizzle(c.env.DB)
    const createUserId = c.var.createUserId

    console.log('createUserId', createUserId)
    const res = await db.select().from(schema.projects).where(eq(schema.projects.createUserId, createUserId)).all()

    const data = res.map(e => {
        return {
            ...e,
            id: e.projectId || e.id
        }
    }) || []

    return c.json(response(data))
})

route.get('/getData', async (c) => {
    const id = c.req.query('projectId')
    const createUserId = c.var.createUserId

    const db = drizzle(c.env.DB)
    if (id) {
        const res = await (await db.select().from(schema.projectDatas)).findLast(e => e.projectId == id)

        console.log('getData project ', res?.id, createUserId)
 

        // if(res.createUserId != createUserId) {
        //     return c.json(response({}, 403, '没有权限'))
        // }

        return c.json(response(res))
    }

    return c.json(response({}))

})


/**
 * {
"body": "json字符串", 
"cookie": "asd=12345; ad=4567;", 
"form": {
"a": "1234", 
"v": "12345" 
}, 
"head": {
"a": "1234", 
"v": "12345" 
}, 
"requestType": "get", 
"timeout": 5000, 
"url": "http://localhost:8080/goview" 
}
 */

route.post('/magicHttp', async (c) => {
    const { url } = await c.req.json()
    return c.json(response({ url }))
})


route.post('/upload', async (c) => {
    const formData = await c.req.formData()

    const file = formData.get('object') as File

    // 获取扩展名称
    const fullName = file.name
    const [fileName, ext] = fullName.split('.')
    const path = 'images/' + fileName + Math.random().toString(16).slice(2) + '.' + ext

    await c.env.MY_BUCKET.put(path, file)

    const res = {
        // "id": "20241217045049",
        "fileName": path,
        // "bucketName": "",
        "fileSize": file.size,
        // "fileSuffix": "",
        // "createUserId": "",
        // "createUserName": "",
        "createTime": dayjsNow(),
        // "updateUserId": "",
        // "updateUserName": "",
        "updateTime": dayjsNow()
    }

    return c.json(response(res, 200, '上传成功'))
})

route.post('/uploadFile', async (c) => {
    const key = Math.random().toString(16).slice(2)
    const formData = await c.req.parseBody()
    const file = formData['file']
    if (file instanceof File) {
        const fileBuffer = await file.arrayBuffer()
        const fullName = file.name
        const ext = fullName.split('.').pop()
        const path = `images/${fullName}`
        await c.env.MY_BUCKET.put(path, fileBuffer)
        return c.json({
            'image': {
                'url': `${fullName}`
            },
            fullName
        })
    } else {
        return c.text('Invalid file', 400)
    }
})


export default route
