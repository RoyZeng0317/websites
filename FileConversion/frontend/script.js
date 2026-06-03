import { CATEGORIES } from '/src/api/convert.ts'

            const sourceSel = document.getElementById('source-format')
            const targetSel = document.getElementById('target-format')
            if (sourceSel && targetSel) {
                for (const cat of CATEGORIES) {
                    const group = document.createElement('optgroup')
                    group.label = `${cat.icon} ${cat.label}`
                    for (const fmt of cat.formats) {
                        const opt = document.createElement('option')
                        opt.value = fmt.ext
                        opt.textContent = fmt.label || fmt.ext.toUpperCase()
                        group.appendChild(opt)
                    }
                    sourceSel.appendChild(group.cloneNode(true))
                    targetSel.appendChild(group)
                }
            }