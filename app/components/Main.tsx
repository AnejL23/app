'use client'

import { languages } from ".././data"
import { useState } from "react"

export default function Main() {

const [currentWord, setCurrentWord] = useState("protein")


const alphabet = "abcdefghijklmnopqrstuvwxyz"

const alphabetElements = alphabet.split("").map((alph) => {
    return <button key={alph} className="bg-orange-500 text-3xl w-10 h-10 
    rounded-lg hover:bg-orange-600 transition-colors border-white border-solid">{alph.toUpperCase()}</button>
})


const languageElements = languages.map((lang) => {
    return (
        <span 
            style={{backgroundColor: lang.backgroundColor, color: lang.color}} 
            key={lang.name}
            className="px-4 py-1 rounded-lg"
        >
            {lang.name}
        </span>
    )
})

const wordElements = currentWord.split("").map((letter, index) => {
    return(
        <span 
            className="bg-gray-500 w-10 h-10 flex items-center justify-center border-b-4 border-white" 
            key={index}
        >
            {letter.toUpperCase()}
        </span>
    )
})


    return (
        <main className="flex flex-col items-center text-center mt-10">
            <header className="max-w-md">
                <h1 className="text-white text-2xl font-bold">Fittnes: EndGame</h1>
                <p className="text-gray-500">Guess the word under 8 attempts to keep 
                    the fittnes stuff safe from cardio</p>
            </header>
            <section className="bg-green-500 w-full max-w-md text-white font-bold p-5 mt-4 rounded-xl">
                <h2>You Win!</h2>
                <p>Start a new game</p>
            </section>
            <section className="mt-10 flex flex-wrap justify-center gap-2 max-w-xl">
                {languageElements}
            </section>
            <section className="gap-2 text-white text-2xl flex mt-10">
                {wordElements}
            </section>
            <section className="gap-2 flex flex-wrap justify-center mt-10 max-w-lg">
                {alphabetElements}
            </section>
        </main>
    )
}