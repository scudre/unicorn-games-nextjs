import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import MobileMenu from '@/components/MobileMenu'

const inter = Inter({ subsets: ['latin'] })

const MENU_ITEMS = [
  { href: "/", label: "Bouncy" },
  { href: "/rain", label: "Sticker Rain" },
  { href: "/catch", label: "Catch Game" },
  { href: "/draw", label: "Draw" },
  { href: "/crossword", label: "Crossword" },
  { href: "/wordle", label: "Wordle" },
  { href: "/wordsearch", label: "Word Search" }
]

export const metadata = {
  title: 'Unicorn Sticker Games',
  description: 'Fun unicorn sticker mini-games!',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
  themeColor: '#A855F7', // Purple-500 color
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-base md:text-[16px]`}>
        <nav className="fixed top-0 left-0 right-0 bg-purple-500 text-white p-4 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">🦄 Unicorn Games</Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-4">
              {MENU_ITEMS.map(item => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="hover:text-purple-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <MobileMenu />
          </div>
        </nav>

        <div className="pt-16 max-w-[100vw] overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  )
} 