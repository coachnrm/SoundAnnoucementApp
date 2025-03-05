window.preventDefault = function (event) {
    event = event || window.event; // Ensure event is defined
    if (event.preventDefault) {
        event.preventDefault();
    }
};


let canvas, ctx, drawingMode = "draw";
let isDrawing = false;
let typing = false;
let history = [];
let historyIndex = -1;

function initDrawingCanvas(canvasId) {
    canvas = document.getElementById(canvasId);
    ctx = canvas.getContext("2d");

    canvas.addEventListener("mousedown", startAction);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopAction);
    canvas.addEventListener("mouseout", stopAction);

    canvas.addEventListener("touchstart", startAction);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopAction);

    saveState(); // Save initial blank state
}

// ✅ Function to Load Image onto Canvas
function loadImageOnCanvas(canvasId, imageUrl) {
    let img = new Image();
    img.src = imageUrl;
    img.onload = function () {
        let canvas = document.getElementById(canvasId);
        let ctx = canvas.getContext("2d");

        let maxWidth = 800;  // Set fixed canvas width
        let maxHeight = 600; // Set fixed canvas height
        let scale = Math.min(maxWidth / img.width, maxHeight / img.height);

        let newWidth = img.width * scale;
        let newHeight = img.height * scale;

        // Resize canvas to maintain aspect ratio
        canvas.width = maxWidth;
        canvas.height = maxHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Center image in canvas
        let xOffset = (canvas.width - newWidth) / 2;
        let yOffset = (canvas.height - newHeight) / 2;
        
        ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);
        
        saveState();
    };
}

// ✅ Function to set the mode
function setCanvasMode(mode) {
    drawingMode = mode;
}

// ✅ Function to start drawing or typing
function startAction(event) {
    saveState(); // Save state before making changes

    let { x, y } = getCanvasCoordinates(event, canvas);

    if (drawingMode === "draw") {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else if (drawingMode === "type" && !typing) {
        typing = true;
        addTextPrompt(x, y);
    }
}

// ✅ Function to draw on the canvas
function draw(event) {
    if (!isDrawing || drawingMode !== "draw") return;
    let { x, y } = getCanvasCoordinates(event, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
}

// ✅ Function to stop drawing or typing
function stopAction() {
    if (drawingMode === "draw") {
        isDrawing = false;
        ctx.closePath();
    } else if (drawingMode === "type") {
        typing = false;
    }
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

// ✅ Function to save canvas state
function saveState() {
    historyIndex++;
    history.splice(historyIndex, history.length, canvas.toDataURL());
}


function initAudio(element, reference){
    element.addEventListener("ended", async e => {
        await reference.invokeMethodAsync("OnEnd");
    });
}

function playAudio(element) {
    stopAudio(element);
    element.play();
}

function stopAudio(element) {
    element.pause();
    element.currentTime = 0;
}