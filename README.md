# movie_tickets_system

![node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![nestjs](https://img.shields.io/badge/nestjs-backend-e0234e?logo=nestjs&logoColor=white)
![nextjs](https://img.shields.io/badge/next.js-web-000000?logo=next.js&logoColor=white)
![react](https://img.shields.io/badge/react-admin-61dafb?logo=react&logoColor=000)

电影票务系统示例工程，包含：后端 API、Web 订票端、后台管理端，以及数据库种子数据。

## 目录结构

- `apps/server_nest`：NestJS + Prisma 后端（默认端口 `3003`，全局前缀 `/api`）
- `apps/web_new`：Next.js (App Router) Web 订票端
- `apps/admin_new`：Vite + React 管理端
- `database/seeds`：MySQL 种子 SQL
- `docs/screenshots`：项目截图

## 核心功能

- 电影列表/详情、购票流程（含选座 UI）
- 用户登录、个人信息/头像
- 后台管理：影厅、电影、角色/权限等模块
- 后端静态资源：`/uploads`、`/avatar`（由后端 `public/` 目录提供）

## 环境要求

- Node.js（建议 `>= 18`）
- MySQL（建议 `5.7+`）
- npm（仓库内各子项目使用 `package-lock.json`）

## 快速开始

### 1) 初始化数据库

- 创建数据库 `filmsdata`
- 执行种子数据：`database/seeds/filmsdata.sql`

### 2) 启动后端（NestJS）

```bash
cd apps/server_nest
npm install
npm run dev
```

- 默认监听：`http://localhost:3003`
- API 前缀：`http://localhost:3003/api`

### 3) 启动 Web 订票端（Next.js）

```bash
cd apps/web_new
npm install
npm run dev
```

默认：`http://localhost:3000`

### 4) 启动后台管理端（Vite）

```bash
cd apps/admin_new
npm install
npm run dev
```

默认：`http://localhost:5173`

## 截图

- ![网页首页](./docs/screenshots/1.png)
- ![网页选座](./docs/screenshots/2.png)
- ![管理系统](./docs/screenshots/3.png)
- ![手机端1](./docs/screenshots/4.jpg)
- ![手机端2](./docs/screenshots/5.jpg)
- ![手机端3](./docs/screenshots/6.jpg)
- ![手机端4](./docs/screenshots/7.jpg)
- ![手机端5](./docs/screenshots/8.jpg)

## 贡献与规范

- 使用小写字母 + 下划线的目录命名（例如 `apps/web_new`）
- 避免提交构建产物（例如 `.next/`、`dist/`）以及敏感配置（例如 `.env`）
- 提交信息建议遵循 Conventional Commits（例如 `feat: ...`、`fix: ...`、`chore: ...`）
