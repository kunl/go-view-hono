```
npm install
npm run dev
```

```
npm run deploy
```

## R2 配置
```shell
# 创建 bucket
wrangler r2 bucket create go-view
```
## D1

```shell
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