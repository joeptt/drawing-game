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
            <div className="timer-points">
                <Timer seconds={10} route="/play" />
                <div className="bar-points">
                    <div className="in-points"></div>
                </div>
            </div>
            <div className="points-container">
                <h3>Leaderboard:</h3>
                {users &&
                    users.map((user) => {
                        return (
                            <div className="user-points" key={user.id}>
                                <p>
                                    {user.username.toUpperCase()}: {user.points}{" "}
                                    POINTS
                                </p>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
