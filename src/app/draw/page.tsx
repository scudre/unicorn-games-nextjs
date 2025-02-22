'use client'
import React, { useState, useRef } from 'react'
import Image from 'next/image'

const STICKER_OPTIONS = [
  '/stickers/unicorn1.png',
  '/stickers/unicorn2.png',
  '/stickers/unicorn3.png',
]

export default function Draw() {
  const [selectedSticker, setSelectedSticker] = useState(STICKER_OPTIONS[0])
  const [stickers, setStickers] = useState<{x: number; y: number; sticker: string}[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  const placeSticker = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Check if the sticker would be placed within bounds
    // Using 25 since that's half the sticker size (50px)
    if (x < 25 || x > rect.width - 25 || y < 25 || y > rect.height - 25) {
      return
    }
    
    setStickers(prev => [...prev, { x, y, sticker: selectedSticker }])
  }

  return (
    <main className="min-h-screen p-4 flex flex-col">
      <div className="flex gap-2 justify-center mb-4">
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
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded-lg"
          onClick={() => setStickers([])}
        >
          Clear
        </button>
      </div>

      <div 
        ref={canvasRef}
        className="relative flex-1 bg-white rounded-lg shadow-inner cursor-crosshair select-none border-2 border-gray-200"
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
        onMouseLeave={() => setIsDrawing(false)}
        onMouseMove={placeSticker}
      >
        {stickers.map((sticker, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: sticker.x - 25,
              top: sticker.y - 25,
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
    </main>
  )
} 