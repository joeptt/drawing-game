import Canvas from "./canvas";
import Login from "./login";
import Room from "./room";
import { useState } from "react";

//import { socket } from "./start";
import { BrowserRouter, Route } from "react-router-dom";

export default function App() {
    const [user, setUser] = useState();

    function getLoggedUser(data) {
        console.log(data);
    }

    return (
        <BrowserRouter>
            <Route exact path="/">
                <Login />
            </Route>
            <Route exact path="/room">
                <Room getLoggedUser={getLoggedUser} />
            </Route>
            <Route exact path="/play">
                <div className="wrapper">
                    <Canvas />
                </div>
            </Route>
        </BrowserRouter>
    );
}
