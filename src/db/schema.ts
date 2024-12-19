import dayjs from 'dayjs';
import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core'



export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull().unique(),
    nickname: text('nickname').notNull(),
    password: text('password').notNull(),
    salt: text('salt'),
});

export const projects = sqliteTable('projects', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    projectId: text('projectId').notNull().unique(),
    projectName: text('projectName').notNull(),
    indexImage: text('indexImage'),
    remarks: text('remarks'),
    state: integer('state').notNull().default(-1),
    isDelete: integer('isDelete').notNull().default(-1),
    createTime: text('createTime').notNull().default(dayjs().format('YYYY-MM-DD HH:mm:ss')),
    createUserId: integer('createUserId').notNull().default(-1),
    updateTime: text('updateTime').notNull().default(dayjs().format('YYYY-MM-DD HH:mm:ss')),
})


export const projectDatas = sqliteTable('projectDatas', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    projectId:  text('projectId').notNull(),
    createTime: text('createTime').notNull().default(dayjs().format('YYYY-MM-DD HH:mm:ss')),
    createUserId: integer('createUserId').notNull(),
    content: text('content').notNull(),
    updateTime: text('updateTime').notNull().default(dayjs().format('YYYY-MM-DD HH:mm:ss')),
}, (projectDatas) => ([
    uniqueIndex('projectId').on(projectDatas.projectId),
]))


export default {
    users,
    projects,
    projectDatas,
}
