// Define the JavaScript function to print the receipt
window.printReceipt = function () {
    // Example logic: Printing the receipt
    const printContent = `
        <div style="font-family: monospace;">
            <h2>Receipt</h2>
            <p>Item 1: $10.00</p>
            <p>Item 2: $20.00</p>
            <p>Total: $30.00</p>
            <p>Thank you for your purchase!</p>
        </div>
    `;
    const newWindow = window.open('', '_blank');
        newWindow.document.write(printContent);
        newWindow.document.close();
        newWindow.print();
};