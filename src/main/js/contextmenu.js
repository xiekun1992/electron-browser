const { ipcRenderer } = require('electron')    

window.addEventListener('contextmenu', (e) => {
    // const menuOptions = {
    //     link: [
    //         { label: '在新标签页中打开链接' },
    //         { label: '复制链接地址' }
    //     ],
    //     image: [
    //         { label: '在新标签页中打开图片' },
    //         { label: '图片另存为' },
    //         { label: '复制图片' },
    //         { label: '复制图片地址' }
    //     ],
    //     page: [
    //         { label: '返回' },
    //         { label: '前进' },
    //         { label: '重新加载' },
    //         { label: '另存为' },
    //         { label: '打印' }
    //     ],
    //     text: [
    //         { label: '复制' },
    //         { label: '用百度搜索' }
    //     ],
    //     dev: [
    //         { label: '查看网页源代码' },
    //         { label: '检查' }
    //     ]
    // }
    
    // const node = document.createElement('div')
    // node.style.cssText = `
    // position: fixed;
    // top: 0;
    // left: 0;
    // width: 100px;
    // height: 100px;
    // background: red;
    // `
    // let html = ''
    // Array.from(e.path).forEach(el => {
    //     html += el.tagName + '\n'
    // })
    // node.innerText = html
    // document.body.append(node)
    const {
        x,
        y
    } = e
    const contents = {}
    Array.from(e.path).forEach(el => {
        if (!el.tagName) {
            return
        }
        switch (el.tagName.toLowerCase()) {
            case 'a': 
                if (!contents['link'] && el.href) {
                    contents['link'] = el.href
                }
                break
            case 'img':
                if (!contents['image'] && el.src) {
                    contents['image'] = el.src
                }
                break
            case 'video': break
            case 'audio': break
        }
    })
    ipcRenderer.sendToHost(JSON.stringify({
        x,
        y,
        contents
    }))
})