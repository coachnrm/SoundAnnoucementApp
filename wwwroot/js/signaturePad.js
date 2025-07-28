let canvas2;
let ctx2;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

export function initialize(element) {
    // Create canvas element
    canvas2 = document.createElement('canvas');
    canvas2.width = element.offsetWidth;
    canvas2.height = element.offsetHeight;
    canvas2.style.backgroundColor = 'white';
    element.appendChild(canvas2);
    
    ctx2 = canvas2.getContext('2d');
    // Set initial white background
    ctx2.fillStyle = 'white';
    ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
    ctx2.strokeStyle = 'black';
    ctx2.lineWidth = 2;
    ctx2.lineJoin = 'round';
    ctx2.lineCap = 'round';
    
    // Event listeners
    canvas2.addEventListener('mousedown', startDrawing);
    canvas2.addEventListener('mousemove', draw);
    canvas2.addEventListener('mouseup', stopDrawing);
    canvas2.addEventListener('mouseout', stopDrawing);
    
    // Touch support
    canvas2.addEventListener('touchstart', handleTouchStart);
    canvas2.addEventListener('touchmove', handleTouchMove);
    canvas2.addEventListener('touchend', stopDrawing);
}

// export function saveSignature() {
//     // Create a temporary canvas to ensure white background
//     const tempCanvas = document.createElement('canvas');
//     tempCanvas.width = canvas2.width;
//     tempCanvas.height = canvas2.height;
//     const tempCtx = tempCanvas.getContext('2d');
    
//     // Fill with white background first
//     tempCtx.fillStyle = 'white';
//     tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
//     // Draw the original canvas content
//     tempCtx.drawImage(canvas2, 0, 0);
//     return canvastoDataURL('image/png');
// }

export function saveSignature() {
    // Create a temporary canvas to ensure white background
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas2.width;
    tempCanvas.height = canvas2.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Fill with white background first
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Draw the original canvas content
    tempCtx.drawImage(canvas2, 0, 0);
    return tempCanvas.toDataURL('image/png');  // Fixed: Added the dot between tempCanvas and toDataURL
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
    tempCanvas.width = canvas2.width;
    tempCanvas.height = canvas2.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Fill with white background first
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Draw the original canvas content
    tempCtx.drawImage(canvas2, 0, 0);
    
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
    ctx2.fillStyle = 'white';
    ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
    ctx2.strokeStyle = 'black'; // Reset stroke style after clear
}


function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getPosition(e);
}

function draw(e) {
    if (!isDrawing) return;
    
    ctx2.beginPath();
    ctx2.moveTo(lastX, lastY);
    const [x, y] = getPosition(e);
    ctx2.lineTo(x, y);
    ctx2.stroke();
    
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
    canvas2.dispatchEvent(mouseEvent);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas2.dispatchEvent(mouseEvent);
}

function getPosition(e) {
    const rect = canvas2.getBoundingClientRect();
    return [
        e.clientX - rect.left,
        e.clientY - rect.top
    ];
}