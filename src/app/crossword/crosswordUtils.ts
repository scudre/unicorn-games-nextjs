interface Word {
  word: string
  clue: string
}

interface Position {
  row: number
  col: number
  direction: 'across' | 'down'
  length: number
  number: number
}

export interface Puzzle {
  grid: string[][]
  positions: Position[]
  size: number
}

export function generateCrossword(words: Word[]): Puzzle {
  const size = 15
  const grid = Array(size).fill('.').map(() => Array(size).fill('.'))
  const positions: Position[] = []
  let wordNumber = 1

  // Sort words by length (longest first)
  const sortedWords = [...words].sort((a, b) => b.word.length - a.word.length)

  // Place first word horizontally in center
  const firstWord = sortedWords[0].word
  const centerRow = Math.floor(size/2)
  const startCol = Math.floor((size - firstWord.length)/2)
  
  for (let i = 0; i < firstWord.length; i++) {
    grid[centerRow][startCol + i] = firstWord[i]
  }
  
  positions.push({
    row: centerRow,
    col: startCol,
    direction: 'across',
    length: firstWord.length,
    number: wordNumber++
  })

  // Try to place remaining words
  for (let i = 1; i < sortedWords.length; i++) {
    const word = sortedWords[i].word
    let placed = false

    // Try to intersect with each placed word
    for (let row = 1; row < size-1 && !placed; row++) {
      for (let col = 1; col < size-1 && !placed; col++) {
        // Try each letter of current word
        for (let letterIndex = 0; letterIndex < word.length && !placed; letterIndex++) {
          // Check if we can place vertically
          if (row - letterIndex >= 0 && 
              row + (word.length - letterIndex) <= size &&
              grid[row][col] === word[letterIndex]) {
            
            let canPlace = true
            // Verify placement
            for (let j = 0; j < word.length; j++) {
              const r = row - letterIndex + j
              if (grid[r][col] !== '.' && grid[r][col] !== word[j]) {
                canPlace = false
                break
              }
            }

            if (canPlace) {
              // Place the word
              for (let j = 0; j < word.length; j++) {
                grid[row - letterIndex + j][col] = word[j]
              }
              positions.push({
                row: row - letterIndex,
                col,
                direction: 'down',
                length: word.length,
                number: wordNumber++
              })
              placed = true
              break
            }
          }
        }
      }
    }
  }

  // Trim the grid
  let minRow = size, maxRow = 0, minCol = size, maxCol = 0
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j] !== '.') {
        minRow = Math.min(minRow, i)
        maxRow = Math.max(maxRow, i)
        minCol = Math.min(minCol, j)
        maxCol = Math.max(maxCol, j)
      }
    }
  }

  const trimmedGrid = grid
    .slice(Math.max(0, minRow - 1), maxRow + 2)
    .map(row => row.slice(Math.max(0, minCol - 1), maxCol + 2))

  const adjustedPositions = positions.map(p => ({
    ...p,
    row: p.row - minRow + 1,
    col: p.col - minCol + 1
  }))

  return {
    grid: trimmedGrid,
    positions: adjustedPositions,
    size: Math.max(maxRow - minRow + 3, maxCol - minCol + 3)
  }
} 