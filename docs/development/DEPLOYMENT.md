# Deployment Guide

本文檔說明如何將 Checkinly 部署到生產環境。

## 目錄

- [Vercel 部署（推薦）](#vercel-部署推薦)
- [Netlify 部署](#netlify-部署)
- [自託管部署](#自託管部署)
- [環境變數配置](#環境變數配置)
- [效能優化](#效能優化)
- [常見問題](#常見問題)

---

## Vercel 部署（推薦）

Vercel 是最簡單快速的部署方式，針對 Vite 專案優化。

### 方法 1: 透過 Vercel CLI

1. **安裝 Vercel CLI**:
```bash
npm install -g vercel
```

2. **登入 Vercel**:
```bash
vercel login
```

3. **部署專案**:
```bash
vercel
```

4. **生產部署**:
```bash
vercel --prod
```

### 方法 2: 透過 GitHub Integration

1. 將專案推送到 GitHub
2. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
3. 點擊「New Project」
4. 選擇你的 GitHub 倉庫
5. Vercel 自動檢測 Vite 專案並配置
6. 點擊「Deploy」

### Vercel 配置

Vercel 自動識別 `package.json` 的構建腳本，預設配置：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

如需自訂配置，建立 `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Netlify 部署

### 方法 1: 透過 Netlify CLI

1. **安裝 Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **登入 Netlify**:
```bash
netlify login
```

3. **初始化站點**:
```bash
netlify init
```

4. **部署**:
```bash
netlify deploy --prod
```

### 方法 2: 透過 GitHub Integration

1. 將專案推送到 GitHub
2. 前往 [Netlify Dashboard](https://app.netlify.com/)
3. 點擊「New site from Git」
4. 選擇 GitHub 並授權
5. 選擇你的倉庫
6. 配置構建設定：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
7. 點擊「Deploy site」

### Netlify 配置

建立 `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 自託管部署

### 使用 Nginx

1. **構建專案**:
```bash
npm run build
```

2. **複製 dist 到伺服器**:
```bash
scp -r dist/* user@server:/var/www/checkinly
```

3. **配置 Nginx**:

`/etc/nginx/sites-available/checkinly`:

```nginx
server {
    listen 80;
    server_name checkinly.example.com;
    root /var/www/checkinly;
    index index.html;

    # Gzip 壓縮
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/css application/javascript application/json image/svg+xml;

    # 快取靜態資源
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由支援
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 安全標頭
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

4. **啟用站點**:
```bash
sudo ln -s /etc/nginx/sites-available/checkinly /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 使用 Apache

建立 `.htaccess` 於 `dist/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

---

## 環境變數配置

Checkinly 目前不需要環境變數，但如果未來需要（例如 API 端點），可以使用 Vite 的環境變數系統。

### 建立環境變數檔案

`.env.production`:
```
VITE_API_URL=https://api.example.com
VITE_APP_NAME=Checkinly
```

### 在代碼中使用

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

### Vercel 環境變數

在 Vercel Dashboard 的 Settings → Environment Variables 添加：

- `VITE_API_URL`: `https://api.example.com`

### Netlify 環境變數

在 Netlify Dashboard 的 Site settings → Environment variables 添加：

- Key: `VITE_API_URL`, Value: `https://api.example.com`

---

## 效能優化

### 構建優化

1. **分析 Bundle 大小**:
```bash
npm run build -- --mode production
```

2. **代碼分割** (未來優化):
```javascript
// 動態導入大型組件
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

3. **壓縮資源**:
   - Vite 自動壓縮 JS/CSS
   - 使用 CDN 提供靜態資源

### CDN 配置

建議使用 Vercel Edge Network 或 Cloudflare CDN：

1. **Vercel**: 自動全球 CDN
2. **Cloudflare**:
   - 前往 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 添加網站並更新 DNS
   - 啟用「Auto Minify」和「Brotli」

### 快取策略

建議快取策略（已包含在 Nginx 配置中）：

- **HTML**: 不快取（`no-cache`）
- **CSS/JS**: 1 年（`max-age=31536000, immutable`）
- **圖片/字體**: 1 年（`max-age=31536000, immutable`）

---

## 常見問題

### Q1: 部署後頁面空白

**原因**: 路由配置錯誤或靜態資源路徑問題

**解決方案**:
1. 確認 `index.html` 存在於 `dist/`
2. 確認 server 配置了 SPA fallback（所有路由指向 `index.html`）
3. 檢查瀏覽器 Console 是否有 404 錯誤

### Q2: 構建失敗

**原因**: 依賴缺失或 Node.js 版本不符

**解決方案**:
1. 確認 Node.js 版本 ≥ 18
2. 清除快取並重新安裝依賴:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Q3: 上傳檔案功能在生產環境不工作

**原因**: 瀏覽器限制或 CORS 問題

**解決方案**:
1. 確認使用 HTTPS（HTTP 可能限制檔案 API）
2. 檢查 Content-Security-Policy 標頭
3. 測試不同瀏覽器

### Q4: Vercel 部署超過 10MB 限制

**原因**: 免費方案有檔案大小限制

**解決方案**:
1. 升級到 Vercel Pro
2. 或使用其他平台（Netlify 免費 100MB）
3. 優化 bundle 大小

### Q5: 圖表不顯示

**原因**: Recharts 動態載入問題

**解決方案**:
1. 確認 `dist/` 包含所有 JS chunks
2. 檢查 Console 是否有 chunk 載入錯誤
3. 確認 CDN 正常運作

---

## 部署檢查清單

部署前確認以下項目：

- [ ] `npm run build` 成功無錯誤
- [ ] `dist/` 目錄包含 `index.html`
- [ ] 測試檔案上傳功能
- [ ] 測試所有圖表渲染
- [ ] 測試響應式佈局（mobile/tablet/desktop）
- [ ] 檢查瀏覽器 Console 無錯誤
- [ ] 測試無障礙功能（Tab 鍵導航）
- [ ] 使用 Lighthouse 檢查效能（≥90）
- [ ] 測試不同瀏覽器（Chrome/Firefox/Safari/Edge）
- [ ] 配置正確的快取策略
- [ ] 啟用 HTTPS
- [ ] 配置 Custom Domain（可選）

---

## 監控與維護

### 推薦監控工具

1. **Vercel Analytics**: 自動整合於 Vercel 專案
2. **Google Analytics**: 添加 GA 追蹤碼至 `index.html`
3. **Sentry**: 錯誤追蹤與效能監控

### 持續部署

推薦設定 CI/CD pipeline:

1. **GitHub Actions** (範例):

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

2. **Vercel Git Integration**: 自動部署每次 commit

---

## 支援與協助

如遇到部署問題：

1. 查閱 [Vite 部署文檔](https://vitejs.dev/guide/static-deploy.html)
2. 查閱 [Vercel 文檔](https://vercel.com/docs)
3. 查閱 [Netlify 文檔](https://docs.netlify.com/)
4. 檢查 `CHANGELOG.md` 是否有已知問題

---

**維護者**: Claude Code (Anthropic)
**最後更新**: 2025-12-10
