'use client'
import React, { useState } from 'react'
import Image from 'next/image'

interface CrosswordCell {
  letter: string
  number?: number
  isActive: boolean
  x: number
  y: number
}

interface CrosswordClue {
  number: number
  clue: string
  answer: string
  direction: 'across' | 'down'
  x: number
  y: number
}

const GRID_SIZE = 15
const CELL_SIZE = 40

const CROSSWORD_CLUES: CrosswordClue[] = [
  {
    number: 1,
    clue: "A unicorn's magical projection from its forehead",
    answer: "HORN",
    direction: 'across',
    x: 2,
    y: 0
  },
  {
    number: 2,
    clue: "Unicorns love to eat these colorful treats",
    answer: "RAINBOW",
    direction: 'down',
    x: 4,
    y: 0
  },
  {
    number: 3,
    clue: "Magical dust that unicorns spread",
    answer: "SPARKLES",
    direction: 'across',
    x: 0,
    y: 3
  },
  {
    number: 4,
    clue: "Unicorns are known for their _____ manes",
    answer: "MAGICAL",
    direction: 'down',
    x: 2,
    y: 2
  },
  {
    number: 5,
    clue: "A baby unicorn",
    answer: "FOAL",
    direction: 'across',
    x: 7,
    y: 5
  },
  {
    number: 6,
    clue: "Unicorns live in this mystical place",
    answer: "CLOUDS",
    direction: 'down',
    x: 8,
    y: 1
  }
]

export default function Crossword() {
  const [grid, setGrid] = useState<CrosswordCell[][]>(() => {
    // Initialize empty grid
    const newGrid: CrosswordCell[][] = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({
        letter: '',
        isActive: false,
        x: 0,
        y: 0
      }))
    )

    // Mark active cells and add numbers
    CROSSWORD_CLUES.forEach(clue => {
      let { x, y } = clue
      const letters = clue.answer.split('')
      
      letters.forEach((letter, index) => {
        const cell = newGrid[y][x]
        cell.isActive = true
        if (index === 0) {
          cell.number = clue.number
        }
        if (clue.direction === 'across') {
          x++
        } else {
          y++
        }
      })
    })

    return newGrid
  })

  const [selectedClue, setSelectedClue] = useState<CrosswordClue | null>(null)
  const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({})
  const [completed, setCompleted] = useState(false)
  const [selectedCell, setSelectedCell] = useState<{x: number, y: number} | null>(null)

  const getNextCell = (x: number, y: number, direction: 'next' | 'prev'): {x: number, y: number} | null => {
    const currentClue = CROSSWORD_CLUES.find(clue => {
      let currX = clue.x
      let currY = clue.y
      const length = clue.answer.length
      
      for (let i = 0; i < length; i++) {
        if (currX === x && currY === y) return true
        if (clue.direction === 'across') currX++
        else currY++
      }
      return false
    })

    if (!currentClue) return null

    let nextX = x
    let nextY = y

    if (currentClue.direction === 'across') {
      nextX += direction === 'next' ? 1 : -1
    } else {
      nextY += direction === 'next' ? 1 : -1
    }

    // Check if the next cell is active
    if (grid[nextY]?.[nextX]?.isActive) {
      return { x: nextX, y: nextY }
    }
    return null
  }

  const handleCellInput = (x: number, y: number, value: string) => {
    const key = `${x},${y}`
    const newAnswers = { ...userAnswers, [key]: value.toUpperCase() }
    setUserAnswers(newAnswers)

    // Check if puzzle is complete
    let isComplete = true
    CROSSWORD_CLUES.forEach(clue => {
      let currX = clue.x
      let currY = clue.y
      const answer = clue.answer.split('')
      
      answer.forEach(letter => {
        const key = `${currX},${currY}`
        if (newAnswers[key] !== letter) {
          isComplete = false
        }
        if (clue.direction === 'across') {
          currX++
        } else {
          currY++
        }
      })
    })
    
    setCompleted(isComplete)

    if (value !== '') {
      // Move to next cell if there is one
      const nextCell = getNextCell(x, y, 'next')
      if (nextCell) {
        setSelectedCell(nextCell)
        // Focus the next input
        const nextInput = document.querySelector(
          `input[data-x="${nextCell.x}"][data-y="${nextCell.y}"]`
        ) as HTMLInputElement
        nextInput?.focus()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, x: number, y: number) => {
    if (e.key === 'Backspace' && !userAnswers[`${x},${y}`]) {
      e.preventDefault()
      const prevCell = getNextCell(x, y, 'prev')
      if (prevCell) {
        setSelectedCell(prevCell)
        const prevInput = document.querySelector(
          `input[data-x="${prevCell.x}"][data-y="${prevCell.y}"]`
        ) as HTMLInputElement
        if (prevInput) {
          prevInput.focus()
          // Clear the previous cell
          setUserAnswers(prev => {
            const newAnswers = { ...prev }
            delete newAnswers[`${prevCell.x},${prevCell.y}`]
            return newAnswers
          })
        }
      }
    }
  }

  return (
    <main className="min-h-screen p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Unicorn Crossword</h1>
      
      <div className="flex gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Clues</h2>
          <div className="space-y-2">
            <h3 className="font-bold">Across</h3>
            {CROSSWORD_CLUES.filter(c => c.direction === 'across').map(clue => (
              <div
                key={clue.number}
                className={`cursor-pointer p-1 rounded ${
                  selectedClue?.number === clue.number ? 'bg-purple-100' : ''
                }`}
                onClick={() => setSelectedClue(clue)}
              >
                {clue.number}. {clue.clue}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <h3 className="font-bold">Down</h3>
            {CROSSWORD_CLUES.filter(c => c.direction === 'down').map(clue => (
              <div
                key={clue.number}
                className={`cursor-pointer p-1 rounded ${
                  selectedClue?.number === clue.number ? 'bg-purple-100' : ''
                }`}
                onClick={() => setSelectedClue(clue)}
              >
                {clue.number}. {clue.clue}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          {grid.map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => (
                <div
                  key={`${x},${y}`}
                  className={`
                    w-10 h-10
                    border border-gray-300
                    flex items-center justify-center
                    relative
                    ${cell.isActive ? 'bg-white' : 'bg-gray-200'}
                  `}
                >
                  {cell.number && (
                    <span className="absolute top-0 left-1 text-xs">{cell.number}</span>
                  )}
                  {cell.isActive && (
                    <input
                      type="text"
                      maxLength={1}
                      data-x={x}
                      data-y={y}
                      className="w-8 h-8 text-center uppercase font-bold outline-none"
                      value={userAnswers[`${x},${y}`] || ''}
                      onChange={(e) => handleCellInput(x, y, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, x, y)}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}