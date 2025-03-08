window.canvasHelper = {
    getCanvasImage: function (canvasId) {
        let canvas = document.getElementById(canvasId);
        return canvas.toDataURL("image/png"); // Returns Base64 image string
    }
};
