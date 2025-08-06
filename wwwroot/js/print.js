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

window.generateOperativeNotePDF = function (patientData2) {
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
            doc.setFontSize(16);
            doc.text("OPERATIVE NOTE", 105, 15, { align: 'center' });
            doc.text("Samutsakhon hospital", 105, 20, { align: 'center' });
            
            doc.setFontSize(14);
            doc.text("Form No.6", 10, 24, { align: 'left' });
            doc.text("รบ.2ต.05", 190, 24);

            // ===== PATIENT INFORMATION SECTION =====
            doc.setFont('THSarabunNew', 'normal');
            doc.setFontSize(12);

            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.5); // Set border thickness
            doc.rect(8, 26, 140, 32); // x, y, width, height

            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.5); // Set border thickness
            doc.rect(148, 26, 18, 32); // x, y, width, height

            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.5); // Set border thickness
            doc.rect(148, 26, 18, 5); // x, y, width, height

            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.5); // Set border thickness
            doc.rect(166, 26, 20, 32); // x, y, width, height

            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.5); // Set border thickness
            doc.rect(166, 26, 20, 5); // x, y, width, height

            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.5); // Set border thickness
            doc.rect(186, 26, 18, 32); // x, y, width, height

            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.5); // Set border thickness
            doc.rect(186, 26, 18, 5); // x, y, width, height
            
            // First line
            doc.text("Date", 10, 29);
            doc.text("............................................", 16, 29.3);
            doc.text(patientData2.date, 25, 29);
            doc.text("Start time", 47, 29);
            doc.text("...........................................................", 55, 29.3);
            doc.text(patientData2.starttime, 70, 29);
            doc.text("End time", 95, 29);
            doc.text(".......................................................................", 96, 29.3);
            doc.text(patientData2.endtime, 115, 29);
            
            // Second line
            doc.text("Patient", 10, 34);
            doc.text(".........................................................................................", 19, 34.3);
            doc.text(patientData2.name, 45, 34);
            doc.text("Age", 80, 34);
            doc.text("..................................", 83, 34.3);
            doc.text(patientData2.age, 95, 34);
            doc.text("Ward", 105, 34);
            doc.text(".....................................................", 108, 34.3);
            doc.text(patientData2.ward, 115, 34);
            
            // Third line
            doc.text("H.N.", 10, 39);
            doc.text("..............................................................................................", 15, 39.3);
            doc.text(patientData2.hn, 40, 39);
            doc.text("A.N.", 80, 39);
            doc.text("........................................................................................", 85, 39.3);
            doc.text(patientData2.an, 105, 39);
            
            // Fourth line - Staff
            doc.text("Surgeon", 10, 44);
            doc.text("........................................................................................", 20, 44.3);
            doc.text(patientData2.surgeon, 25, 44);
            doc.text("Assistant", 80, 44);
            doc.text(".................................................................................", 90, 44.3);
            doc.text(patientData2.assistant, 95, 44);
            
            // Fifth line - Nurses
            doc.text("Scrub nurse", 10, 49);
            doc.text("...............................................................................", 25, 49.3);
            doc.text(patientData2.scrubNurse, 30, 49);
            doc.text("Circulate nurse", 80, 49);
            doc.text("..................................................................", 100, 49.3);
            doc.text(patientData2.circulateNurse, 100, 49);
            
            // Sixth line - Anesthesia
            doc.text("Anesthesiologist", 10, 54);
            doc.text(".........................................................................", 30, 54.3);
            doc.text(patientData2.anesthesiologist, 34, 54);
            doc.text("Nurse anesthetist", 80, 54);
            doc.text(".............................................................", 103, 54.3);
            doc.text(patientData2.anesthetist, 104, 54);
            
            // Counted items
            doc.text("Counted", 150, 29);
            doc.text("Pre-op", 170, 29);
            doc.text("Post-op", 190, 29);
            doc.text("Swab", 150, 35);
            doc.text("5", 173, 35);
            doc.text("5", 193, 35);
            doc.text("Gauze", 150, 40);
            doc.text("5", 173, 40);
            doc.text("5", 193, 40);
            doc.text("Sponge", 150, 45);
            doc.text("3", 173, 45);
            doc.text("3", 193, 45);
            doc.text("ลงชื่อ", 150, 50);
            doc.text(patientData2.scrubNurse.split(' ')[0], 170, 50);
            doc.text(patientData2.scrubNurse.split(' ')[0], 190, 50);
            
            // Diagnosis section
            doc.text("Preoperative diagnosis", 10, 62);
            doc.text("..............................................................................................................................................................................................................................................", 39, 62.3);
            doc.text(patientData2.preOpDiagnosis, 60, 62);
            doc.text("Postoperative diagnosis", 10, 67);
            doc.text("...........................................................................................................................................................................................................................................", 41, 67.3);
            doc.text(patientData2.postOpDiagnosis, 60, 67);
            
            // Operation
            doc.text("Operation", 10, 72);
            doc.text(".......................................................................................................................................................................................................................................................................", 22, 72.3);
            doc.text(patientData2.operation, 40, 72);
            
            // Anesthesia checkboxes
            doc.text("Anaesthesis", 10, 77);
            doc.rect(30, 74, 5, 5); doc.text("Local", 37, 77);
            doc.rect(55, 74, 5, 5, 'F'); doc.text("GA", 61, 77);
            doc.rect(80, 74, 5, 5); doc.text("Spinal block", 86, 77);
            doc.rect(105, 74, 5, 5); doc.text("Epidural block", 112, 77);
            doc.rect(131, 74, 5, 5); doc.text("Brachial block", 137, 77);
            doc.rect(30, 80, 5, 5); doc.text("Ankle block", 37, 83);
            doc.rect(55, 80, 5, 5); doc.text("IV", 61, 83);
            doc.rect(80, 80, 5, 5); doc.text("MAC", 86, 83);
            doc.rect(105, 80, 5, 5); doc.text("Other", 112, 83); doc.text("........................................", 120, 83.3);
            
            // Position checkboxes
            doc.text("Position", 10, 90);
            doc.rect(30, 87, 5, 5, 'F'); doc.text("Supine", 37, 90);
            doc.rect(55, 87, 5, 5); doc.text("Prone", 61, 90);
            doc.rect(80, 87, 5, 5); doc.text("Lithotomy", 86, 90);
            doc.rect(105, 87, 5, 5); doc.text("Lt lateral", 112, 90);
            doc.rect(131, 87, 5, 5); doc.text("Rt lateral", 137, 90);
            doc.rect(155, 87, 5, 5); doc.text("Other", 162, 90); doc.text("........................................", 170, 90.3);
            
            // Inclusion checkboxes
            doc.text("Incision", 10, 97);
            doc.rect(30, 94, 5, 5); doc.text("Midline", 37, 97);
            doc.rect(55, 94, 5, 5); doc.text("Upper midline", 61, 97);
            doc.rect(80, 94, 5, 5); doc.text("Lower midline", 86, 97);
            doc.rect(105, 94, 5, 5); doc.text("Grid iron", 112, 97);
            doc.rect(131, 94, 5, 5); doc.text("Lance", 137, 97);
            doc.rect(155, 94, 5, 5, 'F'); doc.text("Other transverse incision", 162, 97);
            
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.5); // Set border thickness
            doc.rect(8, 104, 70, 8); // x, y, width, height

            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.5); // Set border thickness
            doc.rect(8, 112, 70, 152); // x, y, width, height

            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.5); // Set border thickness
            doc.rect(78, 104, 126, 8); // x, y, width, height

            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.5); // Set border thickness
            doc.rect(78, 112, 126, 152); // x, y, width, height
            
            // Description of operation
            doc.setFont('THSarabunNew', 'bold');
            doc.text("DESCRIPTION OF OPERATION", 105, 103, { align: 'center' });
            doc.text("OPERATIVE FINDINGS", 45, 109, { align: 'center' });
            doc.text("PROCEDURE", 145, 109, { align: 'center' });
            doc.setFont('THSarabunNew', 'normal');
            
            const operationText = [
                "- soft tissue mass origin from pectoralis major and invade right clavicle",
                "- The patient was placed in supine position",
                "- The transverse incision was done",
                "- The muscle was incised to the right clavicle",
                "- The finding was described as shown",
                "- The soft tissue mass was removed",
                "- The space was irrigated with water",
                "- The bleeding was checked",
                "- The muscle was sutured with vicryl 2-0",
                "- The subcutaneous tissue was suture with vicryl 2-0",
                "- The skin was closed with stapler"
            ];
            
            let yPos = 116;
            operationText.forEach(line => {
                doc.text(line, 80, yPos);
                yPos += 7;
            });
            
            doc.text("Patho", 10, 255);
            doc.text("right clavicle", 30, 255);
            doc.text("..............................................................................", 20, 255.4);
            
            doc.text("Estimated blood loss", 10, 260);
            doc.text(patientData2.bloodLoss, 50, 260);
            doc.text("..............................................", 38, 260.3);
            doc.text("ml", 70, 260);
            
            doc.text("Skin", 80, 260);
            doc.rect(88, 257, 5, 5, 'F'); doc.text("Primary closure", 96, 260);
            doc.rect(118, 257, 5, 5); doc.text("Delayed primary closure", 126, 260);
            
            doc.text("Immediate complication", 10, 268);
            doc.rect(60, 265, 5, 5, 'F'); doc.text("No", 67, 268);
            doc.rect(80, 265, 5, 5); doc.text("Yes", 87, 268);
            
            doc.text("Doctor signature", 150, 268);
            doc.text(patientData2.surgeon, 150, 274);
            

            // Generate the PDF as Blob
            const pdfBlob = doc.output('blob');
            resolve(URL.createObjectURL(pdfBlob));
        }).catch(error => {
            console.error("Error loading fonts:", error);
            reject(error);
        });
    });
};



window.generateProlabNotePDF = function (patientData2) {
    return new Promise((resolve, reject) => {
        if (!window.jspdf) {
            reject("jsPDF is not loaded!");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

         // ฟังก์ชันโหลดฟอนต์
         function arrayBufferToBase64(buffer) {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        }

        // ฟังก์ชันโหลดรูปแบบ Promise
        function getBase64FromImageUrl(url) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = function () {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL("image/jpeg"));
                };
                img.onerror = reject;
                img.src = url;
            });
        }

        // Load both Regular and Bold Thai fonts
        Promise.all([
            fetch('/fonts/THSarabunNew.ttf').then(response => response.arrayBuffer()),
            fetch('/fonts/THSarabunNew-Bold.ttf').then(response => response.arrayBuffer()),
            getBase64FromImageUrl('/images/logoprolab.jpg')
        ]).then(([regularFont, boldFont, imgData]) => {
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
            doc.text("FM-REQ-004 : REV.01", 170, 14);

            // ===== PATIENT INFORMATION SECTION =====
            doc.setFont('THSarabunNew', 'normal');
            doc.setFontSize(16);

            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.3); // Set border thickness
            doc.rect(8, 16, 100, 34); // x, y, width, height

            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.3); // Set border thickness
            doc.rect(109, 16, 93, 34); // x, y, width, height
            
            // First line
            doc.text("บริษัทใปรเฟสชั่นเนล ลาโบราทอรี่ แมเนจเม้นท์ คอร์ป จำกัด", 10, 22);
            doc.setFontSize(12);
            // แทรกรูปโลโก้
            doc.addImage(imgData, 'JPEG', 10, 25, 24, 16);
            
            // const imgData = 'data:image/jpg;base64,/images/logoprolab.jpg'; // แปลงรูปเป็น Base64 D:\SoundAnnoucementApp\wwwroot\images\logoprolab.jpg
            // doc.addImage(imgData, 'jpg', 10, 50, 50, 50); // (x, y, width, height)
            doc.text("เลขที่ 2 ซอยโพธิ์แก้ว 3 แยก 2 ถนนโพธิ์แก้ว", 36, 27);
            doc.text("แขวงคลองจั่น เขตบางกะปิ กรุงเทพฯ 10245", 36, 32);
            doc.text("โทร.02-770-8795 แฟกซ์ 02-770-8795", 36, 37);
            doc.text("www.prolab.co.th", 36, 42);
            doc.setFontSize(14);
            doc.text("พัฒนาอย่างต่อเนื่อง ปราชญ์เปรื่องเรื่องบริการ มาตรฐานงานตรวจวิเคราะห์", 10, 47);
            
            // Second line
            doc.text("Name", 113, 23);
            doc.text(".........................................................", 122, 23.3);
            doc.text(patientData2.name, 125, 23);
            doc.text("Age", 170, 23);
            doc.text("........................", 176, 23.3);
            doc.text(patientData2.age, 185, 23);
            
            // Third line
            doc.text("Hn", 113, 29);
            doc.text(".....................................", 118, 29.3);
            doc.text(patientData2.hn, 123, 29);
            doc.text("Ward", 150, 29);
            doc.text("..............................................", 158, 29.3);
            doc.text(patientData2.ward, 165, 29);

            // Third line
            doc.text("Hospital/Clinic", 113, 35);
            doc.text("............................................................................", 135, 35.3);
            doc.text(patientData2.hospital, 145, 35);

            // Third line
            doc.text("Date", 113, 41);
            doc.text("................................", 120, 41.3);
            doc.text(patientData2.date, 123, 41);
            doc.text("Requested", 147, 41);
            doc.text(".........................................", 163, 41.3);
            doc.text(patientData2.surgeon, 165, 41);

            // Third line
            doc.text("Remark", 113, 47);
            doc.text(".........................................................................................", 125, 47.3);
            doc.text(patientData2.remark, 145, 47);
            
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.2); // Set border thickness
            doc.rect(8, 51, 194, 9); // x, y, width, height
            
            doc.setFontSize(20);
            doc.text("SURGICAL PATHOLOGY REQUEST FORM", 68, 57);
            
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.3); // Set border thickness
            doc.rect(8, 51, 194, 238); // x, y, width, height

            // Third line
            doc.setFontSize(16);
            doc.text("Method of specimen collection :", 10, 66);
            doc.setFontSize(14);
            doc.rect(68, 62.5, 5, 5); doc.text("Needie biopsy", 74.5, 66);
            doc.rect(100, 62.5, 5, 5); doc.text("Punch biopsy", 106.5, 66);
            doc.rect(132, 62.5, 5, 5); doc.text("Incisionai biopsy", 138.5, 66);
            doc.rect(166, 62.5, 5, 5); doc.text("Excisionai biopsy", 172.5, 66);
            
            doc.rect(68, 69.5, 5, 5, "F"); doc.text("Surgical", 74.5, 73);
            doc.rect(100, 69.5, 5, 5); doc.text("Radical", 106.5, 73);
            doc.rect(132, 69.5, 5, 5); doc.text("Curettage", 138.5, 73);
            doc.rect(166, 69.5, 5, 5); doc.text("Cone biopsy", 172.5, 73);
            
            doc.setFontSize(16);
            doc.text("Organ and location :", 10, 78);
            
            doc.setFontSize(14);
            doc.text("Side of specimen :", 17, 85);
            doc.rect(49, 81.5, 5, 5); doc.text("Right", 55.5, 85);
            doc.rect(66, 81.5, 5, 5); doc.text("Left", 72.5, 85);
            doc.rect(81, 81.5, 5, 5); doc.text("Middle", 87.5, 85);
            doc.text("Specimen submitted :", 105, 85);
            doc.rect(140, 81.5, 5, 5); doc.text("Portion", 146.5, 85);
            doc.rect(160, 81.5, 5, 5); doc.text("Whole", 166.5, 85);
            doc.text("Number of specimen", 17, 92);
            doc.text("..................................................", 49, 92.3);
            doc.text(patientData2.piece, 65, 92);
            doc.text("Piece", 90, 92);
            doc.text("Number of Package", 106, 92);
            doc.text("..............................", 135, 92.3);
            doc.text(patientData2.bottle, 145, 92);
            doc.text("Bottle", 159, 92);
            doc.text(".............................", 168, 92.3);
            doc.text(patientData2.bag, 178, 92);
            doc.text("Bag", 191, 92);
            
            doc.setFontSize(16);
            doc.text("Clinical Diagnosis :", 10, 99);
            doc.setFontSize(14);
            doc.text("..........................................................................................................................................................................................................................................", 10, 106.3);
            doc.text(patientData2.clinicaldiagnosis1, 17, 106);
            doc.text("..........................................................................................................................................................................................................................................", 10, 113.3);
            doc.text(patientData2.clinicaldiagnosis2, 17, 113);
            doc.text("..........................................................................................................................................................................................................................................", 10, 120.3);
            doc.text(patientData2.clinicaldiagnosis3, 17, 120);
            
            doc.rect(23, 123.5, 5, 5); doc.text("Slide Consult", 30, 127.5);
            doc.rect(65, 123.5, 5, 5); doc.text("Immunohistochemistry stain", 72, 127.5);
            doc.rect(125, 123.5, 5, 5); doc.text("Histochemistry Stain", 132, 127.5);
            
            doc.setFontSize(16);
            doc.text("Organ :", 10, 135);
            
            doc.setFontSize(14);
            doc.rect(17, 137.5, 5, 5); doc.text("Ampatation", 24, 141.5);
            doc.rect(17, 144.5, 5, 5); doc.text("Appeodb", 24, 148.5);
            doc.rect(17, 151.5, 5, 5); doc.text("Bone Marow", 24, 155.5);
            doc.rect(17, 158.5, 5, 5); doc.text("Braill", 24, 162.5);
            doc.rect(17, 165.5, 5, 5); doc.text("Brenst Mastoctonry", 24, 169.5);
            doc.rect(17, 172.5, 5, 5); doc.text("Brenst Mastoctonry", 24, 176.5);doc.text("with Asilary Content", 24, 182.5);
            doc.rect(17, 186.5, 5, 5); doc.text("Endccervix", 24, 190.5);
            doc.rect(17, 193.5, 5, 5); doc.text("EndccervixFallopian Tube", 24, 197.5);
            doc.rect(17, 200.5, 5, 5); doc.text("Gapladdar", 24, 204.5);
            doc.rect(17, 207.5, 5, 5); doc.text("Golon", 24, 211.5);
            doc.rect(17, 214.5, 5, 5); doc.text("Lymph node", 24, 218.5);
            doc.rect(17, 221.5, 5, 5); doc.text("Prostate Giand", 24, 225.5);
            doc.rect(17, 228.5, 5, 5); doc.text("Torsil", 24, 232.5);
            doc.rect(17, 235, 5, 5); doc.text("Thyroid", 24, 239.5);
            doc.rect(17, 242.5, 5, 5); doc.text("Uterus with BSO", 24, 246.5);
            doc.rect(17, 249.5, 5, 5); doc.text("Werthim's Operetron", 24, 253.5);
            doc.rect(17, 256.5, 5, 5); doc.text("Whippie's Resechon", 24, 260.5);
            doc.rect(17, 263.5, 5, 5, "F"); doc.text("Other...............................................", 24, 267.5);
            doc.text("..................................................................", 17, 274.8);
            doc.text(patientData2.other, 18, 274.5);
            doc.text("..................................................................", 17, 280.8);
            doc.text("..................................................................", 17, 286.8);
            
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.2); // Set border thickness
            doc.rect(75, 135, 127, 154); // x, y, width, height
            doc.text("Signiticant Fingings", 130, 140);
            
            // Generate the PDF as Blob
            const pdfBlob = doc.output('blob');
            resolve(URL.createObjectURL(pdfBlob));
        }).catch(error => {
            console.error("Error loading fonts:", error);
            reject(error);
        });
    });
};



window.generateSaveNotePDF = function (patientData2) {
    return new Promise((resolve, reject) => {
        if (!window.jspdf) {
            reject("jsPDF is not loaded!");
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // ฟังก์ชันโหลดฟอนต์
        function arrayBufferToBase64(buffer) {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        }
        
        // ฟังก์ชันโหลดรูปแบบ Promise
        function getBase64FromImageUrl(url) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = function () {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL("image/png"));
                };
                img.onerror = reject;
                img.src = url;
            });
        }
        
        // Load both Regular and Bold Thai fonts
        Promise.all([
            fetch('/fonts/THSarabunNew.ttf').then(response => response.arrayBuffer()),
            fetch('/fonts/THSarabunNew-Bold.ttf').then(response => response.arrayBuffer()),
            getBase64FromImageUrl('/images/GarudaEmblem.png')
        ]).then(([regularFont, boldFont, imgData]) => {
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
            doc.setFontSize(27);
            doc.text("บันทึกข้อความ", 85, 35);
            // แทรกรูปโลโก้
            doc.addImage(imgData, 'PNG', 30, 15, 25, 18);
            
            doc.setFontSize(18);
            doc.text("ส่วนราชการ.......................................................................................................................", 32, 45.3);
            doc.text(patientData2.governmentagency, 56, 45);
            doc.text("ที่...................................................................วันที่..............................................................", 32, 52.3);
            doc.text(patientData2.no, 38, 52);
            doc.text(patientData2.datenow, 120, 52);
            doc.text("เรื่อง...................................................................................................................................", 32, 59.3);
            doc.text(patientData2.subject, 45, 59);
            doc.text("เรียน...................................................................................................................................", 32, 70.3);
            doc.text(patientData2.learn, 45, 70);


            doc.text("ขอแสดงความนับถือ", 140, 250);
            doc.text("(..................................................)", 130, 270.3);
            doc.text(patientData2.surgeon, 142, 270);
            doc.text("", 142, 278.3);
            doc.text(patientData2.branch, 142, 278);
              
            

            // Generate the PDF as Blob
            const pdfBlob = doc.output('blob');
            resolve(URL.createObjectURL(pdfBlob));
        }).catch(error => {
            console.error("Error loading fonts:", error);
            reject(error);
        });
    });
};
