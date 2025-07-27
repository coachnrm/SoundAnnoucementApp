let canvas;
let ctx;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

export function initialize(element) {
    // Create canvas element
    canvas = document.createElement('canvas');
    canvas.width = element.offsetWidth;
    canvas.height = element.offsetHeight;
    canvas.style.backgroundColor = 'white';
    element.appendChild(canvas);
    
    ctx = canvas.getContext('2d');
    // Set initial white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    // Event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch support
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
}

export function saveSignature() {
    // Create a temporary canvas to ensure white background
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Fill with white background first
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Draw the original canvas content
    tempCtx.drawImage(canvas, 0, 0);
    return canvas.toDataURL('image/png');
}

// export function downloadSignature() {
//     // Create a temporary link element
//     const link = document.createElement('a');
//     link.download = 'signature.png';
//     link.href = canvas.toDataURL('image/png');
    
//     // Trigger the download
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// }
export function downloadSignature() {
    // Create a temporary canvas to ensure white background
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Fill with white background first
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Draw the original canvas content
    tempCtx.drawImage(canvas, 0, 0);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.download = 'signature.png';
    link.href = tempCanvas.toDataURL('image/png');
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// export function clearSignature() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
// }
export function clearSignature() {
    // Clear and set white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black'; // Reset stroke style after clear
}

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getPosition(e);
}

function draw(e) {
    if (!isDrawing) return;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    const [x, y] = getPosition(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    lastX = x;
    lastY = y;
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    return [
        e.clientX - rect.left,
        e.clientY - rect.top
    ];
}