// Simple QR code generation using QRCode.js
window.generateQR = function(elementId, text) {
    var element = document.getElementById(elementId);
    element.innerHTML = ""; // Clear previous QR
    
    // Create new QRCode instance
    new QRCode(element, {
        text: text,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
};