import React, { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue, useReducedMotion } from 'framer-motion'

interface CharacterProps {
  char: string
  progress: MotionValue<number>
  range: [number, number]
}

const Character: React.FC<CharacterProps> = ({ char, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1])
  const color = useTransform(
    progress,
    range,
    ['rgba(215, 226, 234, 0.2)', 'rgba(215, 226, 234, 1)']
  )

  return (
    <motion.span
      style={{ opacity, color }}
      className="inline-block transition-colors duration-75"
    >
      {char}
    </motion.span>
  )
}

interface WordProps {
  word: string
  progress: MotionValue<number>
  wordStart: number
  wordEnd: number
  totalChars: number
}

const Word: React.FC<WordProps> = ({ word, progress, wordStart, totalChars }) => {
  const characters = word.split('')
  const amount = 1 / totalChars

  return (
    <span className="inline-block whitespace-nowrap mr-[0.28em]">
      {characters.map((char, index) => {
        const charStart = (wordStart + index) * amount
        const charEnd = charStart + amount * 1.5 // slight overlap for silky transition
        return (
          <Character
            key={index}
            char={char}
            progress={progress}
            range={[charStart, Math.min(charEnd, 1)]}
          />
        )
      })}
    </span>
  )
}

export interface AnimatedTextProps {
  text: string
  className?: string
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.25'],
  })

  if (shouldReduceMotion) {
    return <p className={className}>{text}</p>
  }

  const words = text.split(' ')
  let charCounter = 0
  const totalChars = text.length

  return (
    <p
      ref={containerRef}
      className={`leading-relaxed select-none ${className}`}
    >
      {words.map((word, i) => {
        const wordStart = charCounter
        charCounter += word.length + 1 // +1 for the space
        return (
          <Word
            key={i}
            word={word}
            progress={scrollYProgress}
            wordStart={wordStart}
            wordEnd={wordStart + word.length}
            totalChars={totalChars}
          />
        )
      })}
    </p>
  )
}
