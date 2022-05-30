import { useState, useEffect } from "react";
import { socket } from "./start";
import { useHistory } from "react-router-dom";

import Timer from "./startTimer";

export default function Room() {
    const history = useHistory();
    const [users, setUsers] = useState([]);
    const [showTimer, setShowTimer] = useState(false);

    useEffect(() => {
        // get all logged in users when you enter the room-page
        socket.emit("getLoggedInUsers");
        socket.on("responseLoggedUsers", (data) => {
            console.log(data);
            setUsers(data);
        });
        // listen to new users joining the room once you have joined already & if the users changed their ready property to true
        socket.on("users", (data) => {
            console.log("All users", users);
            console.log("users ON");
            console.log("data in users ON", data);
            setUsers([...users, ...data]);
        });
    }, []);

    function onClickReady() {
        // tell server that user has clicked the ready button, server side check which user it was and emit the updated array
        socket.emit("readyClicked");
        // when all users have their ready property set to true start the timer
        socket.on("startTimer", () => {
            setShowTimer(true);
        });
        // listen to when the timer is done and hide the timer again
        socket.on("timerIsDone", (route) => {
            console.log("Hello");
            setShowTimer(false);
            //history.pushState({}, null, "/play");
            history.push(route);
        });
    }

    return (
        <div className="div-room">
            <div className="countdown-room">
                {showTimer && <Timer seconds={3} route="/play" />}
            </div>

            <h1 className="headline-room">Users:</h1>
            <div className="users-room">
                {users &&
                    users.map((user) => {
                        return (
                            <p key={user.id}>
                                {user.username} is {user.ready || "not"} ready.
                            </p>
                        );
                    })}
            </div>
            <button onClick={onClickReady}>READY</button>
        </div>
    );
}
