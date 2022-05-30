import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { socket } from "./start";
import Timer from "./startTimer";

export default function Points({ userProp }) {
    const [users, setUsers] = useState();
    const history = useHistory();

    useEffect(() => {
        console.log("points mounted", userProp);
        setUsers(userProp);

        socket.on("timerIsDone", (route) => {
            history.push(route);
        });
    }, []);

    return (
        <div>
            <Timer seconds={10} route="/play" />
            <h1>Points:</h1>
            {users &&
                users.map((user) => {
                    return (
                        <p key={user.id}>
                            {user.username} has {user.points} points!
                        </p>
                    );
                })}
        </div>
    );
}
