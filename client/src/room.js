import { useState, useEffect } from "react";
import { socket } from "./start";

export default function Room() {
    //const [users, setUsers] = useState;

    useEffect(() => {
        console.log("mounted");
    }, []);

    return (
        <div>
            <p>Users:</p>
        </div>
    );
}
