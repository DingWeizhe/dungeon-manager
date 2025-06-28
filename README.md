# Dungeon Manager (地下城管理員)

一個創新的系統運維管理平台，將傳統的運維工作轉化為地下城探險的形式，讓系統管理變得更有趣且直觀。

## 專案願景

Dungeon Manager 將系統架構視為一個需要被管理的地下城，系統管理員就像是地下城的守護者，需要：

- 監控系統狀態（探索地下城）
- 管理認證信息（守護寶箱）
- 共享敏感信息（組隊探險）
- 管理 TOTP 驗證（魔法封印）

## 核心功能

### 1. 寶箱管理

- 安全存儲密碼和敏感信息
- 支持 TOTP 雙因素認證
- 端到端加密保護
- 訪問權限控制

### 2. 隊伍系統

- 創建和管理共享團隊
- 設置不同級別的訪問權限
- 臨時訪問授權
- 訪問日誌追蹤

### 3. 安全特性

- TOTP 雙因素認證
- 端到端加密
- 訪問審計日誌
- 密碼強度檢查

## 技術架構

### 後端

- NestJS - 提供穩定的 API 服務
- PostgreSQL - 資料儲存
- TypeORM - 資料庫 ORM
- JWT - 身份驗證
- TOTP - 雙因素認證

### 前端

- Vue 3 - 使用者介面框架
- Vite - 建構工具
- TailwindCSS - 樣式框架
- Pinia - 狀態管理

## 系統需求

- Node.js >= 18
- PostgreSQL >= 14
- npm >= 8

## 開發環境設置

1. 克隆專案

```bash
git clone [repository-url]
cd dungeon-manager
```

2. 安裝依賴

```bash
# 安裝後端依賴
cd backend
npm install

# 安裝前端依賴
cd ../frontend
npm install
```

3. 設置環境變數

```bash
# 在 backend 目錄下
cp .env.example .env
# 編輯 .env 文件，設置必要的環境變數
```

4. 啟動開發服務器

```bash
# 啟動後端服務
cd backend
npm run start:dev

# 啟動前端服務
cd frontend
npm run dev
```

## 專案結構

```
dungeon-manager/
├── backend/           # NestJS 後端
│   ├── src/
│   │   ├── modules/   # 功能模組
│   │   ├── config/    # 配置文件
│   │   └── main.ts    # 應用入口
│   └── test/         # 測試文件
├── frontend/         # Vue 前端
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   └── App.vue
│   └── public/
└── docs/            # 專案文檔
```

## 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 授權

[MIT License](LICENSE)
