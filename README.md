下载共创世界 CCW 的作品 sb3 文件。

https://openccw.github.io/download-sb3/

该网站使用 [OpenCCW/sb3-crypto](https://github.com/OpenCCW/sb3-crypto) 解密 sb3 文件。

## 网址参数

支持用网址参数填充输入框。

`index.html`

- 使用 `oid` 或 `url` 参数填充 `作品链接或 oid`

`sb3.html`

- 使用 `url` 参数填充 `sb3 文件网址`
- 使用 `name` 参数填充 `自定义文件名`

## 克隆并构建

```
git clone https://github.com/OpenCCW/download-sb3
cd download-sb3
pnpm i
pnpm build
```

如果要启动本地开发服务器，运行 `pnpm dev` 即可。

如果要在浏览器查看 `dist` 的内容，运行 `pnpm preview` 即可。
