 

type Bindings = {
    MY_BUCKET: R2Bucket
    R2: R2Bucket
    DB: D1Database
    BUCKET_URL: string
    BUCKET_NAME: string
    TOKEN_NAME: string
    JWT_SECRET: string
    JWT_EXPIRES: number
}


type Variables = {
    user: User
    createUserId: number
}


 type User = {
    id: number
    username: string
    nickname: string
 }