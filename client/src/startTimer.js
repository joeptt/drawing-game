import { useState, useEffect } from "react";
import { socket } from "./start";

export default function Timer({ seconds, route }) {
    const [timeLeft, setTimeLeft] = useState(seconds);
    useEffect(() => {
        // to prevent memory spilling I have to clear the timeout
        let id = startTimer(seconds);
        return () => clearTimeout(id);
    }, []);

    // timer function
    function startTimer(x) {
        let seconds = x;
        if (seconds <= 0) {
            // send the server a message when the timer is done so I can continue to the drawing page
            socket.emit("timerDone", route);
            return;
        }
        let id = setTimeout(() => {
            seconds--;
            setTimeLeft(seconds);
            startTimer(seconds);
        }, 1000);
        return id;
    }

    return (
        <div>
            <h1>{timeLeft}</h1>
        </div>
    );
}
