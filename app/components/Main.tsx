'use client'

import { languages } from "./utils/data/laguage"
import { getFarewellText, getRandomWord } from "./utils/data/message"
import { useState, useEffect } from "react"
import Confetti from 'react-confetti'
import clsx from "clsx"
import Header from "./Header"
import Timer from "./Timer"

export default function Main() {
    const [currentWord, setCurrentWord] = useState("")
    const [guessedLetters, setGuessedLetters] = useState<string[]>([])
    const [isClient, setIsClient] = useState(false)
    const [hasTimerExpired, setHasTimerExpired] = useState(false)
    const [time, setTime] = useState(60)

    useEffect(() => {
        setIsClient(true)
        setCurrentWord(getRandomWord())
    }, [])

    // Derived values
    const numGuessesLeft = languages.length - 1
    const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length
    const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= numGuessesLeft || hasTimerExpired
    const isGameOver = isGameWon || isGameLost
    const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)
    

    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    function addGuessedLetter(letter: string) {
        setGuessedLetters(prevLetter => 
            prevLetter.includes(letter) ? 
            prevLetter : [...prevLetter, letter])
    }

    function startNewGame() {
        setCurrentWord(getRandomWord())
        setGuessedLetters([])
        setHasTimerExpired(false)
        setTime(60)
    }

    const alphabetElements = alphabet.split("").map((alph) => {
        const isGuessed = guessedLetters.includes(alph)
        const isCorrect = isGuessed && currentWord.includes(alph)
        const isWrong = isGuessed && !currentWord.includes(alph)

        return (
            <button 
                disabled={isGameOver}
                aria-disabled={guessedLetters.includes(alph)}
                aria-label={`Letter ${alph}`}
                onClick={() => addGuessedLetter(alph)}
                key={alph} 
                className={clsx(
                    "text-3xl w-10 h-10 rounded-lg transition-colors border-white border-solid",
                    {
                        "bg-green-600 hover:bg-green-500": isCorrect,
                        "bg-red-600 hover:bg-red-300": isWrong,
                        "bg-orange-500 hover:bg-orange-300": !isGuessed,
                        "opacity-50 cursor-not-allowed": isGameOver
                    }
                )}
            >
                {alph.toUpperCase()}
            </button>
        )
    })

    const languageElements = languages.map((lang, index) => {
        const isLanguageLost = index < wrongGuessCount
        return (
            <span 
                style={{backgroundColor: lang.backgroundColor, color: lang.color}} 
                key={lang.name}
                className={clsx(
                    "px-4 py-1 rounded-lg relative",
                    {
                        "lost": isLanguageLost
                    }
                )}
            >
                {lang.name}
                {isLanguageLost && (
                    <span className="absolute inset-0 flex items-center justify-center text-sm bg-black/70 rounded-lg">
                        💀
                    </span>
                )}
            </span>
        )
    })

    const letterElements = currentWord.split("").map((letter, index) => {
        const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
        return(
            <span 
                className={clsx(
                    "bg-gray-500 w-10 h-10 flex items-center justify-center border-b-4 border-white",
                    {
                        "text-red-800": isGameLost && !guessedLetters.includes(letter)
                    }
                )}
                key={index}
            >
                {shouldRevealLetter ? letter.toUpperCase() : ""}
            </span>
        )
    })

    function renderGameStatus() {
        if (!isGameOver && isLastGuessIncorrect) {
            return (
                <p className="">
                    {getFarewellText(languages[wrongGuessCount - 1].name)}
                </p>
            )
        }

        if (isGameWon) {
            return (
                <>
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                </>
            )
        }
        if (isGameLost) {
            return (
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start doing Cardio 😭</p>
                </>
            )
        }

        return null
    }


    useEffect(() => {
        if (isGameLost || isGameWon || time === 0) return;
    
        const interval = setInterval(() => {
            setTime(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setHasTimerExpired(true);
                    return 0;
                }
                return prev - 1;
            })
        }, 1000);
    
        return () => clearInterval(interval);
    }, [isGameLost, isGameWon, time]);
    

    return (
        <main className="flex flex-col items-center text-center mt-10">
            {isClient ? (
                <>
                    {isGameWon && <Confetti />}
                    <Header />
                    <Timer 
                        time={time}
                    />
                    <section className={clsx(
                        "w-full max-w-md text-white text-2xl font-bold p-8 mt-4 rounded-xl min-h-[100px]",
                        {
                            "bg-green-500": isGameWon,
                            "bg-red-500": isGameLost,
                            "bg-purple-500": !isGameOver && isLastGuessIncorrect,
                            "invisible": !isGameOver && !isLastGuessIncorrect
                        }
                    )}>
                        {renderGameStatus()}
                    </section>
                    <section className="mt-10 flex flex-wrap justify-center gap-2 max-w-xl">
                        {languageElements}
                    </section>
                    <section className="gap-2 text-white text-2xl flex mt-10">
                        {letterElements}
                    </section>
                    <section className="gap-2 flex flex-wrap justify-center mt-10 max-w-lg">
                        {alphabetElements}
                    </section>
                    {isGameOver && (
                        <button 
                            onClick={startNewGame}
                            className="mt-8 px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors text-xl"
                        >
                            New Game
                        </button>
                    )}
                </>
            ) : (
                <div>Loading...</div>
            )}
        </main>
    )
}
