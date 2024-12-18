// window.generatePdfWithFont = (title, content, personsJson) => {
//     const { jsPDF } = window.jspdf;
//     const doc = new jsPDF({
//         rientation: 'portrait',  // or 'landscape' if you want the paper to be in landscape mode
//         unit: 'mm',  // units are in millimeters
//         format: 'a4'  // [width, height] in mm
//     });

//     // Load the font file using AJAX (Fetch or XMLHttpRequest)
//     fetch('/fonts/NotoSans-Regular.ttf')
//         .then(response => response.arrayBuffer())
//         .then(fontData => {
//             // Convert the font data into base64 format
//             const base64Font = arrayBufferToBase64(fontData);

//             // Add the font to jsPDF's virtual file system
//             doc.addFileToVFS('NotoSans-Regular.ttf', base64Font);

//             // Register the font with jsPDF
//             doc.addFont('NotoSans-Regular.ttf', 'MyCustomFont', 'normal');

//             // Set the font for the document
//             doc.setFont('MyCustomFont');
//             doc.setFontSize(10);

//             // Add Title and Content to the PDF
//             doc.text(title, 5, 10);
//             doc.setFontSize(10);
//             doc.text(content, 5, 20);

//             // Parse the JSON string into an array of person objects
//             const persons = JSON.parse(personsJson);

//             // Loop through the persons and add them to the PDF
//             let yPosition = 30;  // Starting Y position for the persons list
//             persons.forEach(person => {
//                 const fullName = `${person.FirstName} ${person.LastName}`;
//                 doc.text(fullName, 5, yPosition);
//                 yPosition += 10;  // Move to the next line for the next person
//             });


//             // Trigger auto-print to open the print dialog automatically
//             doc.autoPrint();

//             // Open the PDF in a new tab and trigger the print dialog
//             //window.open(doc.output('bloburl'), '_blank');


//             // Save the generated PDF
//             doc.save("generated_with_custom_font.pdf");
            

//         })
//         .catch(error => console.error('Error loading font:', error));
// };

window.generatePdfWithFont = (title, content, personsJson) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait', // or 'landscape' if you want the paper to be in landscape mode
        unit: 'mm', // units are in millimeters
        format: 'a4' // A4 paper size
    });

    // Load the font file using AJAX (Fetch or XMLHttpRequest)
    fetch('/fonts/NotoSans-Regular.ttf')
        .then(response => response.arrayBuffer())
        .then(fontData => {
            // Convert the font data into base64 format
            const base64Font = arrayBufferToBase64(fontData);

            // Add the font to jsPDF's virtual file system
            doc.addFileToVFS('NotoSans-Regular.ttf', base64Font);

            // Register the font with jsPDF
            doc.addFont('NotoSans-Regular.ttf', 'MyCustomFont', 'normal');

            // Set the font for the document
            doc.setFont('MyCustomFont');
            doc.setFontSize(10);

            // Add Title and Content to the PDF
            doc.text(title, 10, 10);
            doc.text(content, 10, 20);

            // Parse the JSON string into an array of person objects
            const persons = JSON.parse(personsJson);

            // Add persons to the PDF
            let yPosition = 30; // Starting Y position for the persons list
            persons.forEach(person => {
                const fullName = `${person.FirstName} ${person.LastName}`;
                doc.text(fullName, 10, yPosition);
                yPosition += 10; // Move to the next line for the next person
            });

            // Render the graph on a hidden canvas
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 200;
            document.body.appendChild(canvas); // Append to DOM to render the chart

            const ctx = canvas.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                    datasets: [{
                        label: 'Dataset 1',
                        data: [65, 59, 80, 81, 56, 55],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    }]
                },
                options: {
                    responsive: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Sample Line Chart'
                        }
                    }
                }
            });

            // Wait for the chart to render and then add it to the PDF
            setTimeout(() => {
                const chartImage = canvas.toDataURL('image/png'); // Convert canvas to image
                doc.addImage(chartImage, 'PNG', 10, yPosition + 10, 180, 90); // Add image to PDF
                document.body.removeChild(canvas); // Clean up the canvas from DOM

                // Save the generated PDF
                doc.save('generated_with_chart.pdf');
            }, 1000); // Allow chart to render (adjust if needed)
        })
        .catch(error => console.error('Error loading font:', error));
};


// Helper function to convert array buffer to base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

