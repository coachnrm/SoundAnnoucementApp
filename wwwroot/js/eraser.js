let canvas, ctx, drawingMode = "draw";
let isDrawing = false;
let isErasing = false;
let typing = false;
let history = [];
let historyIndex = -1;
let eraserSize = { width: 30, height: 30 };

function initDrawingCanvas(canvasId) {
    canvas = document.getElementById(canvasId);
    ctx = canvas.getContext("2d");

    // Set canvas background to white
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 3; // Default drawing line width
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "black"; // Default color

    canvas.addEventListener("mousedown", startAction);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopAction);
    canvas.addEventListener("mouseout", stopAction);

    canvas.addEventListener("mousemove", showEraserCursor);
    
    saveState(); // Save initial blank state
}

// ✅ Function to set the mode (draw, erase, type)
function setCanvasMode(mode) {
    drawingMode = mode;
    if (mode === "erase") {
        canvas.style.cursor = "none"; // Hide default cursor when erasing
    } else {
        canvas.style.cursor = "default"; // Reset cursor for other modes
    }
}

// ✅ Function to start drawing, erasing, or typing
function startAction(event) {
    saveState(); // Save current state before modifying canvas

    let { x, y } = getCanvasCoordinates(event, canvas);

    if (drawingMode === "draw") {
        isDrawing = true;
        ctx.globalCompositeOperation = "source-over"; // Normal drawing mode
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else if (drawingMode === "erase") {
        isErasing = true;
        ctx.globalCompositeOperation = "destination-out"; // Erase mode
        ctx.beginPath();
        ctx.fillRect(x - eraserSize.width / 2, y - eraserSize.height / 2, eraserSize.width, eraserSize.height);
    } else if (drawingMode === "type" && !typing) {
        typing = true;
        addTextPrompt(x, y);
    }
}

// ✅ Function to draw or erase
function draw(event) {
    if (!isDrawing && !isErasing) return;
    let { x, y } = getCanvasCoordinates(event, canvas);

    if (drawingMode === "draw") {
        ctx.lineTo(x, y);
        ctx.stroke();
    } else if (drawingMode === "erase") {
        ctx.fillRect(x - eraserSize.width / 2, y - eraserSize.height / 2, eraserSize.width, eraserSize.height);
    }
}

// ✅ Function to stop drawing or erasing
function stopAction() {
    if (isDrawing) {
        isDrawing = false;
        ctx.closePath();
    }
    if (isErasing) {
        isErasing = false;
        ctx.globalCompositeOperation = "source-over"; // Reset to normal mode
    }
}

// ✅ Function to show the eraser cursor as a rectangle
function showEraserCursor(event) {
    if (drawingMode !== "erase") return;

    let { x, y } = getCanvasCoordinates(event, canvas);

    let tempImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(tempImage, 0, 0);

    ctx.strokeStyle = "red"; // Eraser cursor color
    ctx.lineWidth = 1;
    ctx.strokeRect(x - eraserSize.width / 2, y - eraserSize.height / 2, eraserSize.width, eraserSize.height);
}

// ✅ Function to prompt for text input
function addTextPrompt(x, y) {
    let text = prompt("Enter text:");
    if (text) {
        ctx.font = "20px Arial";
        ctx.fillStyle = "black"; // Text color
        ctx.fillText(text, x, y);
    }
    typing = false;
}

// ✅ Function to get accurate canvas coordinates
function getCanvasCoordinates(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX || event.touches?.[0]?.clientX) - rect.left;
    const y = (event.clientY || event.touches?.[0]?.clientY) - rect.top;
    return { x, y };
}

// ✅ Function to clear the canvas
function clearCanvas(canvasId) {
    let canvas = document.getElementById(canvasId);
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
}

// ✅ Function to undo last action
function undoCanvasAction(canvasId) {
    if (historyIndex > 0) {
        historyIndex--;
        let img = new Image();
        img.src = history[historyIndex];
        img.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    }
}

// ✅ Function to save canvas as file
function saveCanvasAsFile(canvasId, filename) {
    let canvas = document.getElementById(canvasId);
    let link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = filename;
    link.click();
}


// ✅ Function to save canvas state for undo
function saveState() {
    historyIndex++;
    history.splice(historyIndex, history.length, canvas.toDataURL());
}



