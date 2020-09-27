const { ipcRenderer } = require('electron')    

window.addEventListener('contextmenu', (e) => {
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
        // selected text
        const selectedText = window.getSelection().toString()
        if (selectedText) {
            contents['text'] = selectedText
        }
    })
    ipcRenderer.sendToHost(JSON.stringify({
        x: e.x,
        y: e.y,
        contents
    }))
})