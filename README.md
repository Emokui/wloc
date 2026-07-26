# WLOC 虚拟定位

## Cloudflare Pages 部署

### 通过 Git 仓库部署

1. 将仓库导入 Cloudflare。
2. 在 Cloudflare 控制台进入 **Workers & Pages**，选择 **Create application → Pages → Connect to Git**。
3. 选择仓库并使用以下构建设置：

   | 设置 | 值 |
   | --- | --- |
   | Production branch | `main` |
   | Root directory | `worker` |
   | Framework preset | `None` |
   | Build command | `exit 0` |
   | Build output directory | `dist` |

4. 保存并部署。完成后使用 Cloudflare 提供的 `*.pages.dev` 地址访问选点页面。

### 通过 Wrangler 部署

```bash
git clone https://github.com/Emokui/wloc.git
cd wloc/worker
npm install
npx wrangler login
npx wrangler pages deploy dist --project-name <项目名称>
```

部署完成后使用生成的 `https://<项目名称>.pages.dev` 地址。

## 注意事项

- Surge 必须安装并启用 WLOC 模块。
- 必须安装并信任 MITM 证书。
- MITM 主机名必须包含 `gs-loc.apple.com` 和 `gs-loc-cn.apple.com`。
- 使用选点页面时，Safari 必须通过 Surge 代理，否则无法将坐标写入 Surge 的持久化存储。
- 本项目仅修改 Apple 的 Wi-Fi/基站网络定位结果，不会修改设备的 GPS 硬件定位。
- GPS 信号较强时，系统可能优先采用真实 GPS 定位，室内或以 Wi-Fi 定位为主的环境通常效果更好。
- iOS 26 及更高版本会缓存定位结果。修改坐标后如果位置没有变化，需要重启设备以清除 `locationd` 缓存。
- `worker/dist/` 是 Cloudflare Pages 的输出目录，不要与仓库根目录原有的 Surge 脚本目录 `dist/` 混淆。
