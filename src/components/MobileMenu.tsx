'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import '@/styles/mobileMenu.css'

const MENU_ITEMS = [
  { href: "/", label: "Bouncy" },
  { href: "/rain", label: "Sticker Rain" },
  { href: "/catch", label: "Catch Game" },
  { href: "/draw", label: "Draw" },
  { href: "/crossword", label: "Crossword" }
]

export default function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('body-no-scroll', isMenuOpen)
    return () => document.body.classList.remove('body-no-scroll')
  }, [isMenuOpen])

  return (
    <div className="md:hidden">
      <button 
        className="p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>

      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-purple-500 border-t border-purple-400">
          {MENU_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 hover:bg-purple-600"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 