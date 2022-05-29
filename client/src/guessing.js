import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { socket } from "./start";

export default function Guessing({ randomWord }) {
    const history = useHistory();
    const [currentMs, setCurrentMs] = useState();

    useEffect(() => {
        startTimer(0);
    }, []);

    function checkCorrectness(event) {
        event.preventDefault();
        const guess = event.target.guess.value;
        console.log("GUESS AND ANSWER", randomWord, guess);
        if (guess === randomWord) {
            console.log("guessed correctly");
            const points = currentMs * 11;
            console.log("Points:", points);
            socket.emit("storePoints", points);
            history.push("/points");
        } else {
            event.target.guess.value = "";
        }
    }

    function startTimer(x) {
        let ms = x;
        setTimeout(() => {
            ms++;
            setCurrentMs(ms);
            startTimer(ms);
        }, 100);
    }

    return (
        <div>
            <form onSubmit={checkCorrectness}>
                <input name="guess"></input>
                <h1>{currentMs}</h1>
                <button>GUESS!</button>
            </form>
        </div>
    );
}
