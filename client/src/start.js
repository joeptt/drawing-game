import ReactDOM from "react-dom";
import App from "./app.js";
import io from "socket.io-client";

export const socket = io.connect();

socket.on("users", (data) => {
    console.log("users ON");
    console.log(data);
});

ReactDOM.render(<App />, document.querySelector("main"));
