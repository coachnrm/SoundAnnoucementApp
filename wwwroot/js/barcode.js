window.generateBarcode = (elementId, value) => {
    JsBarcode(elementId, value, {
        format: "CODE128",
        displayValue: true
    });
};
