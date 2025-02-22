'use client'
import { useState } from 'react'

export default function WordSearchGame({ grid, words, positions }) {
  const [selectedCells, setSelectedCells] = useState([])
  const [foundWords, setFoundWords] = useState([])

  const isCellInFoundWord = (row, col) => {
    return foundWords.some(word => {
      const pos = positions.find(p => p.word === word)
      if (!pos) return false
      
      const { start, end } = pos
      if (start[0] === end[0]) { // Horizontal word
        return row === start[0] && 
               col >= Math.min(start[1], end[1]) && 
               col <= Math.max(start[1], end[1])
      } else { // Vertical word
        return col === start[1] && 
               row >= Math.min(start[0], end[0]) && 
               row <= Math.max(start[0], end[0])
      }
    })
  }

  const handleCellClick = (row, col) => {
    if (selectedCells.length === 0) {
      setSelectedCells([[row, col]])
    } else {
      const [firstCell] = selectedCells
      if (row === firstCell[0] || col === firstCell[1]) {
        const word = positions.find(pos => 
          (pos.start[0] === firstCell[0] && pos.start[1] === firstCell[1] &&
           pos.end[0] === row && pos.end[1] === col) ||
          (pos.end[0] === firstCell[0] && pos.end[1] === firstCell[1] &&
           pos.start[0] === row && pos.start[1] === col)
        if (word && !foundWords.includes(word.word)) {
          setFoundWords([...foundWords, word.word])
          setSelectedCells([]) // Clear selection after finding word
        } else {
          setSelectedCells([...selectedCells, [row, col]])
        }
      } else {
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
                  ${isCellInFoundWord(i, j) ? 'bg-green-300' : 
                    selectedCells.some(([r, c]) => r === i && c === j) ? 'bg-purple-400 text-white' : 
                    'bg-white'}
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
                className={`${foundWords.includes(word) ? 'line-through text-green-600' : 'text-gray-700'}`}
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