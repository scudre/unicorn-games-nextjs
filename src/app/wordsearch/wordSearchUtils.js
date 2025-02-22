export function generateWordSearch(size, words) {
  // Initialize grid with random letters
  const grid = Array(size).fill(null).map(() => 
    Array(size).fill(null).map(() => 
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    )
  );
  
  const positions = [];

  // Place words horizontally and vertically only
  words.forEach(word => {
    const isHorizontal = Math.random() > 0.5;
    const maxStart = size - word.length;
    
    let placed = false;
    while (!placed) {
      const row = Math.floor(Math.random() * (isHorizontal ? size : maxStart));
      const col = Math.floor(Math.random() * (isHorizontal ? maxStart : size));
      
      let canPlace = true;
      for (let i = 0; i < word.length; i++) {
        const r = isHorizontal ? row : row + i;
        const c = isHorizontal ? col + i : col;
        const currentCell = grid[r][c];
        if (currentCell !== word[i] && currentCell !== grid[r][c]) {
          canPlace = false;
          break;
        }
      }
      
      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          const r = isHorizontal ? row : row + i;
          const c = isHorizontal ? col + i : col;
          grid[r][c] = word[i];
        }
        positions.push({
          word,
          start: [row, col],
          end: [isHorizontal ? row : row + word.length - 1, 
                isHorizontal ? col + word.length - 1 : col]
        });
        placed = true;
      }
    }
  });

  return { grid, positions }
} 