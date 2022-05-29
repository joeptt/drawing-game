import { useState, useEffect } from "react";
import { socket } from "./start";

export default function Timer() {
    const [timeLeft, setTimeLeft] = useState(3);
    useEffect(() => {
        startTimer(3);
    }, []);

    // timer function
    function startTimer(x) {
        let seconds = x;
        if (seconds <= 0) {
            // send the server a message when the timer is done so I can continue to the drawing page
            socket.emit("timerDone");
            return;
        }
        setTimeout(() => {
            seconds--;
            setTimeLeft(seconds);
            startTimer(seconds);
        }, 1000);
    }

    return (
        <div>
            <h1>{timeLeft}</h1>
        </div>
    );
}
