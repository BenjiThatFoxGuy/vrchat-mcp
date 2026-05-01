import { readFileSync, writeFileSync, chmodSync } from 'fs'
const path = 'dist/main.js'
let content = readFileSync(path, 'utf8')
if (!content.startsWith('#!')) {
  content = '#!/usr/bin/env node' + '\n' + content
}
writeFileSync(path, content)
chmodSync(path, 0o755)
