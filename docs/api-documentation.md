# Dungeon Manager API 文檔

## 基礎信息

- 基礎 URL: `http://localhost:3000/api`
- 所有請求都需要在 header 中包含 `Authorization: Bearer <token>`
- 所有響應都是 JSON 格式
- 時間格式：ISO 8601
- 支持多語言：在 header 中使用 `Accept-Language` 指定語言

## 國際化 API

### 獲取支持的语言列表

```http
GET /i18n/languages
```

響應：

```json
{
  "languages": [
    {
      "code": "string",
      "name": "string",
      "nativeName": "string",
      "isDefault": "boolean"
    }
  ]
}
```

### 獲取指定語言的翻譯

```http
GET /i18n/translations/:lang
```

響應：

```json
{
  "translations": {
    "key": "string",
    "value": "string"
  }
}
```

### 更新用戶語言偏好

```http
PUT /i18n/user-language
```

請求體：

```json
{
  "language": "string",
  "region": "string"
}
```

### 獲取用戶語言設置

```http
GET /i18n/user-language
```

響應：

```json
{
  "language": "string",
  "region": "string",
  "dateFormat": "string",
  "timeFormat": "string",
  "numberFormat": "string"
}
```

## 認證 API

### 登入

```http
POST /auth/login
```

請求體：

```json
{
  "username": "string",
  "password": "string",
  "totp": "string" // 可選，如果啟用了 TOTP
}
```

響應：

```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "role": "string",
    "hasTotp": "boolean",
    "language": "string"
  }
}
```

### 設置 TOTP

```http
POST /auth/totp/setup
```

響應：

```json
{
  "secret": "string",
  "qrCode": "string"
}
```

### 驗證 TOTP

```http
POST /auth/totp/verify
```

請求體：

```json
{
  "code": "string"
}
```

### 登出

```http
POST /auth/logout
```

### 獲取用戶信息

```http
GET /auth/profile
```

響應：

```json
{
  "id": "string",
  "username": "string",
  "role": "string",
  "permissions": ["string"]
}
```

### Google 登入

```http
GET /auth/google
```

重定向到 Google 登入頁面。

### Google 登入回調

```http
POST /auth/google/callback
```

請求體：

```json
{
  "code": "string",
  "state": "string"
}
```

響應：

```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "string",
    "hasTotp": "boolean",
    "language": "string",
    "organizations": [
      {
        "id": "string",
        "name": "string",
        "role": "string"
      }
    ]
  }
}
```

## 地下城管理 API

### 獲取地下城狀態

```http
GET /dungeon/status
```

響應：

```json
{
  "status": "string",
  "rooms": {
    "total": "number",
    "active": "number",
    "maintenance": "number"
  },
  "monsters": {
    "total": "number",
    "active": "number",
    "resolved": "number"
  }
}
```

### 獲取地下城地圖

```http
GET /dungeon/map
```

響應：

```json
{
  "rooms": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "status": "string",
      "position": {
        "x": "number",
        "y": "number"
      }
    }
  ],
  "connections": [
    {
      "from": "string",
      "to": "string",
      "type": "string"
    }
  ]
}
```

## 房間管理 API

### 獲取房間列表

```http
GET /rooms
```

查詢參數：

- `status`: 過濾狀態
- `type`: 過濾類型
- `page`: 頁碼
- `limit`: 每頁數量

響應：

```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "status": "string",
      "config": "object"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### 創建房間

```http
POST /rooms
```

請求體：

```json
{
  "name": "string",
  "type": "string",
  "config": "object"
}
```

### 更新房間

```http
PUT /rooms/:id
```

請求體：

```json
{
  "name": "string",
  "config": "object"
}
```

### 刪除房間

```http
DELETE /rooms/:id
```

## 守護者管理 API

### 獲取守護者列表

```http
GET /guardians
```

查詢參數：

- `role`: 過濾角色
- `page`: 頁碼
- `limit`: 每頁數量

響應：

```json
{
  "items": [
    {
      "id": "string",
      "username": "string",
      "role": "string",
      "permissions": ["string"]
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### 創建守護者

```http
POST /guardians
```

請求體：

```json
{
  "username": "string",
  "password": "string",
  "role": "string",
  "permissions": ["string"]
}
```

### 更新守護者

```http
PUT /guardians/:id
```

請求體：

```json
{
  "role": "string",
  "permissions": ["string"]
}
```

## 怪物管理 API

### 獲取怪物列表

```http
GET /monsters
```

查詢參數：

- `status`: 過濾狀態
- `level`: 過濾等級
- `page`: 頁碼
- `limit`: 每頁數量

響應：

```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "level": "number",
      "status": "string",
      "description": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### 更新怪物狀態

```http
PUT /monsters/:id/status
```

請求體：

```json
{
  "status": "string",
  "resolution": "string"
}
```

## 寶箱管理 API

### 獲取寶箱列表

```http
GET /treasures
```

查詢參數：

- `type`: 過濾類型（password/totp）
- `shared`: 過濾共享狀態
- `page`: 頁碼
- `limit`: 每頁數量

響應：

```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "description": "string",
      "isShared": "boolean",
      "sharedWith": ["string"],
      "lastAccessed": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### 創建寶箱

```http
POST /treasures
```

請求體：

```json
{
  "name": "string",
  "type": "string",
  "description": "string",
  "content": {
    "username": "string",
    "password": "string",
    "url": "string",
    "notes": "string"
  },
  "totp": {
    "secret": "string",
    "issuer": "string"
  }
}
```

### 更新寶箱

```http
PUT /treasures/:id
```

請求體：

```json
{
  "name": "string",
  "description": "string",
  "content": {
    "username": "string",
    "password": "string",
    "url": "string",
    "notes": "string"
  }
}
```

### 刪除寶箱

```http
DELETE /treasures/:id
```

### 獲取寶箱內容

```http
GET /treasures/:id/content
```

響應：

```json
{
  "content": {
    "username": "string",
    "password": "string",
    "url": "string",
    "notes": "string"
  },
  "totp": {
    "code": "string",
    "remainingSeconds": "number"
  }
}
```

## 隊伍管理 API

### 獲取隊伍列表

```http
GET /parties
```

查詢參數：

- `page`: 頁碼
- `limit`: 每頁數量

響應：

```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "members": [
        {
          "id": "string",
          "username": "string",
          "role": "string"
        }
      ],
      "sharedTreasures": ["string"]
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### 創建隊伍

```http
POST /parties
```

請求體：

```json
{
  "name": "string",
  "description": "string",
  "members": ["string"],
  "sharedTreasures": ["string"]
}
```

### 更新隊伍

```http
PUT /parties/:id
```

請求體：

```json
{
  "name": "string",
  "description": "string",
  "members": ["string"],
  "sharedTreasures": ["string"]
}
```

### 添加隊伍成員

```http
POST /parties/:id/members
```

請求體：

```json
{
  "userId": "string",
  "role": "string"
}
```

### 移除隊伍成員

```http
DELETE /parties/:id/members/:memberId
```

### 設置臨時訪問

```http
POST /parties/:id/temporary-access
```

請求體：

```json
{
  "userId": "string",
  "treasureIds": ["string"],
  "expiresAt": "string"
}
```

## 組織管理 API

### 獲取組織列表

```http
GET /organizations
```

響應：

```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "createdAt": "string",
      "memberCount": "number",
      "dungeonCount": "number",
      "role": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### 創建組織

```http
POST /organizations
```

請求體：

```json
{
  "name": "string",
  "description": "string",
  "settings": {
    "defaultLanguage": "string",
    "timezone": "string",
    "allowedDomains": ["string"]
  }
}
```

### 更新組織

```http
PUT /organizations/:id
```

請求體：

```json
{
  "name": "string",
  "description": "string",
  "settings": {
    "defaultLanguage": "string",
    "timezone": "string",
    "allowedDomains": ["string"]
  }
}
```

### 獲取組織成員

```http
GET /organizations/:id/members
```

響應：

```json
{
  "items": [
    {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "joinedAt": "string",
      "lastActive": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### 添加組織成員

```http
POST /organizations/:id/members
```

請求體：

```json
{
  "email": "string",
  "role": "string"
}
```

### 移除組織成員

```http
DELETE /organizations/:id/members/:memberId
```

### 創建邀請

```http
POST /organizations/:id/invites
```

請求體：

```json
{
  "email": "string",
  "role": "string",
  "expiresIn": "string" // 例如：24h, 7d
}
```

響應：

```json
{
  "inviteId": "string",
  "inviteUrl": "string",
  "expiresAt": "string"
}
```

### 接受邀請

```http
PUT /organizations/:id/invites/:inviteId
```

請求體：

```json
{
  "action": "accept"
}
```

### 拒絕邀請

```http
PUT /organizations/:id/invites/:inviteId
```

請求體：

```json
{
  "action": "reject"
}
```

## 錯誤響應

所有錯誤響應都遵循以下格式：

```json
{
  "statusCode": "number",
  "message": "string",
  "error": "string",
  "translationKey": "string"
}
```

常見錯誤碼：

- 400: 請求參數錯誤
- 401: 未認證
- 403: 權限不足
- 404: 資源不存在
- 500: 服務器錯誤

## 速率限制

- 認證 API: 每分鐘 5 次請求
- TOTP 相關: 每分鐘 3 次請求
- 其他 API: 每分鐘 60 次請求

超過限制時返回 429 狀態碼。

## WebSocket API

### 連接

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');
```

### 事件類型

1. 寶箱訪問通知

```json
{
  "type": "treasure_access",
  "data": {
    "treasureId": "string",
    "userId": "string",
    "action": "string"
  }
}
```

2. 隊伍更新

```json
{
  "type": "party_update",
  "data": {
    "partyId": "string",
    "action": "string",
    "details": "object"
  }
}
```

3. TOTP 更新

```json
{
  "type": "totp_update",
  "data": {
    "treasureId": "string",
    "code": "string",
    "remainingSeconds": "number"
  }
}
```

4. 語言更新

```json
{
  "type": "language_update",
  "data": {
    "userId": "string",
    "language": "string",
    "region": "string"
  }
}
```

5. 組織更新

```json
{
  "type": "organization_update",
  "data": {
    "organizationId": "string",
    "action": "string",
    "details": "object"
  }
}
```

6. 成員更新

```json
{
  "type": "member_update",
  "data": {
    "organizationId": "string",
    "userId": "string",
    "action": "string",
    "details": "object"
  }
}
```

7. 區域更新

```json
{
  "type": "zone_update",
  "data": {
    "zoneId": "string",
    "action": "string",
    "details": "object"
  }
}
```

8. 區域監控

```json
{
  "type": "zone_monitoring",
  "data": {
    "zoneId": "string",
    "metrics": "object",
    "alerts": ["string"]
  }
}
```

## 區域管理 API

### 獲取區域列表

```http
GET /zones
```

查詢參數：

- `type`: 過濾區域類型
- `securityLevel`: 過濾安全級別
- `page`: 頁碼
- `limit`: 每頁數量

響應：

```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "description": "string",
      "securityLevel": "string",
      "roomCount": "number",
      "status": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### 創建區域

```http
POST /zones
```

請求體：

```json
{
  "name": "string",
  "type": "string",
  "description": "string",
  "securityLevel": "string",
  "config": {
    "networkRules": {
      "allowedInbound": ["string"],
      "allowedOutbound": ["string"],
      "isolationLevel": "string"
    },
    "monitoring": {
      "enabled": "boolean",
      "metrics": ["string"],
      "alerts": ["string"]
    },
    "accessControl": {
      "allowedRoles": ["string"],
      "allowedUsers": ["string"],
      "requireApproval": "boolean"
    }
  }
}
```

### 更新區域

```http
PUT /zones/:id
```

請求體：

```json
{
  "name": "string",
  "description": "string",
  "securityLevel": "string",
  "config": {
    "networkRules": {
      "allowedInbound": ["string"],
      "allowedOutbound": ["string"],
      "isolationLevel": "string"
    },
    "monitoring": {
      "enabled": "boolean",
      "metrics": ["string"],
      "alerts": ["string"]
    },
    "accessControl": {
      "allowedRoles": ["string"],
      "allowedUsers": ["string"],
      "requireApproval": "boolean"
    }
  }
}
```

### 刪除區域

```http
DELETE /zones/:id
```

### 獲取區域內的房間

```http
GET /zones/:id/rooms
```

響應：

```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "status": "string",
      "config": "object"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### 將房間添加到區域

```http
POST /zones/:id/rooms
```

請求體：

```json
{
  "roomId": "string",
  "config": {
    "accessLevel": "string",
    "monitoring": "object",
    "networkRules": "object"
  }
}
```

### 獲取區域間的連接

```http
GET /zones/:id/connections
```

響應：

```json
{
  "items": [
    {
      "id": "string",
      "sourceZoneId": "string",
      "targetZoneId": "string",
      "type": "string",
      "config": {
        "protocol": "string",
        "ports": ["string"],
        "securityRules": "object"
      }
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### 創建區域間連接

```http
POST /zones/:id/connections
```

請求體：

```json
{
  "targetZoneId": "string",
  "type": "string",
  "config": {
    "protocol": "string",
    "ports": ["string"],
    "securityRules": "object"
  }
}
```

### 更新區域安全設置

```http
PUT /zones/:id/security
```

請求體：

```json
{
  "securityLevel": "string",
  "networkRules": {
    "allowedInbound": ["string"],
    "allowedOutbound": ["string"],
    "isolationLevel": "string"
  },
  "accessControl": {
    "allowedRoles": ["string"],
    "allowedUsers": ["string"],
    "requireApproval": "boolean"
  }
}
```

### 獲取區域監控數據

```http
GET /zones/:id/monitoring
```

查詢參數：

- `metrics`: 要獲取的指標列表
- `timeRange`: 時間範圍
- `interval`: 數據間隔

響應：

```json
{
  "metrics": {
    "name": "string",
    "values": [
      {
        "timestamp": "string",
        "value": "number"
      }
    ]
  }
}
```
