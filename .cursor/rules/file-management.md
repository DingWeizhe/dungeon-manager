# 文件管理規範

## 1. 目錄結構規範

### 1.1 後端目錄結構

```
backend/
├── src/                      # 源代碼目錄
│   ├── modules/             # 功能模組
│   ├── config/             # 配置文件
│   ├── common/             # 共用元件
│   ├── utils/              # 工具函數
│   └── main.ts             # 應用入口
├── test/                    # 測試文件
├── docs/                    # 文檔
└── scripts/                 # 腳本文件
```

### 1.2 前端目錄結構

```
frontend/
├── src/
│   ├── assets/             # 靜態資源
│   ├── components/         # 共用元件
│   ├── views/              # 頁面
│   ├── store/             # 狀態管理
│   ├── router/            # 路由配置
│   └── utils/             # 工具函數
├── public/                 # 公共資源
└── tests/                 # 測試文件
```

## 2. 文件命名規範

### 2.1 通用規則

- 使用有意義的描述性名稱
- 避免使用特殊字符和空格
- 使用小寫字母和連字符（kebab-case）命名文件夾
- 遵循所使用框架的命名慣例

### 2.2 後端文件命名

- 模組文件：`*.module.ts`
- 控制器文件：`*.controller.ts`
- 服務文件：`*.service.ts`
- 實體文件：`*.entity.ts`
- DTO 文件：`*-*.dto.ts`
- 介面文件：`*.interface.ts`
- 類型文件：`*.type.ts`

### 2.3 前端文件命名

- 元件文件：`PascalCase.vue`
- 頁面文件：`PascalCase.vue`
- 工具函數：`camelCase.ts`
- 樣式文件：`kebab-case.scss`
- 路由文件：`kebab-case.routes.ts`
- 狀態文件：`kebab-case.store.ts`

## 3. 文件組織規範

### 3.1 模組組織

- 相關的文件應該放在同一個目錄下
- 每個模組應該有自己的目錄
- 共用的元件和工具應該放在相應的共用目錄中

### 3.2 測試文件組織

- 測試文件應與被測試的文件放在相同的目錄下
- 測試文件使用 `.spec.ts` 或 `.test.ts` 後綴
- E2E 測試文件放在專門的 e2e 目錄下

### 3.3 文檔組織

- API 文檔使用 OpenAPI/Swagger 格式
- 技術文檔使用 Markdown 格式
- 文檔應該放在 `docs` 目錄下，並按主題分類

## 4. 版本控制規範

### 4.1 Git 忽略規則

- 所有的依賴包目錄（node_modules）
- 編譯輸出目錄（dist, build）
- 環境配置文件（.env）
- IDE 配置文件（.idea, .vscode）
- 日誌文件
- 臨時文件

### 4.2 分支管理

- 主分支：main/master
- 開發分支：develop
- 功能分支：feature/\*
- 修復分支：bugfix/\*
- 發布分支：release/\*
- 熱修復分支：hotfix/\*

### 4.3 提交規範

- 使用語義化的提交訊息
- 格式：`<type>(<scope>): <description>`
- 類型：feat, fix, docs, style, refactor, test, chore
- 範圍：可選，表示影響的模組
- 描述：簡短的變更說明
