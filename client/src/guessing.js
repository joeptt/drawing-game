import { useEffect, useState } from "react";
import { socket } from "./start";
import BackSpaceIcon from "./icons/backspace";

const keyboardRows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"],
];

export default function Guessing({ randomWord }) {
    const [currentMs, setCurrentMs] = useState();
    const [guessed, setGuessed] = useState(false);
    const [userInput, setUserInput] = useState("");

    useEffect(() => {
        let id = startTimer(0);
        return () => clearTimeout(id);
    }, []);

    function checkCorrectness() {
        if (userInput === randomWord) {
            console.log("guessed correctly");
            setGuessed(true);
            const difference = 30 - currentMs / 100;
            const points = Math.round(difference * 17);
            console.log("Points:", points);
            socket.emit("storePoints", points);
        } else {
            event.target.guess.value = "";
        }
    }

    function handleKeyPress(key) {
        console.log("clicked: ", key);
        if (key === "backspace") {
            return setUserInput((old) => old.slice(0, -1));
        }
        if (key === "enter") {
            return checkCorrectness();
        }
        setUserInput((old) => old + key);
    }

    function startTimer(x) {
        let ms = x;
        let id = setTimeout(() => {
            ms++;
            setCurrentMs(ms);
            startTimer(ms);
        }, 100);
        return id;
    }

    return (
        <>
            <div className="keyboard">
                {keyboardRows.map((row, i) => (
                    <div
                        key={i}
                        className={`keyboard-row ${
                            i === 1 ? "keyboard-row-2" : ""
                        }`}
                    >
                        {row.map((key, i) => (
                            <div
                                className={`keyboard-key ${
                                    key === "enter" ? "enter-key" : ""
                                }`}
                                key={i}
                                onClick={() => handleKeyPress(key)}
                            >
                                {key === "backspace" ? <BackSpaceIcon /> : key}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}
