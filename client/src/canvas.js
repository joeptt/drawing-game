import { useCallback, useEffect, useRef, useState } from "react";
import { socket } from "./start";

export default function Canvas() {
    const canvasRef = useRef(null);
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState(null);
    const [isDrawer, setIsDrawer] = useState(false);
    const [loggedUser, setLoggedUser] = useState();

    useEffect(() => {
        // get the loggedUser
        getLoggedInUser();
        socket.on("drawing", (data) =>
            drawLine(data.mousePosition, data.newMousePosition)
        );
        // send request to server to send back the randomly selected drawer
        socket.emit("setDrawer");
        // on answer to the "setDrawer"-emit I will set the drawer
        socket.on("isDrawer", (data) => {
            console.log("drawer data", data);
            setIsDrawer(data);
        });
    }, []);

    function getLoggedInUser() {
        // sends an emit to the server where I will compare the socket.id to all user.id's \
        // to find out which is the currently logged on user on this device
        socket.emit("getLoggedInUser");
        // once I get my logged in user back I store him as loggedUser
        socket.on("loggedInUser", (data) => {
            console.log(data);
            setLoggedUser(data);
        });
    }

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
                    drawLine(mousePosition, newMousePosition);
                    setMousePosition(newMousePosition);
                    socket.emit("drawing", { mousePosition, newMousePosition });
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
            x: x - canvas.offsetLeft,
            y: y - canvas.offsetTop,
        };
    };

    const drawLine = (originalMousePosition, newMousePosition) => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (context) {
            context.strokeStyle = "hotpink";
            context.lineJoin = "round";
            context.lineWidth = 10;

            context.beginPath();
            context.moveTo(originalMousePosition.x, originalMousePosition.y);
            context.lineTo(newMousePosition.x, newMousePosition.y);
            context.closePath();
            context.stroke();
        }
    };

    function RenderCanvas() {
        if (loggedUser) {
            if (loggedUser.id === isDrawer.id) {
                return (
                    <div>
                        <h1>isDrawer: {`${loggedUser.username}`}</h1>
                        <canvas
                            ref={canvasRef}
                            height={canvasHeightDrawer}
                            width={canvasWidth}
                            onMouseDown={startPaint}
                            onMouseMove={paint}
                            onMouseUp={exitPaint}
                            onMouseLeave={exitPaint}
                            onTouchStart={startPaint}
                            onTouchMove={paint}
                            onTouchEnd={exitPaint}
                        />
                    </div>
                );
            } else {
                return (
                    <div>
                        <canvas
                            className="guesser-canvas"
                            ref={canvasRef}
                            height={canvasHeightGuesser}
                            width={canvasWidth}
                        />
                    </div>
                );
            }
        } else {
            return <></>;
        }
    }

    const canvasWidth = window.innerWidth;

    const canvasHeightDrawer = window.innerHeight - 200;
    const canvasHeightGuesser = window.innerHeight / 2;

    return <RenderCanvas />;
}
