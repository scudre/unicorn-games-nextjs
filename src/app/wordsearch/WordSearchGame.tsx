'use client'
import { useState } from 'react'

interface Props {
  grid: string[][]
  words: string[]
  positions: {
    word: string
    start: [number, number]
    end: [number, number]
  }[]
}

export default function WordSearchGame({ grid, words, positions }: Props) {
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([])
  const [foundWords, setFoundWords] = useState<string[]>([])

  const handleCellClick = (row: number, col: number) => {
    if (selectedCells.length === 0) {
      setSelectedCells([[row, col]])
    } else {
      const [firstCell] = selectedCells
      // Check if new selection is in same row or column
      if (row === firstCell[0] || col === firstCell[1]) {
        setSelectedCells([...selectedCells, [row, col]])
        // Check if word is found
        const word = positions.find(pos => 
          (pos.start[0] === firstCell[0] && pos.start[1] === firstCell[1] &&
           pos.end[0] === row && pos.end[1] === col) ||
          (pos.end[0] === firstCell[0] && pos.end[1] === firstCell[1] &&
           pos.start[0] === row && pos.start[1] === col)
        )
        if (word && !foundWords.includes(word.word)) {
          setFoundWords([...foundWords, word.word])
        }
      } else {
        // Clear selection if not in same row/column
        setSelectedCells([[row, col]])
      }
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-purple-600">Unicorn Word Search</h1>
      <div className="flex gap-8">
        <div className="grid grid-cols-10 gap-1 bg-pink-100 p-4 rounded-lg">
          {grid.map((row, i) => 
            row.map((cell, j) => (
              <button
                key={`${i}-${j}`}
                onClick={() => handleCellClick(i, j)}
                className={`
                  w-10 h-10 flex items-center justify-center font-bold rounded
                  ${selectedCells.some(([r, c]) => r === i && c === j) ? 'bg-purple-400 text-white' : 
                    foundWords.some(word => 
                      positions.find(p => p.word === word)?.start[0] === i && 
                      positions.find(p => p.word === word)?.start[1] === j
                    ) ? 'bg-green-300' : 'bg-white'}
                  hover:bg-purple-200 transition-colors
                `}
              >
                {cell}
              </button>
            ))
          )}
        </div>
        <div className="bg-pink-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2 text-purple-600">Find these words:</h2>
          <ul className="space-y-2">
            {words.map(word => (
              <li
                key={word}
                className={foundWords.includes(word) ? 'line-through text-green-600' : 'text-gray-700'}
              >
                {word}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
} 