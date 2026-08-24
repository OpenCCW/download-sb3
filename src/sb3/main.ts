// 测试sb3网址
// https://m.ccw.site/user_projects_sb3/199431844/3c78eda3fb43e94c6b8cc892d493359b.sb3
// https://m.ccw.site/user_projects_sb3/199431844/0da008ba3d267512693610decf4a8738.sb3
// https://m.ccw.site/user_projects_sb3/199431844/6698c5cf0a439bc5dae364fd4a79fe1d.sb3
// https://m.ccw.site/user_projects_sb3/268013477/f1690ff361f70944c1303742cbee355f.sb3

console.log('%cOpenCCW\n以做爱对抗世界的无趣', "font-size: 20px; font-family: system-ui;")

import '../hook/anchor-click'

import JSZip from "jszip"
import { decryptToJszip, decryptToProjectJson } from "@openccw/sb3-crypto/dist/decrypt"

const urlPrefix_user_projects_assets = `https://m.ccw.site/user_projects_assets/`

const inputSb3Url = document.getElementById("input-sb3-url") as HTMLInputElement
const inputName = document.getElementById("input-name") as HTMLInputElement
const formMode = document.getElementById("form-mode") as HTMLFormElement
const btnDownload = document.getElementById("btn-download") as HTMLButtonElement
const divStatus = document.getElementById("div-status") as HTMLDivElement
const divErrors = document.getElementById("div-errors") as HTMLDivElement

let saveFileBlobUrl = ''

const saveFile = (name: string, data: BlobPart) => {
    if (saveFileBlobUrl) {
        URL.revokeObjectURL(saveFileBlobUrl);
        saveFileBlobUrl = ''
    }
    const blob = new Blob([data])
    saveFileBlobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = saveFileBlobUrl
    a.download = name
    a.innerText = '保存到本地'
    a.click()
    return a
}

const errorsAdd = (e: any) => divErrors.appendChild(document.createTextNode(e + '\n'))

const downloadAssets_updateStatus = (now: number, size: number) => {
    const c = Math.floor(now * 10000 / size).toString().padStart(3, '0')
    divStatus.innerText = `下载资源 ${c.slice(0, -2)}.${c.slice(-2)}% (${now} / ${size})`
}

const downloadAssets = async (zip: JSZip, assets: Set<string>) => {
    downloadAssets_updateStatus(0, assets.size)
    let count = 0
    const iterator = assets.values()
    const f = async () => {
        for (; ;) {
            const { value: md5ext, done } = iterator.next()
            if (done) return;
            // 自动重试，直到请求了3次
            for (let retryCount = 0; ;) {
                try {
                    const response = await fetch(urlPrefix_user_projects_assets + md5ext)
                    if (!response.ok) {
                        throw Error(`${response.status} ${response.statusText}`)
                    }
                    const data = await response.arrayBuffer()
                    // 扩展名 不含'.'
                    const ext = md5ext.slice(md5ext.lastIndexOf('.') + 1)
                    let options: JSZip.JSZipFileOptions | undefined
                    switch (ext) {
                        case 'png':
                        case 'jpg':
                        case 'mp3':
                            options = { compression: 'STORE' }
                    }
                    zip.file(md5ext, data, options)
                    // 获取成功
                    downloadAssets_updateStatus(++count, assets.size)
                    break
                } catch (e) {
                    if (retryCount > 2) {
                        const msg = `获取 ${md5ext} 失败：`
                        console.error(msg, e)
                        errorsAdd(msg + e)
                        // 不再重试
                        break
                    }
                    // 重试
                    retryCount++
                }
            }
        }
    }
    // 并发最多10个请求
    const len = Math.min(10, assets.size)
    const pool = Array<Promise<any>>(len)
    for (let i = 0; i < len;) {
        pool[i++] = f()
    }
    await Promise.all(pool)
}

btnDownload.addEventListener('click', async () => {
    btnDownload.disabled = true
    divStatus.innerHTML = ''
    divErrors.innerHTML = ''

    try {
        if (saveFileBlobUrl) {
            URL.revokeObjectURL(saveFileBlobUrl);
            saveFileBlobUrl = ''
        }
    } catch (e) {
        console.error(e)
    }

    try {
        const inputSb3UrlValue = inputSb3Url.value
        if (!inputSb3UrlValue) {
            divErrors.innerText = '请输入 sb3 文件网址'
            return
        }
        /**
         * "0": 下载完整 sb3（不包含扩展文件）  
         * "1": 下载仅包含 project.json 的 sb3  
         * "2": 下载 project.json  
         */
        const mode = formMode.mode.value as "0" | "1" | "2"

        let projectLinkURL: URL
        try {
            projectLinkURL = new URL(inputSb3UrlValue)
        } catch {
            try {
                projectLinkURL = new URL('https://' + inputSb3UrlValue)
            } catch {
                divErrors.innerText = '输入的 sb3 文件网址格式无效'
                return
            }
        }

        let downloadName = inputName.value

        divStatus.innerText = '下载 project.json'

        // 从网络获取 sb3 文件。
        // 文件名不是 MD5 ，同名文件的内容是可变的，所以不使用缓存。
        projectLinkURL.searchParams.append('t', Date.now().toString())
        const response = await fetch(projectLinkURL, { cache: 'no-store' })
        if (!response.ok) {
            throw Error(`failed to fetch: HTTP ${response.status} ${response.statusText}`)
        }
        const data = await response.arrayBuffer()

        divStatus.innerText = '解密 project.json'

        // 获取文件名
        projectLinkURL.href = response.url
        let sb3FileName = projectLinkURL.pathname
        sb3FileName = sb3FileName.slice(sb3FileName.lastIndexOf('/') + 1)

        downloadName ||= sb3FileName
        let a: HTMLAnchorElement
        if (mode == "2") {
            if (!/\.json$/i.test(downloadName))
                downloadName += '.json';
            // 解密并返回 project.json (string)
            const decryptedProjectJson = await decryptToProjectJson(data, sb3FileName)
            a = saveFile(downloadName, decryptedProjectJson)
        } else {
            if (!/\.(sb3|zip)$/i.test(downloadName))
                downloadName += '.sb3';
            // 解密并返回 JSZip 对象
            const zip = await decryptToJszip(data, sb3FileName)
            if (mode == "0") {
                // 获取所有造型、背景、声音
                let jsonStr = await zip.file("project.json")!.async("text");
                const zipFiles = zip.files
                const project = JSON.parse(jsonStr)
                const assets = new Set<string>()
                for (const target of project.targets) {
                    for (const a of target.costumes) {
                        if (!Object.prototype.hasOwnProperty.call(zipFiles, a.md5ext))
                            assets.add(a.md5ext)
                    }
                    for (const a of target.sounds) {
                        if (!Object.prototype.hasOwnProperty.call(zipFiles, a.md5ext))
                            assets.add(a.md5ext)
                    }
                }
                await downloadAssets(zip, assets)
            }
            const sb3 = await zip.generateAsync({
                type: "uint8array",
                compression: "DEFLATE",
                compressionOptions: {
                    level: 6,
                },
            }) as Uint8Array<ArrayBuffer>
            a = saveFile(downloadName, sb3)
        }

        divStatus.innerText = '下载完成。'
        divStatus.appendChild(a)
    } catch (e) {
        console.error(e)
        errorsAdd(e)
        divStatus.innerText = '下载失败'
    } finally {
        btnDownload.disabled = false
    }
})
btnDownload.disabled = false

divStatus.innerHTML = ''
