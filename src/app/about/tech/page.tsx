import Link from 'next/link'

const TECH_STACK = [
  {
    category: '前端',
    items: [
      { name: 'Next.js 15', desc: 'App Router, Server Components, React 19' },
      { name: 'TypeScript', desc: '全型別安全，嚴格模式' },
      { name: 'Tailwind CSS v4', desc: '原子化 CSS，dark mode 支援' },
      { name: 'shadcn/ui', desc: '無頭元件，基於 Radix UI' },
      { name: 'Zustand', desc: '輕量化狀態管理，持久化儲存' },
    ],
  },
  {
    category: '後端',
    items: [
      { name: 'FastAPI', desc: 'Python 非同步 API 框架' },
      { name: 'SQLModel', desc: 'Pydantic + SQLAlchemy 整合 ORM' },
      { name: 'Neon PostgreSQL', desc: 'Serverless 雲端資料庫（Singapore 區域）' },
    ],
  },
  {
    category: '部署',
    items: [
      { name: 'Vercel', desc: '前端自動部署，Edge Network 加速' },
      { name: 'Render', desc: '後端 API 服務（Starter 方案，24/7 運行）' },
    ],
  },
  {
    category: '開發工具',
    items: [
      { name: 'Claude Code', desc: 'AI 輔助開發（Anthropic Claude）' },
      { name: 'Sentry', desc: '前端錯誤追蹤與監控' },
      { name: 'DashAI DevTools', desc: '自建 CLI 工具，含驗證/掃描/效能測試' },
    ],
  },
]

const API_ENDPOINTS = [
  { path: '/fortune/daily/{date}', desc: '日運勢' },
  { path: '/fortune/weekly/{date}', desc: '週運勢' },
  { path: '/fortune/monthly/{year}/{month}', desc: '月運勢' },
  { path: '/fortune/yearly/{year}', desc: '年運勢' },
  { path: '/fortune/yearly-range', desc: '十年流年' },
  { path: '/lucky-days/summary/{birth_date}', desc: '個人吉日摘要' },
  { path: '/lucky-days/calendar/{birth_date}/{year}/{month}', desc: '吉日月曆' },
  { path: '/compatibility', desc: '相性診斷' },
  { path: '/startup/industry/{birth_date}', desc: '創業行業建議' },
  { path: '/mansions', desc: '二十七宿資料' },
  { path: '/relations', desc: '六種相性關係' },
  { path: '/metadata', desc: '宿曜道典籍資訊' },
]

export default function TechPage() {
  return (
    <div className='mx-auto w-full max-w-2xl px-4 pb-16 flex flex-col gap-8'>
      <div className='pt-6 flex items-center gap-3'>
        <Link
          href='/about'
          className='text-xs text-muted-foreground hover:text-foreground transition-colors'
        >
          ‹ 關於
        </Link>
        <h1 className='text-xl font-bold text-foreground'>技術架構</h1>
      </div>

      {TECH_STACK.map((section) => (
        <section key={section.category} className='flex flex-col gap-3'>
          <h2 className='text-sm font-semibold text-foreground border-b border-border pb-2'>
            {section.category}
          </h2>
          <div className='flex flex-col gap-2'>
            {section.items.map((item) => (
              <div
                key={item.name}
                className='flex items-start gap-3 px-3 py-2.5 rounded-md bg-muted/30'
              >
                <span className='text-sm font-medium text-foreground w-40 shrink-0'>{item.name}</span>
                <span className='text-xs text-muted-foreground leading-relaxed'>{item.desc}</span>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className='flex flex-col gap-3'>
        <h2 className='text-sm font-semibold text-foreground border-b border-border pb-2'>
          API 端點
        </h2>
        <p className='text-xs text-muted-foreground'>
          後端 API：{' '}
          <code className='text-xs bg-muted px-1.5 py-0.5 rounded'>
            dashai-api.onrender.com/shukuyo
          </code>
        </p>
        <div className='flex flex-col gap-1'>
          {API_ENDPOINTS.map((ep) => (
            <div key={ep.path} className='flex items-center gap-3 py-1.5 border-b border-border/50'>
              <code className='text-xs text-primary font-mono flex-1 min-w-0 truncate'>
                {ep.path}
              </code>
              <span className='text-xs text-muted-foreground shrink-0'>{ep.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className='flex flex-col gap-3'>
        <h2 className='text-sm font-semibold text-foreground border-b border-border pb-2'>
          AI 輔助開發聲明
        </h2>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          本服務的程式碼與部分內容由 Claude Code（Anthropic）輔助開發完成。
          所有 git commit 包含 Co-Authored-By 標註。
        </p>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          曆法計算邏輯依據《文殊師利菩薩及諸仙所說吉凶時日善惡宿曜經》（大正藏 T1299）實作，
          非 AI 生成，經人工逐一比對原典驗證。
        </p>
      </section>
    </div>
  )
}
