//import { useState } from "react";
import { socket } from "./start";

import { useHistory } from "react-router-dom";

export default function Login() {
    //const [error, setError] = useState("");
    const history = useHistory();

    function onSubmit(event) {
        event.preventDefault();
        const username = event.target.username.value;
        socket.emit("login", username);
        nextPage();
    }

    function nextPage() {
        history.push("/room");
    }

    return (
        <div className="login-div">
            <form className="login-form" onSubmit={onSubmit}>
                <input name="username" placeholder="Enter Name..."></input>
                <button>Play</button>
            </form>
        </div>
    );
}
