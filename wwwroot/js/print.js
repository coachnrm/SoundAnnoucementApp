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
                //doc.save('generated_with_chart.pdf');
                // Preview the PDF instead of saving it
                previewPdf(doc);
            }, 1000); // Allow chart to render (adjust if needed)
        })
        .catch(error => console.error('Error loading font:', error));
};

// Function to preview PDF
function previewPdf(doc) {
    // Get the PDF as a Blob
    const pdfBlob = doc.output('blob');

    // Create a Blob URL for the PDF
    const blobUrl = URL.createObjectURL(pdfBlob);
    // Open the Blob URL in a new tab for preview
    const newWindow = window.open(blobUrl, '_blank');
}



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

window.renderChart = () => {
    const ctx = document.getElementById('myChart').getContext('2d');
    const config = {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
                {
                    label: 'Dataset 1',
                    data: [65, 59, 80, 81, 56, 55],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart.js Line Chart',
                },
            },
        },
    };
    new Chart(ctx, config);
};

// window.generateXRayRequestPDF = function (patientData) {
//     return new Promise((resolve, reject) => {
//         if (!window.jspdf) {
//             reject("jsPDF is not loaded!");
//             return;
//         }

//         const { jsPDF } = window.jspdf;
//         const doc = new jsPDF();

//         // Load both Regular and Bold Thai fonts
//         Promise.all([
//             fetch('/fonts/THSarabunNew.ttf').then(response => response.arrayBuffer()),
//             fetch('/fonts/THSarabunNew-Bold.ttf').then(response => response.arrayBuffer())
//         ]).then(([regularFont, boldFont]) => {
//             // Convert fonts to Base64
//             const base64Regular = arrayBufferToBase64(regularFont);
//             const base64Bold = arrayBufferToBase64(boldFont);

//             // Add fonts to jsPDF virtual file system
//             doc.addFileToVFS('THSarabunNew.ttf', base64Regular);
//             doc.addFont('THSarabunNew.ttf', 'THSarabunNew', 'normal');

//             doc.addFileToVFS('THSarabunNew-Bold.ttf', base64Bold);
//             doc.addFont('THSarabunNew-Bold.ttf', 'THSarabunNew', 'bold');

//             // Set Font to Bold for Title
//             doc.setFont('THSarabunNew', 'bold');
//             doc.setFontSize(14);
//             doc.text("ศูนย์รังสีวินิจฉัย โรงพยาบาลสมุทรสาคร", 105, 15, { align: 'center' });
//             doc.text("(DIAGNOSIS CENTER SAMUTSAKHON HOSPITAL)", 105, 20, { align: 'center' });
            
//             doc.setFontSize(16);
//             doc.text("X - RAY REQUEST", 105, 30, { align: 'center' });
//             doc.text("CLINICAL INFORMATION & DIAGNOSIS", 105, 35, { align: 'center' });

//             // Add patient data
//             doc.setFont('THSarabunNew', 'normal');
//             doc.setFontSize(12);
//             doc.text(`วันที่: ${patientData.date || ''}`, 20, 45);
//             doc.text(`ชื่อ: ${patientData.name || ''}`, 20, 50);
//             doc.text("______________________________", 25, 50.3);
//             doc.text(`อายุ: ${patientData.age || ''}    HN: ${patientData.hn || ''}`, 20, 55);
//             doc.text(`OPD: ${patientData.opd || ''}    WARD: ${patientData.ward || ''}`, 20, 60);

//             // Add checkboxes and other elements
//             doc.setFont('THSarabunNew', 'bold');
//             doc.text("TYPE OF CASE:", 20, 70);
//             doc.setFont('THSarabunNew', 'normal');
//             doc.rect(20, 75, 5, 5); // Emergency checkbox
//             doc.text("EMERGENCY ☑", 27, 78);
//             doc.rect(60, 75, 5, 5); // Urgent checkbox
//             doc.text("URGENT □", 67, 78);
//             doc.rect(100, 75, 5, 5); // Elective checkbox
//             doc.text("ELECTIVE □", 107, 78);

//             doc.setFont('THSarabunNew', 'bold');
//             doc.text("TYPE OF EXAMINATION:", 20, 90);
//             doc.setFont('THSarabunNew', 'normal');
//             doc.text("X - RAY ______", 20, 95);

//             // Add other sections
//             doc.setFont('THSarabunNew', 'bold');
//             doc.text("ULTRASOUND ______", 20, 105);
//             doc.text("CT ______", 20, 115);
//             doc.text("SPECIAL □ IVP:", 20, 125);
//             doc.text("OTHERS ......", 20, 135);

//             // Add request by and allergy information
//             doc.text("REQUEST BY", 20, 145);
//             doc.setFont('THSarabunNew', 'normal');
//             doc.text("1uw.nlgwsrf ร่วมใน นักพบบพทย์ครั้งต่อไป ......", 20, 150);

//             doc.setFont('THSarabunNew', 'bold');
//             doc.text("HISTORY OF ALLERGY", 20, 160);
//             doc.setFont('THSarabunNew', 'normal');
//             doc.text("NO", 20, 165);
//             doc.text("YES (ระบุ) ......", 60, 165);

//             // Add underlying diseases
//             doc.setFont('THSarabunNew', 'bold');
//             doc.text("โรคประจ าตัว (ระบุ):", 20, 175);
//             doc.setFont('THSarabunNew', 'normal');
//             doc.text(patientData.underlyingDiseases || "DM.HT_DLP", 60, 175);

//             // Add footer
//             doc.setFont('THSarabunNew', 'normal');
//             doc.setFontSize(10);
//             doc.text("ศูนย์รังสิริปัจจัย วท.สมุทรสาคร (034) 427099 – 105 ต่อ 6119 หรือ 6120 (รายงานผลอยู่ด้านหลัง)", 
//                     105, 285, { align: 'center' });

//             // Generate the PDF as Blob
//             const pdfBlob = doc.output('blob');
//             resolve(URL.createObjectURL(pdfBlob));
//         }).catch(error => {
//             console.error("Error loading fonts:", error);
//             reject(error);
//         });
//     });
// };

window.generateXRayRequestPDF = function (patientData) {
    return new Promise((resolve, reject) => {
        if (!window.jspdf) {
            reject("jsPDF is not loaded!");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Load both Regular and Bold Thai fonts
        Promise.all([
            fetch('/fonts/THSarabunNew.ttf').then(response => response.arrayBuffer()),
            fetch('/fonts/THSarabunNew-Bold.ttf').then(response => response.arrayBuffer())
        ]).then(([regularFont, boldFont]) => {
            // Convert fonts to Base64
            const base64Regular = arrayBufferToBase64(regularFont);
            const base64Bold = arrayBufferToBase64(boldFont);

            // Add fonts to jsPDF virtual file system
            doc.addFileToVFS('THSarabunNew.ttf', base64Regular);
            doc.addFont('THSarabunNew.ttf', 'THSarabunNew', 'normal');

            doc.addFileToVFS('THSarabunNew-Bold.ttf', base64Bold);
            doc.addFont('THSarabunNew-Bold.ttf', 'THSarabunNew', 'bold');

            // ===== HEADER SECTION =====
            doc.setFont('THSarabunNew', 'bold');
            doc.setFontSize(14);
            doc.text("ศูนย์รังสีวินิจฉัย โรงพยาบาลสมุทรสาคร", 105, 15, { align: 'center' });
            doc.text("(DIAGNOSIS CENTER SAMUTSAKHON HOSPITAL)", 105, 20, { align: 'center' });
            
            doc.setFontSize(16);
            doc.text("X - RAY REQUEST", 105, 30, { align: 'center' });
            doc.text("CLINICAL INFORMATION & DIAGNOSIS", 105, 35, { align: 'center' });

            // ===== TWO COLUMN LAYOUT =====
            // Left column starting position
            const leftColX = 20;
            let leftColY = 45;
            
            // Right column starting position
            const rightColX = 100;
            let rightColY = 45;

            // ===== LEFT COLUMN CONTENT =====
            // Patient information
            doc.setFont('THSarabunNew', 'normal');
            doc.setFontSize(12);
            doc.text("วันที่:", leftColX, leftColY);
            doc.text(`${patientData.date || ''}`, leftColX + 7, leftColY);
            doc.text("___________________________", leftColX + 7, leftColY + 0.3);
            doc.text(`ชื่อ: ${patientData.name || ''}`, leftColX, leftColY + 5);
            doc.text("___________________________", leftColX + 5, leftColY + 5.3);
            doc.text(`อายุ:      ${patientData.age || ''}    HN: ${patientData.hn || ''}`, leftColX, leftColY + 10);
            doc.text("________", leftColX + 5, leftColY + 10.3);
            doc.text(`OPD: ${patientData.opd || ''}    WARD: ${patientData.ward || ''}`, leftColX, leftColY + 15);
            leftColY += 25;

            // Type of case
            doc.setFont('THSarabunNew', 'bold');
            doc.text("TYPE OF CASE:", leftColX, leftColY);
            doc.setFont('THSarabunNew', 'normal');
            doc.rect(leftColX, leftColY + 5, 5, 5); // Emergency checkbox
            doc.text("EMERGENCY ☑", leftColX + 7, leftColY + 8);
            doc.rect(leftColX + 25, leftColY + 5, 5, 5); // Urgent checkbox
            doc.text("URGENT □", leftColX + 31, leftColY + 8);
            doc.rect(leftColX + 45, leftColY + 5, 5, 5); // Elective checkbox
            doc.text("ELECTIVE □", leftColX + 51, leftColY + 8);
            leftColY += 20;

            // Type of examination
            doc.setFont('THSarabunNew', 'bold');
            doc.text("TYPE OF EXAMINATION:", leftColX, leftColY);
            doc.setFont('THSarabunNew', 'normal');
            doc.text("X - RAY ______", leftColX, leftColY + 5);
            leftColY += 15;

            // Other sections
            doc.setFont('THSarabunNew', 'bold');
            doc.text("ULTRASOUND ______", leftColX, leftColY);
            leftColY += 10;
            doc.text("CT ______", leftColX, leftColY);
            leftColY += 10;
            doc.text("SPECIAL □ IVP:", leftColX, leftColY);
            leftColY += 10;
            doc.text("OTHERS ......", leftColX, leftColY);

            // ===== RIGHT COLUMN CONTENT =====
            // Request by
            doc.setFont('THSarabunNew', 'bold');
            doc.text("CLINICAL INFORMATION & DIAGNOSIS", rightColX, rightColY);
            doc.setFont('THSarabunNew', 'normal');
            doc.text("________________________________________", rightColX, rightColY + 5);
            doc.text("________________________________________", rightColX, rightColY + 10);
            doc.text("________________________________________", rightColX, rightColY + 15);
            doc.text("________________________________________", rightColX, rightColY + 20);
            doc.text("________________________________________", rightColX, rightColY + 25);
            doc.text("________________________________________", rightColX, rightColY + 30);
            doc.text("________________________________________", rightColX, rightColY + 35);
            doc.text("________________________________________", rightColX, rightColY + 40);
            // rightColY += 15;
            
            // Request by
            doc.setFont('THSarabunNew', 'bold');
            doc.text("REQUEST BY", rightColX, rightColY + 45);
            doc.setFont('THSarabunNew', 'bold');
            doc.text("นัดพบบพทย์ครั้งต่อไป ......", rightColX, rightColY + 50);
            // rightColY += 15;

            // Allergy information
            doc.setFont('THSarabunNew', 'bold');
            doc.text("HISTORY OF ALLERGY", rightColX, rightColY + 55);
            doc.setFont('THSarabunNew', 'normal');
            doc.text("NO", rightColX + 20, rightColY + 60);
            doc.text("YES (ระบุ) ......", rightColX + 20, rightColY + 65);
            // rightColY += 15;

            // Underlying diseases
            doc.setFont('THSarabunNew', 'bold');
            doc.text("โรคประจำตัว (ระบุ):", rightColX, rightColY + 70);
            doc.setFont('THSarabunNew', 'normal');
            doc.text(patientData.underlyingDiseases || "DM,HT,DLP", rightColX + 25, rightColY + 70);
            doc.text("_____________________", rightColX + 25, rightColY + 70.2);

            // ===== FOOTER =====
            doc.setFont('THSarabunNew', 'normal');
            doc.setFontSize(10);
            doc.text("ศูนย์รังสีวินิจฉัย รพ.สมุทรสาคร (034) 427099 – 105 ต่อ 6119 หรือ 6120 (รายงานผลอยู่ด้านหลัง)", 
                    105, 140, { align: 'center' });

            // Generate the PDF as Blob
            const pdfBlob = doc.output('blob');
            resolve(URL.createObjectURL(pdfBlob));
        }).catch(error => {
            console.error("Error loading fonts:", error);
            reject(error);
        });
    });
};
