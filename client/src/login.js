import { useState } from "react";
import { socket } from "./start";
import { Link } from "react-router-dom";

export default function Login() {
    //const [error, setError] = useState("");

    function onSubmit(event) {
        console.log("onSubmit");
        event.preventDefault();
        const username = event.target.username.value;
        socket.emit("login", username);
    }

    return (
        <div>
            <h1>Drawing Game!!!</h1>
            <form onSubmit={onSubmit}>
                <input name="username" placeholder="Enter Name..."></input>
                <button>Confirm</button>
            </form>
            <Link to="/room">
                <button>PLAY</button>
            </Link>
        </div>
    );
}
