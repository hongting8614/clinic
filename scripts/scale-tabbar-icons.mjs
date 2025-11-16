import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { PNG } from 'pngjs'

const ICONS = [
  'home.png',
  'home-active.png',
  'stock.png',
  'stock-active.png',
  'record.png',
  'record-active.png',
  'user.png',
  'user-active.png'
]

const ICON_DIR = join(process.cwd(), 'static', 'tabbar')
const SCALE = 1.45

function scalePng(buffer, factor) {
  const src = PNG.sync.read(buffer)
  const dst = new PNG({
    width: Math.round(src.width * factor),
    height: Math.round(src.height * factor)
  })

  for (let y = 0; y < dst.height; y++) {
    for (let x = 0; x < dst.width; x++) {
      const srcX = Math.min(src.width - 1, Math.floor(x / factor))
      const srcY = Math.min(src.height - 1, Math.floor(y / factor))
      const srcIdx = (srcY * src.width + srcX) << 2
      const dstIdx = (y * dst.width + x) << 2

      dst.data[dstIdx] = src.data[srcIdx]
      dst.data[dstIdx + 1] = src.data[srcIdx + 1]
      dst.data[dstIdx + 2] = src.data[srcIdx + 2]
      dst.data[dstIdx + 3] = src.data[srcIdx + 3]
    }
  }

  return PNG.sync.write(dst)
}

ICONS.forEach((name) => {
  const filePath = join(ICON_DIR, name)
  const buffer = readFileSync(filePath)
  const scaled = scalePng(buffer, SCALE)
  writeFileSync(filePath, scaled)
  console.log(`Scaled ${name}`)
})


