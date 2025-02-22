import WordSearchGame from './WordSearchGame'
import { generateWordSearch } from './wordSearchUtils'

const WORDS = [
  'UNICORN',
  'MAGIC',
  'RAINBOW',
  'SPARKLE',
  'GLITTER',
  'DREAM',
  'FAIRY',
  'WINGS'
];

export default function WordSearchPage() {
  const { grid, positions } = generateWordSearch(10, WORDS)
  return <WordSearchGame grid={grid} words={WORDS} positions={positions} />
} 