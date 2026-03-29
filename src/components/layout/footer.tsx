import Link from 'next/link'

export function Footer() {
  return (
    <footer className='border-t border-border bg-background py-8'>
      <div className='mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3'>
        <p className='text-xs text-muted-foreground'>
          &copy; 2026 宿曜道 Shukuyodo
        </p>
        <nav className='flex items-center gap-4'>
          <Link
            href='/about'
            className='text-xs text-muted-foreground hover:text-foreground transition-colors duration-200'
          >
            About
          </Link>
          <Link
            href='/about/tech'
            className='text-xs text-muted-foreground hover:text-foreground transition-colors duration-200'
          >
            Tech
          </Link>
        </nav>
      </div>
    </footer>
  )
}
