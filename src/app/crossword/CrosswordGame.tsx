'use client'
import { useState } from 'react'
import { Puzzle } from './crosswordUtils'

interface Props {
  puzzle: Puzzle
  words: { word: string; clue: string }[]
}

export default function CrosswordGame({ puzzle, words }: Props) {
  const [userInput, setUserInput] = useState<Record<string, string>>({})
  const [isCorrect, setIsCorrect] = useState<Record<string, boolean>>({})

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-purple-600">Unicorn Crossword</h1>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
        <div className="bg-gray-100 p-4 rounded-lg flex justify-center">
          <div className="grid gap-px bg-gray-300">
            {puzzle.grid.map((row, i) => (
              <div key={i} className="flex">
                {row.map((cell, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`
                      w-10 h-10 flex items-center justify-center
                      ${cell === '.' ? 'bg-gray-800' : 'bg-white'}
                      ${isCorrect[`${i}-${j}`] ? 'text-green-600' : ''}
                      font-bold text-lg relative
                    `}
                  >
                    {cell !== '.' && puzzle.positions.some(p => 
                      (p.row === i && p.col === j)
                    ) && (
                      <span className="absolute text-xs top-0.5 left-0.5">
                        {puzzle.positions.find(p => p.row === i && p.col === j)?.number}
                      </span>
                    )}
                    {cell !== '.' && (
                      <input
                        type="text"
                        maxLength={1}
                        className="w-8 h-8 text-center uppercase focus:outline-none"
                        value={userInput[`${i}-${j}`] || ''}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase()
                          setUserInput(prev => ({...prev, [`${i}-${j}`]: value}))
                          setIsCorrect(prev => ({
                            ...prev,
                            [`${i}-${j}`]: value === cell
                          }))
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-pink-50 p-4 rounded-lg min-w-[300px]">
          <h2 className="text-xl font-bold mb-2 text-purple-600">Clues:</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-1">Across</h3>
              <ul className="space-y-1">
                {puzzle.positions
                  .filter(p => p.direction === 'across')
                  .sort((a, b) => a.number - b.number)
                  .map(p => (
                    <li key={p.number} className="text-sm">
                      {p.number}. {words.find(w => 
                        w.word.length === p.length
                      )?.clue}
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-1">Down</h3>
              <ul className="space-y-1">
                {puzzle.positions
                  .filter(p => p.direction === 'down')
                  .sort((a, b) => a.number - b.number)
                  .map(p => (
                    <li key={p.number} className="text-sm">
                      {p.number}. {words.find(w => 
                        w.word.length === p.length
                      )?.clue}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 