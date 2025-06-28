# Docker 開發環境設置

本專案使用 Docker Compose 來管理開發環境中的 PostgreSQL 數據庫服務。

## 服務列表

1. PostgreSQL

   - 版本：14-alpine
   - 端口：5432
   - 默認用戶名：postgres
   - 默認密碼：postgres
   - 默認數據庫：system_manager

2. pgAdmin 4
   - 端口：5050
   - 默認郵箱：admin@admin.com
   - 默認密碼：admin

## 使用說明

### 啟動服務

```bash
# 在專案根目錄執行
docker-compose up -d
```

### 停止服務

```bash
docker-compose down
```

### 查看日誌

```bash
# 查看所有服務的日誌
docker-compose logs

# 查看特定服務的日誌
docker-compose logs postgres
docker-compose logs pgadmin
```

### 連接到數據庫

1. 使用 psql：

```bash
psql -h localhost -U postgres -d system_manager
```

2. 使用 pgAdmin：
   - 訪問 http://localhost:5050
   - 使用默認郵箱和密碼登入
   - 添加新服務器：
     - 主機名：postgres
     - 端口：5432
     - 用戶名：postgres
     - 密碼：postgres

## 數據持久化

數據庫文件被持久化到名為 `postgres_data` 的 Docker volume 中。即使容器被刪除，數據也會保留。

### 管理數據卷

```bash
# 列出所有數據卷
docker volume ls

# 刪除數據卷（慎用！會刪除所有數據）
docker volume rm system_manager_postgres_data
```

## 常見問題

1. 端口衝突

   - 如果本地已經有 PostgreSQL 服務在運行，可能會發生端口衝突
   - 解決方案：修改 docker-compose.yml 中的端口映射

2. 連接問題

   - 確保服務已經完全啟動（可以使用 `docker-compose ps` 查看狀態）
   - 檢查健康檢查狀態：`docker inspect system_manager_postgres | grep Health`

3. 權限問題
   - 如果遇到數據目錄權限問題，可以嘗試：
     ```bash
     sudo chown -R 5050:5050 postgres_data
     ```

## 安全注意事項

當前配置適用於開發環境。在生產環境中：

- 使用強密碼
- 限制網絡訪問
- 定期備份數據
- 設置適當的資源限制
