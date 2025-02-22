'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  rotation: number
}

interface Brick {
  x: number
  y: number
  width: number
  height: number
  active: boolean
  sticker: string
}

const PADDLE_WIDTH = 100
const PADDLE_HEIGHT = 20
const BALL_SIZE = 30
const BALL_SPEED = 5
const BRICK_ROWS = 4
const BRICK_COLS = 8
const BRICK_HEIGHT = 40
const INITIAL_BALL_SPEED_Y = 5

const STICKER_OPTIONS = [
  '/stickers/unicorn1.png',
  '/stickers/unicorn2.png',
  '/stickers/unicorn3.png',
]

export default function Catch() {
  const [paddle, setPaddle] = useState({ x: 0, width: PADDLE_WIDTH })
  const [ball, setBall] = useState<Ball>({ x: 0, y: 0, dx: 0, dy: 0, rotation: 0 })
  const [bricks, setBricks] = useState<Brick[]>([])
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const paddleRef = useRef(paddle.x)
  const keysRef = useRef({ left: false, right: false })

  // Update paddle ref when state changes
  useEffect(() => {
    paddleRef.current = paddle.x
  }, [paddle.x])

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keysRef.current.left = true
      if (e.key === 'ArrowRight') keysRef.current.right = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keysRef.current.left = false
      if (e.key === 'ArrowRight') keysRef.current.right = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left - paddle.width / 2
    const maxX = canvas.clientWidth - paddle.width
    setPaddle(prev => ({ ...prev, x: Math.max(0, Math.min(x, maxX)) }))
  }

  // Start game
  const startGame = () => {
    if (gameStarted) return
    setGameStarted(true)
    setBall(prev => ({
      ...prev,
      dx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      dy: -INITIAL_BALL_SPEED_Y
    }))
  }

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return
    let lastTime = performance.now()

    const gameLoop = () => {
      const currentTime = performance.now()
      const deltaTime = (currentTime - lastTime) / 16 // Normalize to ~60fps
      lastTime = currentTime

      // Update paddle position based on keyboard input
      if (canvasRef.current && (keysRef.current.left || keysRef.current.right)) {
        const moveAmount = 10 * deltaTime
        const newX = paddleRef.current + (keysRef.current.right ? moveAmount : -moveAmount)
        const maxX = canvasRef.current.clientWidth - PADDLE_WIDTH
        const clampedX = Math.max(0, Math.min(newX, maxX))
        setPaddle(prev => ({ ...prev, x: clampedX }))
      }

      setBall(prev => {
        const canvas = canvasRef.current
        if (!canvas) return prev

        let newX = prev.x + prev.dx * deltaTime
        let newY = prev.y + prev.dy * deltaTime
        let newDx = prev.dx
        let newDy = prev.dy
        let newRotation = prev.rotation + 5 * deltaTime

        // Wall collisions
        if (newX <= 0 || newX >= canvas.clientWidth - BALL_SIZE) {
          newDx = -newDx
        }
        if (newY <= 0) {
          newDy = -newDy
        }

        // Paddle collision
        if (newY >= canvas.clientHeight - PADDLE_HEIGHT - BALL_SIZE &&
            newX + BALL_SIZE >= paddleRef.current &&
            newX <= paddleRef.current + PADDLE_WIDTH) {
          newDy = -Math.abs(newDy)
          const hitPos = (newX + BALL_SIZE/2 - paddleRef.current) / PADDLE_WIDTH
          newDx = BALL_SPEED * (hitPos * 2 - 1)
        }

        // Game over check
        if (newY >= canvas.clientHeight - BALL_SIZE) {
          setGameOver(true)
          return prev
        }

        // Brick collisions
        setBricks(prevBricks => {
          let collided = false
          const newBricks = prevBricks.map(brick => {
            if (!brick.active) return brick
            
            if (newX + BALL_SIZE >= brick.x &&
                newX <= brick.x + brick.width &&
                newY + BALL_SIZE >= brick.y &&
                newY <= brick.y + brick.height) {
              collided = true
              setScore(s => s + 10)
              return { ...brick, active: false }
            }
            return brick
          })

          if (collided) {
            newDy = -newDy
          }

          return newBricks
        })

        return {
          x: newX,
          y: newY,
          dx: newDx,
          dy: newDy,
          rotation: newRotation
        }
      })

      if (!gameOver) {
        requestAnimationFrame(gameLoop)
      }
    }

    const animationId = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(animationId)
  }, [gameStarted, gameOver])

  // Initialize game
  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const width = canvas.clientWidth
    
    // Initialize paddle
    setPaddle(prev => ({ ...prev, x: width / 2 - PADDLE_WIDTH / 2 }))
    
    // Initialize ball
    setBall({
      x: width / 2,
      y: canvas.clientHeight - PADDLE_HEIGHT - BALL_SIZE - 10,
      dx: 0,
      dy: 0,
      rotation: 0
    })

    // Initialize bricks
    const brickWidth = (width - 40) / BRICK_COLS
    const newBricks: Brick[] = []
    
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        newBricks.push({
          x: col * brickWidth + 20,
          y: row * BRICK_HEIGHT + 50,
          width: brickWidth - 4,
          height: BRICK_HEIGHT - 4,
          active: true,
          sticker: STICKER_OPTIONS[Math.floor(Math.random() * STICKER_OPTIONS.length)]
        })
      }
    }
    setBricks(newBricks)
  }, [])

  return (
    <main 
      className="min-h-screen p-4 flex flex-col items-center"
      onClick={startGame}
    >
      <div className="text-2xl mb-4">Score: {score}</div>
      
      <div
        ref={canvasRef}
        className="w-full max-w-3xl h-[600px] bg-purple-100 relative overflow-hidden cursor-none"
        onMouseMove={handleMouseMove}
      >
        {/* Paddle */}
        <div
          className="absolute bg-purple-500 rounded-lg"
          style={{
            left: paddle.x,
            bottom: 0,
            width: paddle.width,
            height: PADDLE_HEIGHT
          }}
        />

        {/* Ball */}
        <div
          className="absolute"
          style={{
            left: ball.x,
            top: ball.y,
            width: BALL_SIZE,
            height: BALL_SIZE,
            transform: `rotate(${ball.rotation}deg)`
          }}
        >
          <Image
            src={STICKER_OPTIONS[0]}
            alt="Ball"
            fill
            className="object-contain"
          />
        </div>

        {/* Bricks */}
        {bricks.map((brick, index) => brick.active && (
          <div
            key={index}
            className="absolute bg-white rounded shadow-md flex items-center justify-center"
            style={{
              left: brick.x,
              top: brick.y,
              width: brick.width,
              height: brick.height
            }}
          >
            <div className="relative w-[30px] h-[30px]">
              <Image
                src={brick.sticker}
                alt="Brick"
                fill
                className="object-contain"
              />
            </div>
          </div>
        ))}

        {/* Game Over */}
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
              <p className="mb-4">Score: {score}</p>
              <button
                className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
                onClick={() => window.location.reload()}
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Start Message */}
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center text-2xl text-purple-700">
            Click to Start!
          </div>
        )}
      </div>
    </main>
  )
} 