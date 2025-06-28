# Dungeon Manager 系統架構設計

## 系統概述

Dungeon Manager 是一個創新的系統運維管理平台，將傳統的運維工作轉化為地下城探險的形式。系統採用前後端分離架構，使用 NestJS 作為後端框架，Vue 3 作為前端框架，PostgreSQL 作為資料庫。系統完全開源，使用 MIT 授權，並支持多語言國際化。支持 Google 登入和組織管理功能。

## 核心概念

### 1. 組織（Organization）

- 代表一個獨立的組織或團隊
- 可以創建和管理多個地下城
- 具有組織級別的設置和權限
- 可以邀請和管理成員

### 2. 地下城（Dungeon）

- 代表組織內的系統架構
- 包含多個區域（Zone）
- 區域內包含多個房間（服務）
- 具有不同的環境配置
- 屬於特定組織

### 3. 區域（Zone）

- 代表系統中的特定環境或網絡區域
- 具有特定的安全級別和訪問控制
- 可以包含多個房間
- 具有區域特定的配置和策略
- 支持不同類型的區域：
  - 外網區域（Public Zone）
  - 內網區域（Internal Zone）
  - 容器區域（Container Zone）
  - 外部系統區域（External System Zone）
  - 開發區域（Development Zone）
  - 測試區域（Testing Zone）
  - 生產區域（Production Zone）

### 4. 房間（Room）

- 代表單個服務或應用
- 包含服務的狀態和配置
- 存儲相關的認證信息

### 5. 守護者（Guardian）

- 代表系統管理員
- 具有不同的權限等級
- 可以執行各種管理任務
- 可以組隊共享信息

### 6. 寶箱（Treasure）

- 代表存儲的敏感信息
- 包含密碼、TOTP 等認證信息
- 可以設置訪問權限
- 支持團隊共享

### 7. 隊伍（Party）

- 代表信息共享的團隊
- 可以共享寶箱內容
- 具有不同的權限設置
- 支持臨時訪問權限

## 系統組件

### 後端服務（NestJS）

#### 核心模組

1. **認證模組（Auth Module）**

   - 用戶認證和授權
   - JWT token 管理
   - 權限控制
   - TOTP 驗證
   - Google OAuth 整合
   - 社交登入管理

2. **組織模組（Organization Module）**

   - 組織管理
   - 成員管理
   - 權限設置
   - 邀請系統
   - 組織設置

3. **區域模組（Zone Module）**

   - 區域管理
   - 區域配置
   - 安全策略
   - 訪問控制
   - 區域監控
   - 區域間通信規則

4. **地下城模組（Dungeon Module）**

   - 系統架構管理
   - 服務狀態監控
   - 資源配置
   - 區域管理
   - 區域間關係管理

5. **房間模組（Room Module）**

   - 服務管理
   - 配置管理
   - 認證信息關聯

6. **守護者模組（Guardian Module）**

   - 用戶管理
   - 權限管理
   - 操作日誌
   - 隊伍管理

7. **寶箱模組（Treasure Module）**

   - 密碼管理
   - TOTP 管理
   - 訪問控制
   - 共享設置

8. **隊伍模組（Party Module）**

   - 隊伍管理
   - 成員管理
   - 權限分配
   - 臨時訪問控制

9. **國際化模組（I18n Module）**

   - 語言包管理
   - 動態語言切換
   - 日期時間本地化
   - 數字格式本地化

### 前端應用（Vue 3）

#### 主要視圖

1. **地下城地圖（Dungeon Map）**

   - 系統架構可視化
   - 服務狀態展示
   - 互動式導航

2. **房間管理（Room Management）**

   - 服務配置界面
   - 認證信息管理
   - 監控儀表板

3. **守護者控制台（Guardian Console）**

   - 用戶管理界面
   - 權限設置
   - 操作日誌查看

4. **寶箱管理（Treasure Management）**

   - 密碼存儲
   - TOTP 管理
   - 共享設置
   - 訪問日誌

5. **隊伍管理（Party Management）**

   - 隊伍創建
   - 成員管理
   - 權限設置
   - 共享控制

6. **語言設置（Language Settings）**

   - 語言切換
   - 區域設置
   - 格式偏好

## 資料庫設計（PostgreSQL）

### 主要實體

1. **Organizations**

   - 組織信息
   - 設置
   - 成員關係
   - 邀請記錄

2. **Users**

   - 用戶信息
   - 權限設置
   - 操作記錄
   - TOTP 密鑰
   - 語言偏好
   - 社交帳號關聯

3. **Zones**

   - 區域信息
   - 區域類型
   - 安全級別
   - 配置設置
   - 訪問規則
   - 監控設置
   - 區域間關係

4. **Services**

   - 服務配置
   - 部署信息
   - 狀態記錄

5. **Treasures**

   - 密碼信息
   - TOTP 配置
   - 訪問權限
   - 加密數據

6. **Parties**

   - 隊伍信息
   - 成員列表
   - 權限設置
   - 共享規則

7. **Logs**

   - 操作日誌
   - 訪問記錄
   - 審計記錄

8. **Translations**
   - 語言代碼
   - 翻譯鍵值
   - 翻譯內容
   - 區域設置

## API 設計

### RESTful API 端點

1. **認證相關**

   - POST /api/auth/login
   - POST /api/auth/logout
   - GET /api/auth/profile
   - POST /api/auth/totp/verify
   - GET /api/auth/google
   - POST /api/auth/google/callback

2. **組織管理**

   - GET /api/organizations
   - POST /api/organizations
   - PUT /api/organizations/:id
   - GET /api/organizations/:id/members
   - POST /api/organizations/:id/members
   - DELETE /api/organizations/:id/members/:memberId
   - POST /api/organizations/:id/invites
   - PUT /api/organizations/:id/invites/:inviteId

3. **區域管理**

   - GET /api/zones
   - POST /api/zones
   - PUT /api/zones/:id
   - DELETE /api/zones/:id
   - GET /api/zones/:id/rooms
   - POST /api/zones/:id/rooms
   - GET /api/zones/:id/connections
   - POST /api/zones/:id/connections
   - PUT /api/zones/:id/security
   - GET /api/zones/:id/monitoring

4. **地下城管理**

   - GET /api/dungeon/status
   - GET /api/dungeon/map
   - PUT /api/dungeon/config

5. **房間管理**

   - GET /api/rooms
   - POST /api/rooms
   - PUT /api/rooms/:id
   - DELETE /api/rooms/:id

6. **守護者管理**

   - GET /api/guardians
   - POST /api/guardians
   - PUT /api/guardians/:id

7. **寶箱管理**

   - GET /api/treasures
   - POST /api/treasures
   - PUT /api/treasures/:id
   - DELETE /api/treasures/:id
   - POST /api/treasures/:id/totp

8. **隊伍管理**

   - GET /api/parties
   - POST /api/parties
   - PUT /api/parties/:id
   - POST /api/parties/:id/members
   - DELETE /api/parties/:id/members/:memberId

9. **國際化相關**

   - GET /api/i18n/languages
   - GET /api/i18n/translations/:lang
   - PUT /api/i18n/user-language

## 安全性考慮

1. **認證與授權**

   - JWT 基礎認證
   - TOTP 雙因素認證
   - Google OAuth 認證
   - 角色基礎訪問控制
   - API 請求限制
   - 組織級別權限控制

2. **資料安全**

   - 端到端加密
   - 安全傳輸
   - 備份策略
   - 密碼強度檢查

3. **審計日誌**

   - 操作追蹤
   - 訪問記錄
   - 安全事件記錄
   - 合規性報告

4. **區域安全**

   - 區域級別訪問控制
   - 區域間通信規則
   - 安全策略實施
   - 區域隔離
   - 網絡安全規則

## 擴展性考慮

1. **模組化設計**

   - 鬆散耦合
   - 插件系統
   - 自定義擴展
   - 組織級別擴展

2. **水平擴展**

   - 負載均衡
   - 服務複製
   - 資料分片

3. **整合能力**
   - 第三方服務整合
   - API 網關
   - 消息隊列

## 國際化支持

1. **語言支持**

   - 多語言界面
   - 動態語言切換
   - 自動語言檢測
   - 語言包管理

2. **本地化特性**

   - 日期時間格式
   - 數字格式
   - 貨幣格式
   - 時區支持

3. **翻譯管理**

   - 集中式翻譯管理
   - 自動翻譯建議
   - 翻譯版本控制
   - 缺失翻譯處理
