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
    const [color, setColor] = useState("black");
    const [pencilWidth, setPencilWidth] = useState(10);

    useEffect(() => {
        socket.on("usersWithPoints", (data) => {
            console.log("usersWithPoints", data);
            setUsers(data);
        });
    }, []);

    function onSlide(event) {
        const width = event.target.value;
        setPencilWidth(width);
    }

    function onClickColor(event) {
        const newColor = event.target.id;
        console.log("color:", newColor);
        setColor(newColor);
    }

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
                    <Canvas
                        onClickColor={onClickColor}
                        color={color}
                        onSlide={onSlide}
                        pencilWidth={pencilWidth}
                    />
                </div>
            </Route>
            <Route exact path="/points">
                <Points userProp={users} />
            </Route>
        </BrowserRouter>
    );
}
