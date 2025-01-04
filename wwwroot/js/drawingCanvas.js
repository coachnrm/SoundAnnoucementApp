// window.initDrawingCanvas = (canvasId) => {
//     const canvas = document.getElementById(canvasId);
//     const context = canvas.getContext("2d");

//     let isDrawing = false;

//     const startDrawing = (event) => {
//         isDrawing = true;
//         const { x, y } = getCanvasCoordinates(event, canvas);
//         context.beginPath();
//         context.moveTo(x, y);
//     };

//     const draw = (event) => {
//         if (!isDrawing) return;
//         const { x, y } = getCanvasCoordinates(event, canvas);
//         context.lineTo(x, y);
//         context.stroke();
//     };

//     const stopDrawing = () => {
//         isDrawing = false;
//         context.closePath();
//     };

//     const getCanvasCoordinates = (event, canvas) => {
//         const rect = canvas.getBoundingClientRect();
//         const x = (event.clientX || event.touches[0].clientX) - rect.left;
//         const y = (event.clientY || event.touches[0].clientY) - rect.top;
//         return { x, y };
//     };

//     // Mouse events
//     canvas.addEventListener("mousedown", startDrawing);
//     canvas.addEventListener("mousemove", draw);
//     canvas.addEventListener("mouseup", stopDrawing);

//     // Touch events for iPad
//     canvas.addEventListener("touchstart", startDrawing);
//     canvas.addEventListener("touchmove", draw);
//     canvas.addEventListener("touchend", stopDrawing);
// };

// window.clearCanvas = (canvasId) => {
//     const canvas = document.getElementById(canvasId);
//     const context = canvas.getContext("2d");
//     context.clearRect(0, 0, canvas.width, canvas.height);
// };

// window.initDrawingCanvas = (canvasId) => {
//     const canvas = document.getElementById(canvasId);
//     const context = canvas.getContext("2d");

//     let isDrawing = false;
//     let mode = "draw"; // Modes: 'draw', 'type'
//     let typing = false;

//     // Set mode
//     window.setCanvasMode = (newMode) => {
//         mode = newMode;
//     };

//     // Start drawing or typing
//     const startAction = (event) => {
//         if (mode === "draw") {
//             isDrawing = true;
//             const { x, y } = getCanvasCoordinates(event, canvas);
//             context.beginPath();
//             context.moveTo(x, y);
//         } else if (mode === "type" && !typing) {
//             typing = true;
//             const { x, y } = getCanvasCoordinates(event, canvas);
//             addTextPrompt(x, y);
//         }
//     };

//     // Draw line
//     const draw = (event) => {
//         if (!isDrawing || mode !== "draw") return;
//         const { x, y } = getCanvasCoordinates(event, canvas);
//         context.lineTo(x, y);
//         context.stroke();
//     };

//     const stopAction = () => {
//         if (mode === "draw") {
//             isDrawing = false;
//             context.closePath();
//         } else if (mode === "type") {
//             typing = false;
//         }
//     };

//     const addTextPrompt = (x, y) => {
//         const text = prompt("Enter text:");
//         if (text) {
//             context.font = "16px Arial";
//             context.fillText(text, x, y);
//         }
//         typing = false;
//     };

//     const getCanvasCoordinates = (event, canvas) => {
//         const rect = canvas.getBoundingClientRect();
//         const x = (event.clientX || event.touches?.[0]?.clientX) - rect.left;
//         const y = (event.clientY || event.touches?.[0]?.clientY) - rect.top;
//         return { x, y };
//     };

//     // Mouse events
//     canvas.addEventListener("mousedown", startAction);
//     canvas.addEventListener("mousemove", draw);
//     canvas.addEventListener("mouseup", stopAction);

//     // Touch events for iPad
//     canvas.addEventListener("touchstart", startAction);
//     canvas.addEventListener("touchmove", draw);
//     canvas.addEventListener("touchend", stopAction);
// };

// window.clearCanvas = (canvasId) => {
//     const canvas = document.getElementById(canvasId);
//     const context = canvas.getContext("2d");
//     context.clearRect(0, 0, canvas.width, canvas.height);
// };

window.initDrawingCanvas = (canvasId) => {
    const canvas = document.getElementById(canvasId);
    const context = canvas.getContext("2d");

    let isDrawing = false;
    let mode = "draw"; // Modes: 'draw', 'type'
    let typing = false;
    const undoStack = []; // Stack to store canvas states

    // Save the current state of the canvas to the undo stack
    const saveState = () => {
        undoStack.push(canvas.toDataURL());
    };

    // Restore the last saved state
    window.undoCanvasAction = (canvasId) => {
        if (undoStack.length > 0) {
            const lastState = undoStack.pop();
            const img = new Image();
            img.src = lastState;
            img.onload = () => {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0);
            };
        }
    };

    // Set mode
    window.setCanvasMode = (newMode) => {
        mode = newMode;
    };

    // Start drawing or typing
    const startAction = (event) => {
        saveState(); // Save the state before starting a new action

        if (mode === "draw") {
            isDrawing = true;
            const { x, y } = getCanvasCoordinates(event, canvas);
            context.beginPath();
            context.moveTo(x, y);
        } else if (mode === "type" && !typing) {
            typing = true;
            const { x, y } = getCanvasCoordinates(event, canvas);
            addTextPrompt(x, y);
        }
    };

    // Draw line
    const draw = (event) => {
        if (!isDrawing || mode !== "draw") return;
        const { x, y } = getCanvasCoordinates(event, canvas);
        context.lineTo(x, y);
        context.stroke();
    };

    const stopAction = () => {
        if (mode === "draw") {
            isDrawing = false;
            context.closePath();
        } else if (mode === "type") {
            typing = false;
        }
    };

    const addTextPrompt = (x, y) => {
        const text = prompt("Enter text:");
        if (text) {
            context.font = "16px Arial";
            context.fillText(text, x, y);
        }
        typing = false;
    };

    const getCanvasCoordinates = (event, canvas) => {
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX || event.touches?.[0]?.clientX) - rect.left;
        const y = (event.clientY || event.touches?.[0]?.clientY) - rect.top;
        return { x, y };
    };

    // Mouse events
    canvas.addEventListener("mousedown", startAction);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopAction);

    // Touch events for iPad
    canvas.addEventListener("touchstart", startAction);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopAction);
};

window.clearCanvas = (canvasId) => {
    const canvas = document.getElementById(canvasId);
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
};


