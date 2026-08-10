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
| Production branch | \`main\` |
| Root directory | \`worker\` |
| Framework preset | \`None\` |
| Build command | \`exit 0\` |
| Build output directory | \`dist\` |

4. 保存并开始部署。
5. 部署完成后，使用 Cloudflare 提供的 \`https://<项目名称>.pages.dev\` 地址访问。

## 注意事项

### Surge

- 必须安装并启用 WLOC 模块。
- 必须安装并信任 MITM 证书。
- MITM 主机名必须包含：

  \`\`\`text
  gs-loc.apple.com
  gs-loc-cn.apple.com
  gsp-ssl.ls.apple.com
  bluedot.is.autonavi.com
  bluedot.is.autonavi.com.gds.alibabadns.com
  \`\`\`

- 默认模块会对以上主机名的 \`/clls/wloc\` 定位响应进行处理。
- \`WLOC Settings\` 配置保存接口仍使用 \`gs-loc.apple.com\` 和 \`gs-loc-cn.apple.com\`，不需要将备用主机名加入该规则。
- 请使用精确主机名，不要使用 \`*.apple.com\` 或 \`*.autonavi.com\` 等通配符，以减少不必要的 HTTPS 解密范围。
- 使用选点页面时，Safari 必须经过 Surge 代理，否则坐标无法写入 Surge 持久化存储。

### 定位

- 本项目仅修改 Apple 的 Wi-Fi/基站网络定位结果，不会修改设备的 GPS 硬件定位。
- GPS 信号较强时，系统可能优先采用真实 GPS 定位；室内或以 Wi-Fi 定位为主的环境通常更容易生效。
- iOS 26 及更高版本可能缓存定位结果。修改坐标后如果位置没有变化，可重启设备以清除 \`locationd\` 缓存。

### 随机扰动

- 模块参数 \`扰动半径\` 的范围是 \`0-5000\` 米，默认值为 \`30\` 米。
- \`0\` 表示关闭；大于 \`0\` 时，每次 WLOC 响应会在目标坐标周围随机生成一个不超过该半径的位置。
- 选点页面保存位置时会同时保存扰动半径；页面查询和定位脚本使用同一份 Surge 持久化数据。
- 保存的坐标或扰动半径超出合法范围时会被拒绝；经度或纬度为 \`0\` 仍是合法坐标，旧数据中缺失扰动半径时会回退到模块参数。

### 测试

仓库内的测试会在隔离的 Surge 模拟环境中检查设置保存、查询、清除、参数回退、坐标校验和随机半径边界，也会验证模块的域名匹配范围：

需要 Node.js 18 或更高版本。

\`\`\`bash
npm test
\`\`\`

### 目录

- \`worker/dist/\` 是 Cloudflare Pages 的静态资源输出目录。
- 仓库根目录的 \`dist/\` 保存 Surge 脚本，两者不要混淆。
