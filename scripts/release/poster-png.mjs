import { inflateSync } from 'node:zlib'

const signature = Buffer.from([137,80,78,71,13,10,26,10])
const table = Array.from({ length: 256 }, (_, index) => {
  let value = index
  for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ ((value & 1) ? 0xedb88320 : 0)
  return value >>> 0
})
export function pngCrc(bytes) {
  let value = 0xffffffff
  for (const byte of bytes) value = table[(value ^ byte) & 255] ^ (value >>> 8)
  return (value ^ 0xffffffff) >>> 0
}
/** Strict static mobile poster: CRC, ordering and complete noninterlaced RGB/RGBA decode. */
export function validatePosterPng(bytes) {
  if (bytes.length < 57 || bytes.length > 32_000_000 || !bytes.subarray(0, 8).equals(signature))
    throw new Error('INVALID_POSTER_PNG')
  let offset = 8, header, ended = false, idatClosed = false
  const compressed = []
  while (offset < bytes.length) {
    if (offset + 12 > bytes.length) throw new Error('TRUNCATED_POSTER_PNG')
    const length = bytes.readUInt32BE(offset), end = offset + 12 + length
    if (length > 32_000_000 || end > bytes.length) throw new Error('TRUNCATED_POSTER_PNG')
    const type = bytes.toString('ascii', offset + 4, offset + 8)
    if (!/^[A-Za-z]{4}$/u.test(type) ||
        pngCrc(bytes.subarray(offset + 4, end - 4)) !== bytes.readUInt32BE(end - 4))
      throw new Error('POSTER_PNG_CRC_MISMATCH')
    const data = bytes.subarray(offset + 8, end - 4)
    if (!header && type !== 'IHDR') throw new Error('INVALID_POSTER_CHUNKS')
    if (type === 'IHDR') {
      if (header || length !== 13) throw new Error('INVALID_POSTER_CHUNKS')
      header = { width: data.readUInt32BE(0), height: data.readUInt32BE(4), depth: data[8], color: data[9] }
      if (header.width !== 1080 || header.height !== 1920) throw new Error('INVALID_POSTER_DIMENSIONS')
      if (header.depth !== 8 || ![2,6].includes(header.color) || data[10] || data[11] || data[12])
        throw new Error('UNSUPPORTED_POSTER_ENCODING')
    } else if (type === 'IDAT') {
      if (idatClosed) throw new Error('INVALID_POSTER_CHUNKS')
      compressed.push(data)
    } else if (type === 'IEND') {
      if (length || !compressed.length || end !== bytes.length) throw new Error('INVALID_POSTER_CHUNKS')
      ended = true
    } else {
      if (compressed.length) idatClosed = true
      if (type[0] === type[0].toUpperCase() && type !== 'PLTE') throw new Error('UNSUPPORTED_POSTER_CHUNK')
      if (type === 'PLTE' && (compressed.length || !length || length % 3 || length > 768))
        throw new Error('INVALID_POSTER_CHUNKS')
    }
    offset = end
  }
  if (!header || !ended) throw new Error('INVALID_POSTER_CHUNKS')
  const stride = header.width * (header.color === 6 ? 4 : 3) + 1
  let raw
  try { raw = inflateSync(Buffer.concat(compressed), { maxOutputLength: stride * header.height }) }
  catch { throw new Error('POSTER_PNG_DECODE_FAILED') }
  if (raw.length !== stride * header.height) throw new Error('POSTER_PNG_DECODE_FAILED')
  for (let row = 0; row < header.height; row++) {
    if (raw[row * stride] > 4) throw new Error('POSTER_PNG_DECODE_FAILED')
  }
  return { width: header.width, height: header.height, encoding: header.color === 6 ? 'RGBA8' : 'RGB8' }
}
