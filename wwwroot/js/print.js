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

window.generateOperativeNurseNotePDF = function (patientData2) {
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
            doc.setFont('THSarabunNew', 'normal');
            doc.setFontSize(16);
            doc.text("SKH-NUR-IPD13_OR", 10, 15);doc.text("แผ่นที่......", 180, 15);
            
            doc.setFontSize(16);
            doc.text("แบบบันทึกการพยาบาลสำหรับผู้ป่วยผ่าตัด โรงพยาบาลสมุทรสาคร", 105, 22, { align: 'center' });

            doc.setFontSize(14);

            //กล่อง Date/time
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.1); // Set border thickness
            doc.rect(8, 26, 24, 5); // x, y, width, height

            //กล่อง สัญญาณชีพ
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.1); // Set border thickness
            doc.rect(32, 26, 24, 5); // x, y, width, height

            //กล่อง อื่นๆ
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.1); // Set border thickness
            doc.rect(56, 26, 18, 5); // x, y, width, height

            //กล่องกิจกรรมการพยาบาล
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.1); // Set border thickness
            doc.rect(74, 26, 81, 25); // x, y, width, height

            //กล่องประเมินผล
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.1); // Set border thickness
            doc.rect(155, 26, 45, 25); // x, y, width, height

            doc.text("Date/time", 10, 30);doc.text("สัญญาณชีพ", 37, 30);doc.text("อื่นๆ", 63, 30);
            //กล่องเล็ก P, R, BP, FHS
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.1); // Set border thickness
            doc.rect(32, 31, 8, 5); // x, y, width, height
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.1); // Set border thickness
            doc.rect(40, 31, 8, 5); // x, y, width, height
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.1); // Set border thickness
            doc.rect(48, 31, 8, 5); // x, y, width, height
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.1); // Set border thickness
            doc.rect(56, 31, 9, 5); // x, y, width, height
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.1); // Set border thickness
            doc.rect(65, 31, 9, 5); // x, y, width, height
            doc.text("P", 36, 35);doc.text("R", 42, 35);doc.text("BP", 49, 35);doc.text("FHS", 57, 35);
            
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.1); // Set border thickness
            doc.rect(8, 31, 24, 10); // x, y, width, height
            //กล่องเล็กล่าง P, R, BP, FHS
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.1); // Set border thickness
            doc.rect(32, 36, 8, 5); // x, y, width, height
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.1); // Set border thickness
            doc.rect(40, 36, 8, 5); // x, y, width, height
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.1); // Set border thickness
            doc.rect(48, 36, 8, 5); // x, y, width, height
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.1); // Set border thickness
            doc.rect(56, 36, 9, 5); // x, y, width, height
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.1); // Set border thickness
            doc.rect(65, 36, 9, 5); // x, y, width, height

            doc.text(patientData2.date, 10, 37);doc.text("กิจกรรมการพยาบาล", 105, 37);doc.text("ประเมินผล", 170, 37);
            //กล่องข้อมูล/ปัญหา
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.1); // Set border thickness
            doc.rect(8, 41, 66, 10); // x, y, width, height
            doc.text("ข้อมูล/ปัญหา", 35, 47);

            //กล่อง Sign in (ก่อนดมยาสลบ)
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.1); // Set border thickness
            doc.rect(8, 51, 66, 8); // x, y, width, height
            doc.rect(10, 54, 2, 2, 'F'); doc.text("Sign in (ก่อนดมยาสลบ)", 15, 56);

            //กล่องตรวจสอบใบเซ็นต์ยินยอมผ่าตัด
            doc.rect(74, 51, 81, 8); // x, y, width, height
            doc.rect(77, 54, 2, 2, 'F'); doc.text("ตรวจสอบใบเซ็นต์ยินยอมผ่าตัด", 80, 56);

            //กล่องล่างประเมินผล
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.1); // Set border thickness
            doc.rect(155, 51, 45, 8); // x, y, width, height
            doc.rect(158, 54, 2, 2); doc.text("มี", 163, 56);doc.rect(167, 54, 2, 2); doc.text("ไม่มี..........................", 172, 56);

            //กล่อง Sign in (ก่อนดมยาสลบ)
            // doc.setDrawColor(0); // Set border color (black)
            // doc.setLineWidth(0.1); // Set border thickness
            // doc.rect(8, 59, 66, 8); // x, y, width, height
            // doc.text("อาการแรกรับ", 10, 64);doc.text("ผู้ป่วยรู้สึกตัวดี ช่วยเหลือตนเองได้ มีก้อนที่ไหปลาร้าข้างขวา on IVF แขนซ้าย", 30, 64);

            // Define the rectangle dimensions
            const rectX = 8;
            const rectY = 59;
            const rectWidth = 66;
            const rectHeight = 32;

            // Draw the rectangle
            doc.setDrawColor(0);
            doc.setLineWidth(0.1);
            doc.rect(rectX, rectY, rectWidth, rectHeight);

            // The label and text you want to display
            const label = "อาการแรกรับ";
            const text = "ผู้ป่วยรู้สึกตัวดี ช่วยเหลือตนเองได้ มีก้อนที่ไหปลาร้าข้างขวา on IVF แขนซ้าย ผู้ป่วยตื่นดี ไม่เหนื่อย หายใจ";

            // First write the label at a fixed position
            doc.text(label, rectX + 2, rectY + 6); // Positioned slightly below top

            // Calculate available width for the text (accounting for label width)
            const labelWidth = doc.getStringUnitWidth(label) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            const availableWidth = rectWidth - 6 - labelWidth; // 6 = padding (2 left + 4 right)

            // Split the text into lines that fit within the available width
            const splitText = doc.splitTextToSize(text, availableWidth);

            // Calculate starting Y position (start below the label)
            const lineHeight = 5;
            const startY = rectY + 6; // Start below the label

            // Add each line of text, indented after the label
            splitText.forEach((line, i) => {
                // For first line, position after the label
                if (i === 0) {
                    doc.text(line, rectX + 4 + labelWidth, startY);
                } 
                // For subsequent lines, align with the text (not the label)
                else {
                    doc.text(line, rectX + 4, startY + (i * lineHeight));
                }
            });

            
            doc.rect(74, 59, 81, 8); // x, y, width, height
            doc.rect(77, 62, 2, 2, 'F'); doc.text("ยืนยันชื่อ การผ่าตัด ตำแหน่งที่จะทำการผ่าตัด", 80, 64);

            doc.rect(155, 59, 45, 8); // x, y, width, height
            doc.rect(158, 62, 2, 2); doc.text("ถูกต้อง", 163, 64);doc.rect(174, 62, 2, 2); doc.text("ไม่ถูกต้อง", 178, 64);
        
            
            // Generate the PDF as Blob
            const pdfBlob = doc.output('blob');
            resolve(URL.createObjectURL(pdfBlob));
        }).catch(error => {
            console.error("Error loading fonts:", error);
            reject(error);
        });
    });
};
