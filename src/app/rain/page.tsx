'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface FallingSticker {
  id: string
  x: number
  y: number
  speed: number
  rotation: number
  sticker: string
}

const STICKER_OPTIONS = [
  '/stickers/unicorn1.png',
  '/stickers/unicorn2.png',
  '/stickers/unicorn3.png',
]

const GAME_DURATION = 60 // Game lasts 60 seconds
const SPAWN_INTERVAL = 500 // Spawn every 0.5 seconds

export default function Rain() {
  const [stickers, setStickers] = useState<FallingSticker[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)

  const startNewGame = () => {
    setScore(0)
    setStickers([])
    setGameOver(false)
    setTimeLeft(GAME_DURATION)
  }

  useEffect(() => {
    if (gameOver) return

    const addSticker = () => {
      const newSticker = {
        id: Math.random().toString(),
        x: Math.random() * (window.innerWidth - 50),
        y: -50,
        speed: 2 + Math.random() * (2 + score/20),
        rotation: Math.random() * 360,
        sticker: STICKER_OPTIONS[Math.floor(Math.random() * STICKER_OPTIONS.length)]
      }
      setStickers(prev => [...prev, newSticker])
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          setGameOver(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const spawnInterval = setInterval(addSticker, SPAWN_INTERVAL)
    const gameLoop = setInterval(() => {
      setStickers(prev => {
        return prev
          .map(sticker => ({
            ...sticker,
            y: sticker.y + sticker.speed,
            rotation: sticker.rotation + 1
          }))
          .filter(sticker => sticker.y < window.innerHeight)
      })
    }, 16)

    return () => {
      clearInterval(timer)
      clearInterval(spawnInterval)
      clearInterval(gameLoop)
    }
  }, [gameOver, score])

  const handleClick = (stickerId: string) => {
    setScore(prev => prev + 1)
    setStickers(prev => prev.filter(s => s.id !== stickerId))
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="fixed top-24 right-4 bg-purple-500 text-white px-4 py-2 rounded-lg flex gap-4">
        <div>Score: {score}</div>
        <div>Time: {timeLeft}s</div>
      </div>
      
      {gameOver ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Time&apos;s Up!</h2>
            <p className="mb-4">Final Score: {score}</p>
            <button
              className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
              onClick={startNewGame}
            >
              Play Again
            </button>
          </div>
        </div>
      ) : (
        stickers.map(sticker => (
          <div
            key={sticker.id}
            className="absolute cursor-pointer hover:scale-110 transition-transform"
            style={{
              left: sticker.x,
              top: sticker.y,
              transform: `rotate(${sticker.rotation}deg)`,
              padding: '15px'
            }}
            onClick={() => handleClick(sticker.id)}
          >
            <div className="relative w-[50px] h-[50px]">
              <Image
                src={sticker.sticker}
                alt="Falling sticker"
                fill
                className="object-contain pointer-events-none"
              />
            </div>
          </div>
        ))
      )}
    </main>
  )
} 