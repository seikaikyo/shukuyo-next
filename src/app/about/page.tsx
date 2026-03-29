import Link from 'next/link'

const HIGHLIGHTS = [
  {
    key: 'fortune',
    icon: '★',
    title: '運勢預測',
    desc: '依宿曜道曆法，推算日、週、月、年、十年的運勢走向與吉凶概況。',
  },
  {
    key: 'compat',
    icon: '◈',
    title: '相性診斷',
    desc: '輸入兩人生日，推算六種宿曜關係（安危、安壊、義衰、友衰、栄親、栄害）。',
  },
  {
    key: 'lucky',
    icon: '◎',
    title: '個人吉日',
    desc: '依本命宿推算事業、婚姻、旅行等各類重要行事的最佳時機。',
  },
  {
    key: 'startup',
    icon: '◇',
    title: '創業運勢',
    desc: '推薦適合的行業方向，並標示開業吉日，提供創業時機參考。',
  },
  {
    key: 'calendar',
    icon: '◻',
    title: '曆法系統',
    desc: '整合甘露日、金剛峯日、羅刹日、凌犯期、三九秘曆等傳統曆注。',
  },
  {
    key: 'knowledge',
    icon: '◈',
    title: '知識庫',
    desc: '收錄二十七宿完整說明、六種相性關係，以及宿曜道的歷史典故。',
  },
]

export default function AboutPage() {
  return (
    <div className='mx-auto w-full max-w-2xl px-4 pb-16 flex flex-col gap-8'>
      <div className='pt-8 flex flex-col gap-2'>
        <h1 className='text-2xl font-bold text-foreground'>關於宿曜道</h1>
        <p className='text-sm text-muted-foreground'>
          以古典宿曜道曆法為基礎的個人化運勢系統
        </p>
      </div>

      {/* 理念 */}
      <section className='flex flex-col gap-3'>
        <h2 className='text-sm font-semibold text-foreground border-b border-border pb-2'>
          產品理念
        </h2>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          宿曜道（sukuyodo）是源自唐代密教的占星系統，由不空三藏傳入日本，至今仍在日本部分寺院保存傳承。
        </p>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          本服務以《文殊師利菩薩及諸仙所說吉凶時日善惡宿曜經》為核心典據，結合現代農曆曆法計算，
          提供個人化的運勢參考與吉日推算。
        </p>
        <div className='px-4 py-3 border-l-2 border-primary/60 bg-primary/5 rounded-r-md'>
          <p className='text-sm text-muted-foreground leading-relaxed'>
            本服務僅供參考，不構成任何形式的決策建議。
            宿曜道的智慧在於提供另一個觀察角度，最終的選擇仍在於使用者本身。
          </p>
        </div>
      </section>

      {/* 功能亮點 */}
      <section className='flex flex-col gap-3'>
        <h2 className='text-sm font-semibold text-foreground border-b border-border pb-2'>
          主要功能
        </h2>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          {HIGHLIGHTS.map((item) => (
            <div
              key={item.key}
              className='flex flex-col gap-1.5 p-4 rounded-lg border border-border bg-card'
            >
              <div className='flex items-center gap-2'>
                <span className='text-primary text-base'>{item.icon}</span>
                <h3 className='text-sm font-medium text-foreground'>{item.title}</h3>
              </div>
              <p className='text-xs text-muted-foreground leading-relaxed'>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 典據 */}
      <section className='flex flex-col gap-3'>
        <h2 className='text-sm font-semibold text-foreground border-b border-border pb-2'>
          經典依據
        </h2>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          核心依據為唐代不空三藏所譯《文殊師利菩薩及諸仙所說吉凶時日善惡宿曜經》（大正藏 T1299），
          全文可於 CBETA 線上查閱。
        </p>
        <a
          href='https://cbetaonline.dila.edu.tw/zh/T21n1299'
          target='_blank'
          rel='noopener noreferrer'
          className='text-xs text-primary hover:underline self-start'
        >
          查閱原典（CBETA）
        </a>
      </section>

      {/* 隱私 */}
      <section className='flex flex-col gap-3'>
        <h2 className='text-sm font-semibold text-foreground border-b border-border pb-2'>
          隱私說明
        </h2>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          出生日期僅儲存於瀏覽器本機，不會上傳至伺服器。查詢運勢時，出生日期以請求參數方式傳送至 API，
          API 不記錄個人資料。
        </p>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          清除瀏覽器本機儲存即可刪除所有個人資料。
        </p>
      </section>

      {/* 作者 */}
      <section className='flex flex-col gap-3'>
        <h2 className='text-sm font-semibold text-foreground border-b border-border pb-2'>
          開發者
        </h2>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          由 DashAI 開發，以 AI 輔助開發（Claude Code）完成。
        </p>
        <div className='flex gap-3'>
          {[
            { label: 'GitHub', href: 'https://github.com/seikaikyo' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/seikaikyo/' },
            { label: 'Portfolio', href: 'https://portfolio.dashai.dev' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-xs px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors duration-200'
            >
              {label}
            </a>
          ))}
        </div>
      </section>

      {/* tech link */}
      <Link
        href='/about/tech'
        className='flex items-center justify-between px-4 py-3 rounded-lg border border-border hover:border-primary/50 text-sm text-muted-foreground hover:text-foreground transition-all duration-200'
      >
        <span>技術架構</span>
        <span>›</span>
      </Link>
    </div>
  )
}
