const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(
            null,
            req.headers.referer.startsWith("http://localhost:3000") ||
                req.headers.referer.startsWith(
                    "https://react-sockets-draw.herokuapp.com/"
                )
        ),
});

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

let drawer = null;
let users = [];

io.on("connection", (socket) => {
    console.log("connect: ", socket.id);

    socket.on("setDrawer", () => {
        drawer = users[Math.floor(Math.random() * users.length)];
        console.log("isDrawer", drawer);
        io.emit("isDrawer", drawer);
    });

    socket.on("drawing", (data) => {
        socket.broadcast.emit("drawing", data);
    });

    socket.on("login", (data) => {
        console.log("login ON");
        const newUser = {
            ready: false,
        };
        newUser.id = socket.id;
        newUser.username = data;
        users.push(newUser);
        console.log(users);
        io.emit("users", users);
    });

    socket.on("getLoggedInUsers", () => {
        console.log("users", users);
        socket.emit("responseLoggedUsers", users);
    });

    socket.on("readyClicked", () => {
        // Set users ready property to true
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === socket.id) {
                users[i].ready = true;
            }
        }
        io.emit("users", users);
        // Check if all users have clicked ready, if so start the timer
        if (
            users.map((user) => user.ready).filter(Boolean).length ===
            users.length
        ) {
            io.emit("startTimer");
        }
    });

    socket.on("getLoggedInUser", () => {
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === socket.id) {
                socket.emit("loggedInUser", {
                    ...users[i],
                });
            }
        }
    });

    socket.on("timerDone", () => {
        io.emit("timerIsDone");
    });

    socket.on("disconnect", async () => {
        console.log("disconnect", socket.id);
        // delete user from users arr if the disconnect
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === socket.id) {
                users.splice(i, 1);
                console.log(users);
            }
        }
        const ids = await io.allSockets();
        drawer = [...ids][0];
        io.to(drawer).emit("isDrawer", true);
    });
});
