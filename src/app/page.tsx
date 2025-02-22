'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface StickerPosition {
  x: number
  y: number
  sticker: string
  rotation: number
  id: string
  velocityX: number
  velocityY: number
  scale: number
  scaleVelocity: number
}

const STICKER_OPTIONS = [
  '/stickers/unicorn1.png',
  '/stickers/unicorn2.png',
  '/stickers/unicorn3.png',
  // Add more sticker paths here
]

const STICKER_SIZE = 50
const BOUNCE_FACTOR = 0.8
const MIN_SPEED = 1
const MAX_SPEED = 4
const COLLISION_RADIUS = STICKER_SIZE * 0.4 // Smaller collision circle
const SEPARATION_FORCE = 1.5 // Force to push apart stuck stickers
const SCALE_SPEED = 0.02  // Speed of size change
const MIN_SCALE = 0.7     // Minimum size multiplier
const MAX_SCALE = 1.3     // Maximum size multiplier

export default function Home() {
  const [selectedSticker, setSelectedSticker] = useState(STICKER_OPTIONS[0])
  const [placedStickers, setPlacedStickers] = useState<StickerPosition[]>([])

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED)
    const angle = Math.random() * Math.PI * 2
    
    setPlacedStickers([
      ...placedStickers,
      { 
        x, 
        y, 
        sticker: selectedSticker, 
        rotation: Math.random() * 360,
        id: Math.random().toString(),
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        scale: 1,
        scaleVelocity: SCALE_SPEED * (Math.random() > 0.5 ? 1 : -1)
      }
    ])
  }

  useEffect(() => {
    let animationFrameId: number

    const updatePositions = () => {
      setPlacedStickers(prevStickers => {
        const newStickers = [...prevStickers]
        
        for (let i = 0; i < newStickers.length; i++) {
          // Update position and scale
          newStickers[i].x += newStickers[i].velocityX
          newStickers[i].y += newStickers[i].velocityY
          newStickers[i].scale += newStickers[i].scaleVelocity

          // Reverse scale velocity when limits reached
          if (newStickers[i].scale <= MIN_SCALE || newStickers[i].scale >= MAX_SCALE) {
            newStickers[i].scaleVelocity *= -1
          }

          // Bounce off walls
          if (newStickers[i].x <= 0 || newStickers[i].x >= window.innerWidth - STICKER_SIZE) {
            newStickers[i].velocityX *= -BOUNCE_FACTOR
            // Push away from wall
            newStickers[i].x = Math.max(0, Math.min(window.innerWidth - STICKER_SIZE, newStickers[i].x))
          }
          if (newStickers[i].y <= 0 || newStickers[i].y >= 600 - STICKER_SIZE) {
            newStickers[i].velocityY *= -BOUNCE_FACTOR
            // Push away from wall
            newStickers[i].y = Math.max(0, Math.min(600 - STICKER_SIZE, newStickers[i].y))
          }

          // Check collisions with other stickers
          for (let j = i + 1; j < newStickers.length; j++) {
            const dx = newStickers[i].x - newStickers[j].x
            const dy = newStickers[i].y - newStickers[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < COLLISION_RADIUS * 2) { // Using diameter for collision check
              // Calculate collision normal
              const nx = dx / distance
              const ny = dy / distance
              
              // Separate the stickers
              const overlap = COLLISION_RADIUS * 2 - distance
              const separationX = nx * overlap * 0.5 * SEPARATION_FORCE
              const separationY = ny * overlap * 0.5 * SEPARATION_FORCE
              
              newStickers[i].x += separationX
              newStickers[i].y += separationY
              newStickers[j].x -= separationX
              newStickers[j].y -= separationY

              // Calculate bounce velocities
              const tempVX = newStickers[i].velocityX
              const tempVY = newStickers[i].velocityY
              
              newStickers[i].velocityX = newStickers[j].velocityX * BOUNCE_FACTOR
              newStickers[i].velocityY = newStickers[j].velocityY * BOUNCE_FACTOR
              newStickers[j].velocityX = tempVX * BOUNCE_FACTOR
              newStickers[j].velocityY = tempVY * BOUNCE_FACTOR

              // Add some random spin
              newStickers[i].rotation += Math.random() * 30 - 15
              newStickers[j].rotation += Math.random() * 30 - 15
            }
          }
        }
        return newStickers
      })

      animationFrameId = requestAnimationFrame(updatePositions)
    }

    animationFrameId = requestAnimationFrame(updatePositions)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <main className="min-h-screen p-4">
      <style jsx global>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -10px) rotate(5deg); }
          50% { transform: translate(0, -20px) rotate(0deg); }
          75% { transform: translate(-10px, -10px) rotate(-5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        .sticker-float {
          animation: float 6s ease-in-out infinite;
          animation-delay: var(--delay);
        }

        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        .scroll-text {
          animation: scroll 10s linear infinite;
          white-space: nowrap;
        }
      `}</style>

      <div className="overflow-hidden bg-purple-500 text-white py-2 mb-4">
        <div className="scroll-text text-2xl font-bold">
          🦄 LOOK AT THEM GO! 🦄 WATCH THEM BOUNCE! 🦄 SO MANY UNICORNS! 🦄
        </div>
      </div>

      <div className="mb-4 flex gap-2 justify-center">
        {STICKER_OPTIONS.map((sticker) => (
          <button
            key={sticker}
            className={`p-2 rounded-lg ${selectedSticker === sticker ? 'bg-purple-200' : 'bg-gray-100'}`}
            onClick={() => setSelectedSticker(sticker)}
          >
            <div className="relative w-12 h-12">
              <Image
                src={sticker}
                alt="Sticker option"
                fill
                className="object-contain"
              />
            </div>
          </button>
        ))}
      </div>

      <div 
        className="relative w-full h-[600px] bg-white rounded-lg shadow-inner cursor-crosshair"
        onClick={handleCanvasClick}
      >
        {placedStickers.map((sticker) => (
          <div
            key={sticker.id}
            className="absolute transition-transform"
            style={{
              left: sticker.x - STICKER_SIZE/2,
              top: sticker.y - STICKER_SIZE/2,
              transform: `rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
            }}
          >
            <div className="relative w-[50px] h-[50px]">
              <Image
                src={sticker.sticker}
                alt="Placed sticker"
                fill
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-gray-600">
        Click anywhere on the canvas to place bouncing stickers!
      </div>
    </main>
  )
} 