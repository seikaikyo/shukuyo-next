/**
 * 根據 initiative 文字判斷色調分類
 * active=你該動(藍) / receptive=對方來(綠) / mutual=共同/等待(紫) / conditional=有條件(橙)
 */
export function getInitiativeTone(text: string): 'active' | 'receptive' | 'mutual' | 'conditional' {
  if (/要主動|主動招|主動邀|go first|自分から|動く|take init/i.test(text)) return 'active'
  if (/會來|會主動|會照顧|被你吸引|對方|receptive|容易成|自然|来る|相手/i.test(text)) return 'receptive'
  if (/條件|限定|風險|管理|看崗|看公司|conditional|注意|リスク/.test(text)) return 'conditional'
  return 'mutual'
}
