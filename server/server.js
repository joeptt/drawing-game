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
                    "https://drawing-joe.herokuapp.com"
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
let roundsPlayed = 0;
const word = ["cat", "tree", "banana", "baby", "eye", "king"];

io.on("connection", (socket) => {
    console.log("connect: ", socket.id);
    // emit random word to all players
    socket.on("getRandomWord", () => {
        io.emit(
            "generateRandomWord",
            word[Math.floor(Math.random() * word.length)]
        );
    });

    socket.on("setDrawer", () => {
        // get all the users that have not drawn
        let notDrawnUsers = users.filter((user) => {
            if (!user.hasDrawn) {
                return user;
            }
        });

        // set drawers "hasDrawn" property to true
        if (notDrawnUsers.length === 0) {
            for (let i = 0; i < users.length; i++) {
                users[i].hasDrawn = false;
            }
            notDrawnUsers = users.filter((user) => {
                if (!user.hasDrawn) {
                    return user;
                }
            });
        }
        // randomly select one of the users
        drawer =
            notDrawnUsers[Math.floor(Math.random() * notDrawnUsers.length)];

        for (let i = 0; i < users.length; i++) {
            if (drawer.id === users[i].id) {
                users[i].hasDrawn = true;
            }
        }

        //drawer = users[Math.floor(Math.random() * users.length)];

        // let everyone know who the drawer is
        io.emit("isDrawer", drawer);
    });

    socket.on("drawing", (data) => {
        socket.broadcast.emit("drawing", data);
    });

    socket.on("login", (data) => {
        // create a new user
        const newUser = {
            hasDrawn: false,
            ready: false,
            id: socket.id,
            username: data,
            points: 0,
            correctGuess: false,
        };
        // add that user to the users array
        users.push(newUser);

        // send the currently logged in users to the clients
        io.emit("users", users);
    });

    socket.on("getLoggedInUsers", () => {
        // send the current users array to client to display once they enter the "room-page"
        socket.emit("responseLoggedUsers", users);
    });

    socket.on("readyClicked", () => {
        roundsPlayed = 0;
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
        // get the user logged in on device
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === socket.id) {
                socket.emit("loggedInUser", {
                    ...users[i],
                });
            }
        }
    });

    socket.on("timerDone", (route) => {
        // check route to see if you are at "/play"
        if (route === "/play") {
            roundsPlayed++;
            console.log("Rounds: ", roundsPlayed);
        }

        for (let i = 0; i < users.length; i++) {
            users[i].correctGuess = false;
        }
        io.emit("timerIsDone", route);
    });

    socket.on("wrongWord", (data) => {
        io.emit("wrongGuess", data);
    });

    socket.on("storePoints", (data) => {
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === socket.id) {
                users[i].points = users[i].points + data;
                users[i].correctGuess = true;
            }
        }
        // Check if all users have guessed correctly, if so end the timer
        if (
            users.map((user) => user.correctGuess).filter(Boolean).length ===
            users.length - 1
        ) {
            for (let i = 0; i < users.length; i++) {
                users[i].correctGuess = false;
            }
            console.log("everyone emiting timer is done");
            //io.emit("timerIsDone", "/points");
        }

        io.emit("usersWithPoints", users);
    });

    socket.on("disconnect", async () => {
        console.log("disconnect", socket.id);
        // delete user from users array on disconnect
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
