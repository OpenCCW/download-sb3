// 修复点击“下载”会闪白的问题。
document.body.addEventListener('click', (event) => {
    const a = event.target as HTMLAnchorElement
    if (
        a.nodeName === "A" &&
        a.target === "_blank" &&
        a.href.startsWith(location.origin + location.pathname.replace(/[^/]+$/, ''))
    ) {
        const bu = URL.createObjectURL(new Blob([
            // a.href 会把 " 转义成 %22 ，所以此处没有漏洞。
            `<html style="background:#14141f"><script>location.replace("${a.href}")</script>`
        ], { type: 'text/html' }))
        try {
            open(bu)
            event.preventDefault()
        } finally {
            URL.revokeObjectURL(bu)
        }
    }
})
