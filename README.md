<div align="center">
  <img src="./worker/dist/icon-192.png" width="96" height="96" alt="WLOC">
  <h1>WLOC</h1>
  <p>Cloudflare Pages 部署说明</p>
</div>

---

## 通过 Git 仓库部署

> 推荐使用此方式。推送到生产分支后，Cloudflare Pages 会自动重新部署。

1. 登录 Cloudflare，在 **Workers & Pages** 中创建 Pages 项目。
2. 选择 **Connect to Git**，授权并选择本仓库。
3. 按照下表填写构建设置：

| 设置 | 值 |
| --- | --- |
| Production branch | `main` |
| Root directory | `worker` |
| Framework preset | `None` |
| Build command | `exit 0` |
| Build output directory | `dist` |

4. 保存并开始部署。
5. 部署完成后，使用 Cloudflare 提供的 `https://<项目名称>.pages.dev` 地址访问。

## 通过 Wrangler 部署

```bash
git clone https://github.com/Emokui/wloc.git
cd wloc/worker
npm install
npx wrangler login
npm run deploy
```

Wrangler 会读取 `worker/wrangler.pages.jsonc`，并将 `worker/dist/` 作为 Pages 静态资源目录。

## 注意事项

### Surge

- 必须安装并启用 WLOC 模块。
- 必须安装并信任 MITM 证书。
- MITM 主机名必须包含：

  ```text
  gs-loc.apple.com
  gs-loc-cn.apple.com
  ```

- 使用选点页面时，Safari 必须经过 Surge 代理，否则坐标无法写入 Surge 持久化存储。

### 定位

- 本项目仅修改 Apple 的 Wi-Fi/基站网络定位结果，不会修改设备的 GPS 硬件定位。
- GPS 信号较强时，系统可能优先采用真实 GPS 定位；室内或以 Wi-Fi 定位为主的环境通常更容易生效。
- iOS 26 及更高版本可能缓存定位结果。修改坐标后如果位置没有变化，可重启设备以清除 `locationd` 缓存。

### 目录

- `worker/dist/` 是 Cloudflare Pages 的静态资源输出目录。
- 仓库根目录的 `dist/` 保存 Surge 脚本，两者不要混淆。
