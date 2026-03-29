// T21 頁碼 -> CBETA 超連結工具

const CBETA_BASE = 'https://cbetaonline.dila.edu.tw/zh/T21n1299_p0'

/**
 * 將文本中的 T21 頁碼引用轉為 CBETA 超連結
 *
 * 支援格式:
 * - (T21 p.397c)         全/半形括號
 * - (T21 p.397c-398a)    跨頁
 * - T21, p.397c          逗號格式
 * - 品三 p.391b           品名格式
 */
export function linkifyT21(text: string): string {
  // 1. 括號包裹格式
  let result = text.replace(
    /[（(](T21\s+p\.(\d{3}[a-c])(?:-(?:\d{3})?[a-c])?)[）)]/g,
    (_match, label, page) => {
      const url = `${CBETA_BASE}${page}`
      return `(<a href="${url}" target="_blank" rel="noopener">${label}</a>)`
    }
  )

  // 2. 逗號格式
  result = result.replace(
    /(?<![(<（])(T21,\s*p\.(\d{3}[a-c])(?:-(?:\d{3})?[a-c])?)(?![)>）])/g,
    (_match, label, page) => {
      const url = `${CBETA_BASE}${page}`
      return `<a href="${url}" target="_blank" rel="noopener">${label}</a>`
    }
  )

  // 3. 品名格式
  result = result.replace(
    /(品[一二三四五六七八九十]+\s*p\.(\d{3}[a-c])(?:-[a-c])?)/g,
    (_match, label, page) => {
      const url = `${CBETA_BASE}${page}`
      return `<a href="${url}" target="_blank" rel="noopener">${label}</a>`
    }
  )

  return result
}

/**
 * 將純文字中的特殊字元轉義後再 linkify
 * 用於 v-html 場景，防止原始文字中的 < > 被解讀為 HTML
 */
export function safeLinkifyT21(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return linkifyT21(escaped)
}
