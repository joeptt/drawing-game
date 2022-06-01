import { useCallback, useEffect, useRef, useState } from "react";
import { socket } from "./start";
import { useHistory } from "react-router-dom";
import Timer from "./startTimer";
import Guessing from "./guessing";
import Colortools from "./colortools";

export default function Canvas({ color, onClickColor, pencilWidth, onSlide }) {
    const history = useHistory();
    const canvasRef = useRef(null);
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState(null);
    const [isDrawer, setIsDrawer] = useState(false);
    const [loggedUser, setLoggedUser] = useState();
    const [randomWord, setRandomWord] = useState("");
    const [wrongGuess, setWrongGuess] = useState("");

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    useEffect(() => {
        // get random word from server
        socket.emit("getRandomWord");
        socket.on("generateRandomWord", (data) => {
            console.log("randomWord", data);
            setRandomWord(data);
        });
        // sends an emit to the server where I will compare the socket.id to all user.id's \
        // to find out which is the currently logged on user on this device
        socket.emit("getLoggedInUser");
        // once I get my logged in user back I store him as loggedUser
        socket.on("loggedInUser", (data) => {
            setLoggedUser(data);
        });

        socket.on("drawing", (data) => {
            console.log(data.color);
            drawLine(
                data.mousePosition,
                data.newMousePosition,
                data.color,
                data.pencilWidth
            );
        });
        // send request to server to send back the randomly selected drawer
        socket.emit("setDrawer");
        // on answer to the "setDrawer"-emit I will set the drawer
        socket.on("isDrawer", (data) => {
            setIsDrawer(data);
        });
        // listen to the timer being done
        socket.on("timerIsDone", (route) => {
            history.push(route);
        });
        // listen for any wrong guesses
        socket.on("wrongGuess", (data) => {
            setWrongGuess(data);
            setTimeout(() => {
                setWrongGuess("");
            }, 1500);
        });

        // clean up
        return () => {
            socket.removeListener("timerIsDone");
            socket.removeListener("drawing");
            socket.removeListener("isDrawer");
            socket.removeListener("generateRandomWord");
            socket.removeListener("loggedInUser");
        };
    }, [canvasWidth, canvasHeight]);

    const startPaint = useCallback((event) => {
        const coordinates = getCoordinates(event);
        if (coordinates) {
            setMousePosition(coordinates);
            setIsPainting(true);
        }
    }, []);

    const paint = useCallback(
        (event) => {
            if (isPainting && isDrawer) {
                const newMousePosition = getCoordinates(event);
                if (mousePosition && newMousePosition) {
                    drawLine(
                        mousePosition,
                        newMousePosition,
                        color,
                        pencilWidth
                    );
                    setMousePosition(newMousePosition);
                    socket.emit("drawing", {
                        mousePosition,
                        newMousePosition,
                        color,
                        pencilWidth,
                    });
                }
            }
        },
        [isPainting, mousePosition]
    );

    const exitPaint = useCallback(() => {
        setIsPainting(false);
        setMousePosition(undefined);
    }, []);

    const getCoordinates = (event) => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const x = event.pageX || event.touches[0].clientX;
        const y = event.pageY || event.touches[0].clientY;
        return {
            x: x / canvasWidth,
            y: (y - canvas.offsetTop) / canvasHeight,
        };
    };

    const drawLine = (
        originalMousePosition,
        newMousePosition,
        color,
        pencilWidth
    ) => {
        if (!canvasRef.current) return;

        console.log("stroke", pencilWidth);

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (context) {
            context.strokeStyle = color;
            context.lineJoin = "round";
            context.lineWidth = pencilWidth;

            context.beginPath();
            context.moveTo(
                originalMousePosition.x * canvasWidth,
                originalMousePosition.y * canvasHeight
            );
            context.lineTo(
                newMousePosition.x * canvasWidth,
                newMousePosition.y * canvasHeight
            );
            context.closePath();
            context.stroke();
        }
    };

    if (!loggedUser) {
        return null;
    }

    if (loggedUser.id === isDrawer.id) {
        return (
            <div>
                <h3 className="drawing-word">Please draw: {randomWord}</h3>
                <div className="timer-canvas">
                    <Timer seconds={4000} route="/points" />
                </div>
                <canvas
                    ref={canvasRef}
                    height={canvasHeight}
                    width={canvasWidth}
                    onMouseDown={startPaint}
                    onMouseMove={paint}
                    onMouseUp={exitPaint}
                    onMouseLeave={exitPaint}
                    onTouchStart={startPaint}
                    onTouchMove={paint}
                    onTouchEnd={exitPaint}
                />
                <div className="tools-drawer">
                    <div className="bar-drawer">
                        <div className="in-drawer"></div>
                    </div>
                    <Colortools
                        onClickColor={onClickColor}
                        onSlide={onSlide}
                        pencilWidth={pencilWidth}
                    />
                </div>
            </div>
        );
    } else {
        return (
            <div className="guessers-canvas-div">
                <div className="bar-guesser">
                    <div className="in-guesser"></div>
                </div>
                <h1>Drawer: {isDrawer.username}</h1>

                <canvas
                    className="guesser-canvas"
                    ref={canvasRef}
                    height={canvasHeight}
                    width={canvasWidth}
                />

                <Guessing randomWord={randomWord} wrongGuess={wrongGuess} />
            </div>
        );
    }
}
