window.preventDefault = function (event) {
    event = event || window.event; // Ensure event is defined
    if (event.preventDefault) {
        event.preventDefault();
    }
};
