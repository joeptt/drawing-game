import { useState, useEffect } from "react";
import { socket } from "./start";
import { Link } from "react-router-dom";

import Timer from "./startTimer";

export default function Room({ getLoggedUser }) {
    const [users, setUsers] = useState([]);
    const [showTimer, setShowTimer] = useState(false);

    useEffect(() => {
        getLoggedInUser();
        socket.emit("getLoggedInUsers");
        socket.on("responseLoggedUsers", (data) => {
            console.log(data);
            setUsers(data);
        });

        socket.on("users", (data) => {
            console.log("All users", users);
            console.log("users ON");
            console.log("data in users ON", data);
            setUsers([...users, ...data]);
        });
    }, []);

    function getLoggedInUser() {
        socket.emit("getLoggedInUser");
        socket.on("loggedInUser", (data) => {
            console.log("logged in user", data);
        });
    }

    function onClickReady() {
        socket.emit("readyClicked");
        socket.on("startTimer", () => {
            setShowTimer(true);
        });
        socket.on("timerIsDone", () => {
            console.log("Hello");
            setShowTimer(false);
            history.pushState({}, null, "/play");
        });
    }

    return (
        <div>
            {showTimer && <Timer />}

            <button onClick={onClickReady}>READY</button>
            <Link to="/play">
                <button>Start</button>
            </Link>
            <p>Users:</p>
            {users &&
                users.map((user) => {
                    return (
                        <p key={user.id}>
                            {user.username} is {user.ready || "not"} ready.
                        </p>
                    );
                })}
        </div>
    );
}
