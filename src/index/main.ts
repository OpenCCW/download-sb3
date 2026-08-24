// 测试作品链接
// https://www.ccw.site/detail/61260f0b35ed2a4c1cdca79c
// https://ccw.site/s/Veb6mp
// 共创世界的《BadApple 用共创世界和西瓜创客的logo播放》太好玩了，忍不住想要分享给你！ https://ccw.site/s/Veb6mp
// https://www.ccw.site/PlayerWithInRouter/6a5309e5d4bf1642fe07b93c?projectLink=https://m.ccw.site/user_projects_sb3/199431844/18847bed1e8a633032b955cf6f48b07e.sb3&simple=123
// https://www.ccw.site/PlayerWithInRouter/6888431c4c3c1a16465d45e3?projectLink=https://m.ccw.site/user_projects_sb3/268013477/f1690ff361f70944c1303742cbee355f.sb3&simple=123

console.log('%cOpenCCW\n以做爱对抗世界的无趣', "font-size: 20px; font-family: system-ui;")

import type { Release, ResultCreationDetail } from './ResultCreationDetail'

const zhishiOssHostname = [
    "m.ccw.site",
    "m.xiguacity.cn",
    "zhishi.oss-cn-beijing.aliyuncs.com",
]

const templateLong = document.getElementById("template-long") as HTMLTemplateElement
const templateShort = document.getElementById("template-short") as HTMLTemplateElement
const inputOid = document.getElementById("input-oid") as HTMLInputElement
const btnGet = document.getElementById("btn-get") as HTMLButtonElement
const divErrors = document.getElementById("div-errors") as HTMLDivElement
const divParamLink = document.getElementById("div-param-link") as HTMLDivElement
const divLastRelease = document.getElementById("div-last-release") as HTMLDivElement
const divLastProjectLink = document.getElementById("div-last-project-link") as HTMLDivElement
const divHistoryRelease = document.getElementById("div-history-release") as HTMLDivElement

const generateSb3HtmlLink = (url: string | URL, projectTitle: string) => {
    const s = new URLSearchParams;
    s.set('url', url as string);
    if (projectTitle) s.set('name', projectTitle);
    return './sb3?' + s
}

const generateElementByLong = (release: Release, projectTitle: string) => {
    const {
        projectLink,
        version,
        customVersion,
        createdAt,
        description,
        coverLink,
    } = release
    const $version = customVersion || version
    const date = new Date(createdAt)
    const title = (
        'v' +
        $version +
        ' - ' +
        date.getFullYear() +
        '/' +
        (1 + date.getMonth()).toString().padStart(2, '0') +
        '/' +
        date.getDate().toString().padStart(2, '0') +
        ' ' +
        date.getHours().toString().padStart(2, '0') +
        ':' +
        date.getMinutes().toString().padStart(2, '0') +
        ':' +
        date.getSeconds().toString().padStart(2, '0')
    )
    const elem = document.importNode(templateLong.content, true)
    elem.querySelector<HTMLAnchorElement>('a[data-sb3link]')!.href = generateSb3HtmlLink(projectLink, projectTitle + ' v' + $version)
    elem.querySelector<HTMLDivElement>('.box-project-link-right-title')!.innerText = title
    elem.querySelector<HTMLDivElement>('.box-project-link-right-description')!.innerText = description || '-'
    elem.querySelector<HTMLDivElement>('.box-project-link-right-sb3link')!.innerText += projectLink
    const a_coverlink = elem.querySelector<HTMLAnchorElement>('a[data-coverlink]')!
    a_coverlink.href = coverLink
    a_coverlink.innerText = coverLink
    return elem
}

const generateElementByShort = (sb3link: string, projectTitle: string) => {
    const elem = document.importNode(templateShort.content, true)
    elem.querySelector<HTMLAnchorElement>('a[data-sb3link]')!.href = generateSb3HtmlLink(sb3link, projectTitle)
    elem.querySelector<HTMLDivElement>('.box-project-link-right-sb3link')!.innerText += sb3link
    return elem
}

const compareSb3Link = (a: string, b: string) => {
    if (a == b) return true;
    try {
        const au = new URL(a)
        const bu = new URL(b)
        return (
            au.pathname == bu.pathname &&
            zhishiOssHostname.includes(au.hostname) &&
            zhishiOssHostname.includes(bu.hostname)
        )
    } catch (e) {
        console.error(e)
    }
    return false
}

btnGet.addEventListener('click', async () => {
    btnGet.disabled = true
    divErrors.innerHTML = ''
    divParamLink.innerHTML = ''
    divLastRelease.innerHTML = ''
    divLastProjectLink.innerHTML = ''
    divHistoryRelease.innerHTML = ''

    try {
        let oid = inputOid.value
        if (!oid.trim()) {
            divErrors.innerText = '请输入作品链接或 oid'
            return
        }

        let paramLink: string | null | undefined


        if (oid.includes('/')) {
            // 输入的是链接
            let url: URL
            try {
                const i = oid.indexOf('https:')
                if (i > 0)
                    oid = oid.slice(i);
                url = new URL(oid)
            } catch {
                try {
                    url = new URL('https://' + oid)
                } catch {
                    divErrors.innerText = '输入的作品链接格式错误'
                    return
                }
            }
            if (url.pathname.startsWith('/s/')) {
                // 短链接转长链接。
                // ccw.site 不支持跨域，但 www.ccw.site 支持。
                switch (url.hostname) {
                    case 'ccw.site':
                    case 'x.xiguacity.cn':
                        url.hostname = 'www.ccw.site';
                }
                const response = await fetch(url, { method: 'HEAD' })
                url.href = response.url
            }
            if (url.pathname.startsWith('/user_projects_sb3/')) {
                // 已经是sb3网址了
                paramLink = url.href
                oid = ''
            } else {
                // oid变量暂时当pathname用
                oid = url.pathname
                if (oid == '/scratch-player') {
                    // 只指定了sb3文件网址，没有作品oid
                    paramLink = 'https://m.ccw.site/user_projects_sb3/' + url.searchParams.get('projectUrl') + '.sb3'
                    oid = ''
                } else if (oid == '/embed') {
                    oid = url.searchParams.get('id')!
                } else {
                    if (oid.startsWith('/PlayerWithInRouter/')) {
                        paramLink = url.searchParams.get('projectLink')
                    }
                    // /detail
                    // /gandi
                    // /creator
                    // /player
                    // /PlayerWithInRouter
                    const i = oid.lastIndexOf('/')
                    if (i < 1) {
                        divErrors.innerText = '输入的作品链接格式错误'
                        return
                    }
                    oid = oid.slice(i + 1)
                }
            }
        }

        if (paramLink) {
            divParamLink.appendChild(generateElementByShort(paramLink, ''))
        }

        if (oid) {
            const response = await fetch('https://community-web.ccw.site/creation/detail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ oid }),
            })
            if (!response.ok) {
                throw Error(`${response.status} ${response.statusText}`)
            }
            const result = await response.json() as ResultCreationDetail
            if (result.status != 200) {
                throw Error(result.msg!)
            }

            divLastProjectLink.appendChild(generateElementByShort(result.body.latestProjectLink, result.body.title))
            divLastRelease.appendChild(generateElementByLong(result.body.creationRelease, result.body.title))
            // 先隐藏，把元素添加完了，再显示，减少渲染负担
            try {
                divHistoryRelease.style.display = 'none'
                let updateParamLinkOnce = !!paramLink
                for (const release of result.body.creationReleaseList) {
                    const elem = generateElementByLong(release, result.body.title)
                    if (updateParamLinkOnce && compareSb3Link(release.projectLink, paramLink!)) {
                        // 找到了参数链接对应的版本，完善信息。
                        updateParamLinkOnce = false
                        divParamLink.replaceChildren(elem.cloneNode(true))
                    }
                    divHistoryRelease.appendChild(elem)
                }
            } finally {
                divHistoryRelease.style.display = ''
            }
        }
    } catch (e) {
        console.error(e)
        divErrors.innerText = e as any
    } finally {
        btnGet.disabled = false
    }
})
btnGet.disabled = false
