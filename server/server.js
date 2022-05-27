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

    if (!drawer) {
        drawer = socket.id;
        socket.emit("isDrawer", true);
    }
    socket.on("drawing", (data) => {
        socket.broadcast.emit("drawing", data);
    });

    socket.on("login", (data) => {
        console.log("login ON");
        const newUser = {};
        newUser.id = socket.id;
        newUser.username = data;
        users.push(newUser);
        console.log(users);
        socket.emit("users", users);
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
