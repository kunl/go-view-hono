

# 开发


## R2 配置
```shell
# 创建 bucket
wrangler r2 bucket create go-view
```
## D1

```shell
# 创建数据库
wrangler d1 create go-view

 ⛅️ wrangler 3.96.0
-------------------

✅ Successfully created DB 'go-view' in region WNAM
Created your new D1 database.

[[d1_databases]]
binding = "DB"
database_name = "go-view"
database_id = "************************************"

```

1. 配置 drizzle.config.ts
2. pnpm drizzle-kit generate
3. wrangler d1 execute go-view --local --file drizzle/0000_clear_sugar_man.sql 



Drizzle | Cloudflare D1 HTTP API 与 Drizzle Kit
https://drizzle.zhcndoc.com/docs/guides/d1-http-with-drizzle-kit


# 部署
先检查 wrangler.toml 配置信息
```
1. pnpm run deploy

# 配置正式环境的 JWT_SECRET
2. wrangler secret put JWT_SECRET
```