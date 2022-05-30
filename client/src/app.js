import Canvas from "./canvas";
import Login from "./login";
import Room from "./room";
import Points from "./points";
import { socket } from "./start";
import { useEffect, useState } from "react";
//import { socket } from "./start";
import { BrowserRouter, Route } from "react-router-dom";

export default function App() {
    const [users, setUsers] = useState();

    useEffect(() => {
        socket.on("usersWithPoints", (data) => {
            console.log("usersWithPoints", data);
            setUsers(data);
        });
    }, []);

    return (
        <BrowserRouter>
            <Route exact path="/">
                <Login />
            </Route>
            <Route exact path="/room">
                <Room />
            </Route>
            <Route exact path="/play">
                <div className="wrapper">
                    <Canvas />
                </div>
            </Route>
            <Route exact path="/points">
                <Points userProp={users} />
            </Route>
        </BrowserRouter>
    );
}
