import Canvas from "./canvas";
import Login from "./login";
import Room from "./room";
import { BrowserRouter, Route } from "react-router-dom";

export default function App() {
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
        </BrowserRouter>
    );
}
