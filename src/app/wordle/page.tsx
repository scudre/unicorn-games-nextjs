'use client'
import { useState, useEffect } from 'react'

// These are the only possible target words
const UNICORN_WORDS = [
  'MAGIC', 'SHINE', 'DREAM', 'STARS', 'FAIRY',
  'WINGS', 'SPARK', 'GLOWS', 'HEART', 'DANCE',
  'CLOUD', 'HAPPY', 'SWEET', 'CHARM', 'LIGHT'
]

// Additional valid 5-letter words for guessing
const VALID_GUESSES = [
  'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT',
  'AFTER', 'AGAIN', 'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT',
  'ALIKE', 'ALIVE', 'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGER',
  'ANGLE', 'ANGRY', 'APART', 'APPLE', 'APPLY', 'ARENA', 'ARGUE', 'ARISE',
  'ARRAY', 'ASIDE', 'ASSET', 'AUDIO', 'AUDIT', 'AVOID', 'AWARD', 'AWARE',
  'BADLY', 'BAKER', 'BASES', 'BASIC', 'BASIS', 'BEACH', 'BEGAN', 'BEGIN',
  'BEGUN', 'BEING', 'BELOW', 'BENCH', 'BILLY', 'BIRTH', 'BLACK', 'BLAME',
  'BLIND', 'BLOCK', 'BLOOD', 'BOARD', 'BOOST', 'BOOTH', 'BOUND', 'BRAIN',
  'BRAND', 'BREAD', 'BREAK', 'BREED', 'BRIEF', 'BRING', 'BROAD', 'BROKE',
  'BROWN', 'BUILD', 'BUILT', 'BUYER', 'CABLE', 'CALIF', 'CARRY', 'CATCH',
  'CAUSE', 'CHAIN', 'CHAIR', 'CHART', 'CHASE', 'CHEAP', 'CHECK', 'CHEST',
  'CHIEF', 'CHILD', 'CHINA', 'CHOSE', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN',
  'CLEAR', 'CLICK', 'CLOCK', 'CLOSE', 'COACH', 'COAST', 'COULD', 'COUNT',
  'COURT', 'COVER', 'CRAFT', 'CRASH', 'CREAM', 'CRIME', 'CROSS', 'CROWD',
  'CROWN', 'CURVE', 'CYCLE', 'DAILY', 'DANCE', 'DATED', 'DEALT', 'DEATH',
  'DEBUT', 'DELAY', 'DEPTH', 'DOING', 'DOUBT', 'DOZEN', 'DRAFT', 'DRAMA',
  'DRAWN', 'DRESS', 'DRILL', 'DRINK', 'DRIVE', 'DROVE', 'DYING', 'EAGER',
  'EARLY', 'EARTH', 'EIGHT', 'ELITE', 'EMPTY', 'ENEMY', 'ENJOY', 'ENTER',
  'ENTRY', 'EQUAL', 'ERROR', 'EVENT', 'EVERY', 'EXACT', 'EXIST', 'EXTRA',
  'FAITH', 'FALSE', 'FAULT', 'FIBER', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT',
  'FINAL', 'FIRST', 'FIXED', 'FLASH', 'FLEET', 'FLOOR', 'FLUID', 'FOCUS',
  'FORCE', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRANK', 'FRAUD',
  'FRESH', 'FRONT', 'FRUIT', 'FULLY', 'FUNNY', 'GIANT', 'GIVEN', 'GLASS',
  'GLOBE', 'GOING', 'GRACE', 'GRADE', 'GRAND', 'GRANT', 'GRASS', 'GREAT',
  'GREEN', 'GROSS', 'GROUP', 'GROWN', 'GUARD', 'GUESS', 'GUEST', 'GUIDE',
  'HAPPY', 'HARRY', 'HEART', 'HEAVY', 'HENCE', 'HENRY', 'HORSE', 'HOTEL',
  'HOUSE', 'HUMAN', 'IDEAL', 'IMAGE', 'INDEX', 'INNER', 'INPUT', 'ISSUE',
  'JAPAN', 'JIMMY', 'JOINT', 'JONES', 'JUDGE', 'KNOWN', 'LABEL', 'LARGE',
  'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEARN', 'LEASE', 'LEAST', 'LEAVE',
  'LEGAL', 'LEVEL', 'LEWIS', 'LIGHT', 'LIMIT', 'LINKS', 'LIVES', 'LOCAL',
  'LOGIC', 'LOOSE', 'LOWER', 'LUCKY', 'LUNCH', 'LYING', 'MAGIC', 'MAJOR',
  'MAKER', 'MARCH', 'MARIA', 'MATCH', 'MAYBE', 'MAYOR', 'MEANT', 'MEDIA',
  'METAL', 'MIGHT', 'MINOR', 'MINUS', 'MIXED', 'MODEL', 'MONEY', 'MONTH',
  'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVIE', 'MUSIC', 'NEEDS',
  'NEVER', 'NEWLY', 'NIGHT', 'NOISE', 'NORTH', 'NOTED', 'NOVEL', 'NURSE',
  ...UNICORN_WORDS // Include unicorn words in valid guesses
]

const WORD_LENGTH = 5
const MAX_GUESSES = 6

interface GuessResult {
  letter: string
  state: 'correct' | 'present' | 'absent'
}

export default function Wordle() {
  const [targetWord, setTargetWord] = useState('')
  const [currentGuess, setCurrentGuess] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [shake, setShake] = useState(false)

  useEffect(() => {
    setTargetWord(UNICORN_WORDS[Math.floor(Math.random() * UNICORN_WORDS.length)])
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return
      
      if (e.key === 'Enter') {
        if (currentGuess.length !== WORD_LENGTH) {
          setMessage('Word must be 5 letters!')
          setShake(true)
          setTimeout(() => setShake(false), 500)
          return
        }
        
        if (!VALID_GUESSES.includes(currentGuess)) {
          setMessage('Not in word list!')
          setShake(true)
          setTimeout(() => setShake(false), 500)
          return
        }

        const newGuesses = [...guesses, currentGuess]
        setGuesses(newGuesses)
        setCurrentGuess('')

        if (currentGuess === targetWord) {
          setGameOver(true)
          setMessage('✨ Magical! ✨')
        } else if (newGuesses.length >= MAX_GUESSES) {
          setGameOver(true)
          setMessage(`The word was ${targetWord}`)
        }
      } else if (e.key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1))
        setMessage('')
      } else if (/^[A-Za-z]$/.test(e.key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess(prev => (prev + e.key).toUpperCase())
        setMessage('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentGuess, gameOver, guesses, targetWord])

  const checkGuess = (guess: string): GuessResult[] => {
    const result: GuessResult[] = []
    const targetLetters = targetWord.split('')
    
    // First pass: mark correct letters
    guess.split('').forEach((letter, i) => {
      if (letter === targetLetters[i]) {
        result[i] = { letter, state: 'correct' }
        targetLetters[i] = '#' // Mark as used
      }
    })

    // Second pass: mark present/absent letters
    guess.split('').forEach((letter, i) => {
      if (result[i]) return // Skip already marked correct letters
      
      const targetIndex = targetLetters.indexOf(letter)
      if (targetIndex !== -1) {
        result[i] = { letter, state: 'present' }
        targetLetters[targetIndex] = '#' // Mark as used
      } else {
        result[i] = { letter, state: 'absent' }
      }
    })

    return result
  }

  return (
    <main className="min-h-screen p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Unicorn Wordle</h1>
      
      <div className="mb-4 h-6 text-purple-600 font-bold">{message}</div>

      <div className="grid gap-2 mb-4">
        {[...Array(MAX_GUESSES)].map((_, i) => (
          <div key={i} className="flex gap-2">
            {[...Array(WORD_LENGTH)].map((_, j) => {
              const letter = i === guesses.length ? currentGuess[j] : guesses[i]?.[j]
              const result = guesses[i] ? checkGuess(guesses[i])[j] : null
              
              return (
                <div
                  key={j}
                  className={`
                    w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold
                    ${!letter ? 'border-gray-300' : 'border-gray-400'}
                    ${result?.state === 'correct' ? 'bg-green-500 text-white border-green-500' : ''}
                    ${result?.state === 'present' ? 'bg-yellow-500 text-white border-yellow-500' : ''}
                    ${result?.state === 'absent' ? 'bg-gray-500 text-white border-gray-500' : ''}
                    ${i === guesses.length && shake ? 'animate-shake' : ''}
                    transition-colors
                  `}
                >
                  {letter}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {gameOver && (
        <button
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
          onClick={() => window.location.reload()}
        >
          Play Again
        </button>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </main>
  )
} 