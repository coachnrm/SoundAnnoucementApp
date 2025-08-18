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


window.generateInterventionRequestPDF = function (patientData2) {
    return new Promise((resolve, reject) => {
        if (!window.jspdf) {
            reject("jsPDF is not loaded!");
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        function drawUnderlinedText(doc, text, x, y) {
            doc.text(text, x, y);
            const textWidth = doc.getTextWidth(text);
            // doc.setLineWidth(0.5);
            doc.line(x, y + 0.5, x + textWidth, y + 0.5);
        }
        
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
            
            doc.setFont('THSarabunNew', 'bold');
            doc.setFontSize(14);
            doc.text("ชื่อ-สกุลผู้ป่วย", 100, 16);doc.text("...........................................................", 120, 16.3);doc.text("อายุ", 170, 16);doc.text("..........................", 176, 16.3);
            doc.text(patientData2.name, 127, 16);
            doc.text(patientData2.age, 182, 16);
            doc.text("HN", 100, 21);doc.text(".............................................", 105, 21.3);doc.text("OPD/Ward", 143, 21);doc.text("............................................", 160, 21.3);
            doc.text(patientData2.hn, 112, 21);
            doc.text(patientData2.sex, 165, 21);
            
            // ===== HEADER SECTION =====
            doc.setFont('THSarabunNew', 'bold');
            doc.setFontSize(16);
            doc.text("ใบปรึกษาทำหัตถการ รังสีร่วมรักษาระบบลำตัว (Body Intervention)", 105, 28, { align: 'center' });
            doc.text("หน่วยงานรังสีวิทยา โรงพยาบาลสมุทรสาคร", 105, 34, { align: 'center' });
            // วาดเส้นใต้ (เริ่มที่ x=20 และ y=30.5)
            doc.setLineWidth(0.2);
            drawUnderlinedText(doc, "Non Vascular procedure", 84, 39, { align: 'center' });
            // doc.line(105, 39, 105 + "Non Vascular procedure", 39, { align: 'center' });
            // doc.text("Non Vascular procedure", 105, 39, { align: 'center' });
            

            doc.setFont('THSarabunNew', 'normal');
            doc.setFontSize(14);
            doc.rect(10, 43, 3, 3);doc.text("US / CT guided biopsy", 14, 46);doc.text("Location", 80, 46);doc.text("...............................", 93, 46.3);
            doc.rect(140, 43, 3, 3);doc.text("PTBD", 145, 46);doc.ellipse(165, 45, 2, 2);doc.text("Left", 168, 46);doc.ellipse(178, 45, 2, 2);doc.text("Right", 181, 46);

            doc.rect(10, 50, 3, 3);doc.text("FNA / Aspiration", 14, 53);doc.text("Location", 80, 53);doc.text("...............................", 93, 53.3);
            doc.rect(140, 50, 3, 3);doc.text("PCN", 145, 53);doc.ellipse(165, 52, 2, 2);doc.text("Left", 168, 53);doc.ellipse(178, 52, 2, 2);doc.text("Right", 181, 53);

            doc.rect(10, 57, 3, 3);doc.text("Percutaneous drainage (PCD)", 14, 60);doc.text("Location", 80, 60);doc.text("...............................", 93, 60.3);
            doc.rect(140, 57, 3, 3);doc.text("Cholecystostomy", 145, 60);

            doc.rect(10, 64, 3, 3);doc.text("Needle localization", 14, 67);doc.text("Location", 80, 67);doc.text("...............................", 93, 67.3);
            doc.rect(140, 64, 3, 3);doc.text("Check / Exchange PCD/PTBD/PCN", 145, 67);

            doc.rect(10, 71, 3, 3);doc.text("RFA / MWA / Alcohol ablation", 14, 74);doc.text("Location", 80, 74);doc.text("...............................", 93, 74.3);
            doc.rect(140, 71, 3, 3);doc.text("Cholangioplasty", 145, 74);

            doc.setFontSize(16);
            drawUnderlinedText(doc, "Vascular procedure", 88, 82, { align: 'center' });
            doc.setFontSize(14);
            doc.rect(10, 85, 3, 3);doc.text("Paripheral inserted central catheter (PICC)", 14, 88);doc.rect(140, 85, 3, 3);doc.text("Double lumen catheter insertion", 145, 88);

            doc.rect(10, 92, 3, 3);doc.text("Permanent tunneled cathetar insertion (PERM)", 14, 95);doc.rect(140, 92, 3, 3);doc.text("Subcutaneous lmplantable port", 145, 95);

            doc.rect(10, 99, 3, 3);doc.text("Transarterial chemoembolization (TACE)", 14, 102);doc.rect(140, 99, 3, 3);doc.text("Angiogram with embolization", 145, 102);
            
            doc.rect(10, 106, 3, 3);doc.text("Femoral run off", 14, 109);doc.ellipse(80, 108, 2, 2);doc.text("Left", 83, 109);doc.ellipse(95, 108, 2, 2);doc.text("Right", 98, 109);
            doc.rect(140, 106, 3, 3);doc.text("Angiogram", 145, 109);doc.text("Part", 170, 109);doc.text(".......................", 175, 109.3);

            doc.rect(10, 113, 3, 3);doc.text("Angioplasty", 14, 116);doc.rect(140, 113, 3, 3);doc.text("Venoplasty", 145, 116);

            doc.rect(10, 120, 3, 3);doc.text("IVC filter", 14, 123);doc.rect(140, 120, 3, 3);doc.text("อื่น ๆ", 145, 123);doc.text("..................................................", 152, 123.3);

            drawUnderlinedText(doc, "ประวัติและผลเลือดที่สำคัญ", 10, 131, { align: 'center' });
            doc.text("........................................................................................................................................................................................", 45, 131.3);
            doc.text(".....................................................................................................................................................................................................................................", 10, 138.3);
            doc.text(".....................................................................................................................................................................................................................................", 10, 145.3);
            doc.text(".....................................................................................................................................................................................................................................", 10, 152.3);
            doc.text(".....................................................................................................................................................................................................................................", 10, 159.3);
            doc.text(".....................................................................................................................................................................................................................................", 10, 166.3);
            doc.text(".....................................................................................................................................................................................................................................", 10, 174.3);

            doc.text("การใช้ยา Antiplatelet / Anticoagulant", 10, 184);doc.rect(70, 181, 3, 3);doc.text("ไม่มี", 75, 184);doc.rect(83, 181, 3, 3);doc.text("มี", 88, 184);
            doc.text("ระบุ", 96, 184);doc.text("..................................................................................................................", 102 , 184.3);

            doc.text("ประวัติแพ้ยาฝสารทึบรังสี/อาหาร", 10, 191);doc.rect(70, 188, 3, 3);doc.text("ไม่มี", 75, 191);doc.rect(83, 188, 3, 3);doc.text("มี", 88, 191);
            doc.text("ระบุ", 96, 191);doc.text("..................................................................................................................", 102 , 191.3);
            
            doc.text("ลงชื่อแพทย์ผู้ขอ", 50, 198);
            doc.text("......................................................................", 71 , 198.3);
            doc.text(patientData2.surgeon, 76, 198);
            doc.text("วันที่", 127, 198);
            doc.text("........................................", 133 , 198.3);
            doc.text(patientData2.date, 138, 198);
            doc.text("เวลา", 165, 198);
            doc.text("............................", 171 , 198.3);
            doc.text(patientData2.starttime, 176, 198);

            drawUnderlinedText(doc, "ความเห็นแพทย์ผู้รับปรึกษา", 10, 205, { align: 'center' });
            doc.text(".....................................................................................................................................................................................................................................", 10, 212.3);
            doc.text(".....................................................................................................................................................................................................................................", 10, 219.3);
            doc.text(".....................................................................................................................................................................................................................................", 10, 226.3);
            doc.text(".....................................................................................................................................................................................................................................", 10, 233.3);
            doc.text(".....................................................................................................................................................................................................................................", 10, 240.3);
            doc.text(".....................................................................................................................................................................................................................................", 10, 247.3);
            doc.text(".....................................................................................................................................................................................................................................", 10, 254.3);

            doc.text("ลงชื่อแพทย์ผู้ขอ", 50, 263);
            doc.text("......................................................................", 71 , 263.3);
            doc.text(patientData2.surgeon, 76, 263);
            doc.text("วันที่", 127, 263);
            doc.text("........................................", 133 , 263.3);
            doc.text(patientData2.date, 138, 263);
            doc.text("เวลา", 165, 263);
            doc.text("............................", 171 , 263.3);
            doc.text(patientData2.starttime, 176, 263);

            // Generate the PDF as Blob
            const pdfBlob = doc.output('blob');
            resolve(URL.createObjectURL(pdfBlob));
        }).catch(error => {
            console.error("Error loading fonts:", error);
            reject(error);
        });
    });
};

window.generatePathoNotePDF = function (patientData2) {
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

        
        function highlightInPDF(doc, text, x, y, keywords, color = [255, 255, 0], padding = 1) {
            const words = text.split(' ');
            let currentX = x;
            const fontSize = doc.internal.getFontSize();
            const lineHeight = fontSize * 0.3; // ความสูงของบรรทัด
            
            words.forEach(word => {
              const isKeyword = keywords.includes(word);
              const wordWidth = doc.getStringUnitWidth(word) * fontSize / doc.internal.scaleFactor;
              
              if (isKeyword) {
                // ปรับขนาดสี่เหลี่ยมให้ใหญ่ขึ้นด้วย padding
                doc.setFillColor(...color);
                doc.rect(
                  currentX - padding/2, // เพิ่มระยะห่างด้านซ้าย
                  y - padding/2,       // เพิ่มระยะห่างด้านบน
                  wordWidth + padding, // เพิ่มความกว้าง
                  lineHeight + padding, // เพิ่มความสูง
                  'F'
                );
                
                // เขียนข้อความทับ
                doc.text(word, currentX, y + fontSize * 0.3);
              } else {
                doc.text(word, currentX, y + fontSize * 0.3);
              }
              
              currentX += (doc.getStringUnitWidth(word) * fontSize / doc.internal.scaleFactor);
            });
          }
          function highlightInPDF1(doc, text, x, y, keywords, color = [255, 255, 0], padding = 1) {
            const fontSize = doc.internal.getFontSize();
            const lineHeight = fontSize * 0.3;
            
            // บันทึกสีเดิม
            const originalTextColor = doc.getTextColor();
            
            // ตรวจสอบทีละคำใน keywords
            keywords.forEach(keyword => {
                const startPos = text.indexOf(keyword);
                if (startPos >= 0) {
                    // คำนวณความกว้างของ keyword
                    const wordWidth = doc.getStringUnitWidth(keyword) * fontSize / doc.internal.scaleFactor;
                    
                    // คำนวณตำแหน่ง x ของ keyword
                    const prefix = text.substring(0, startPos);
                    const prefixWidth = doc.getStringUnitWidth(prefix) * fontSize / doc.internal.scaleFactor;
                    const keywordX = x + prefixWidth;
                    
                    // วาดพื้นหลัง
                    doc.setFillColor(...color);
                    doc.rect(
                        keywordX - padding/2,
                        y - padding/2,
                        wordWidth + padding,
                        lineHeight + padding,
                        'F'
                    );
                }
            });
            
            // เขียนข้อความทั้งหมด
            doc.setTextColor(originalTextColor);
            doc.text(text, x, y + lineHeight * 0.7);
        }

        // Load both Regular and Bold Thai fonts
        Promise.all([
            fetch('/fonts/THSarabunNew.ttf').then(response => response.arrayBuffer()),
            fetch('/fonts/THSarabunNew-Bold.ttf').then(response => response.arrayBuffer()),
            getBase64FromImageUrl('/images/smskhnew.jpg')
        ]).then(([regularFont, boldFont, imgData]) => {
            // Convert fonts to Base64
            const base64Regular = arrayBufferToBase64(regularFont);
            const base64Bold = arrayBufferToBase64(boldFont);

            // Add fonts to jsPDF virtual file system
            doc.addFileToVFS('THSarabunNew.ttf', base64Regular);
            doc.addFont('THSarabunNew.ttf', 'THSarabunNew', 'normal');

            doc.addFileToVFS('THSarabunNew-Bold.ttf', base64Bold);
            doc.addFont('THSarabunNew-Bold.ttf', 'THSarabunNew', 'bold');

            // ===== PATIENT INFORMATION SECTION =====
            doc.setFont('THSarabunNew', 'normal');
            doc.setFontSize(16);
            
            // doc.setDrawColor(0); // Set border color (black)
            // doc.setLineWidth(0.3); // Set border thickness
            // doc.rect(8, 16, 100, 34); // x, y, width, height

           
            
            // First line
            
            // แทรกรูปโลโก้
            doc.addImage(imgData, 'JPEG', 8, 13, 33, 15);
            
            // const imgData = 'data:image/jpg;base64,/images/logoprolab.jpg'; // แปลงรูปเป็น Base64 D:\SoundAnnoucementApp\wwwroot\images\logoprolab.jpg
            // doc.addImage(imgData, 'jpg', 10, 50, 50, 50); // (x, y, width, height)
            doc.setFontSize(12);
            doc.text("โรงพยาบาลสมุทรสาคร", 46, 21);
            doc.text("Tel. 40524", 51, 25);
            doc.text("หรือ 034-497366 ต่อ 3001,3024", 39, 29);
            doc.setFont('THSarabunNew', "bold");
            doc.setFontSize(20);
            doc.text("ใบส่งตรวจชิ้นเนื้อทางพยาธิวิทยา", 11, 37);
            doc.text("(Pathology Request Form)", 14, 42);

            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.3); // Set border thickness
            doc.rect(80, 15, 68, 28); // x, y, width, height
            
            // Second line
            doc.setFont('THSarabunNew', 'normal');
            doc.setFontSize(11);
            doc.text("โปรดติดสติ๊กเกอร์", 102, 20);
            
            doc.setFontSize(14);
            // Third line
            doc.text("ชื่อ-สกุล", 85, 27);
            doc.text("...........................................................", 95, 27.3);
            doc.text(patientData2.name, 101, 27);
            
            // Third line
            doc.text("อายุ", 85, 33);
            doc.text("...........................", 90, 33.3);
            doc.text(patientData2.age, 96, 33);
            // Third line
            doc.text("HN", 112, 33);
            doc.text("................................", 116, 33.3);
            doc.text(patientData2.hn, 120, 33);
            
            // Third line
            doc.text("แผนก", 85, 39);
            doc.text("..............................................................", 92.5, 39.3);
            doc.text(patientData2.ward, 101, 39);
            
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.3); // Set border thickness
            doc.rect(150, 15, 52, 28); // x, y, width, height
            
            doc.setFontSize(12);
            doc.text("LAB NO.", 154, 20);
            doc.text("สำหรับเจ้าหน้าที่", 167, 36);
            doc.text("งานพยาธิวิทยากายวิภาค", 163, 40);
            
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.3); // Set border thickness
            doc.rect(8, 47, 121, 10); // x, y, width, height
            
            doc.setFont('THSarabunNew', "bold");
            doc.setFontSize(15);
            doc.setTextColor(255, 255, 255); 
            // doc.text("ส่งตรวจ", 10, 53);
            highlightInPDF1(
                doc, "ส่งตรวจ",  11, 50, ["ส่งตรวจ"],[0, 0, 0], 2 // สีฟ้าอ่อน
            );
            doc.setFont('THSarabunNew', 'normal');
            doc.setTextColor(0, 0, 0); 
            const inspection = patientData2.inspection;
            
            doc.rect(26, 50, 4.5, 4.5); if (inspection === 1) { doc.setFontSize(18); doc.text("√", 27, 54 ); doc.setFontSize(14); } doc.text("Routine histopathology", 32.5, 53.5);
            doc.rect(69, 50, 4.5, 4.5); if (inspection === 2) { doc.setFontSize(18); doc.text("√", 70, 54 ); doc.setFontSize(14); } doc.text("Immunotistochemistry", 75.5, 53.5);
            doc.rect(110, 50, 4.5, 4.5); if (inspection === 3) { doc.setFontSize(18); doc.text("√", 108, 54); doc.setFontSize(14); } doc.text("Review", 116.5, 53.5);
            
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.3); // Set border thickness
            doc.rect(131, 47, 71, 10); // x, y, width, height
            
            doc.setTextColor(255, 255, 255);
            doc.setFont('THSarabunNew', "bold");
            doc.setFontSize(15); 
            // doc.text("ส่งตรวจ", 10, 53);
            highlightInPDF1(
                doc, "วันที่เก็บสิ่งส่งตรวจ",  134, 50, ["วันที่เก็บสิ่งส่งตรวจ"],[0, 0, 0], 2 // สีฟ้าอ่อน
            );
            doc.setFont('THSarabunNew', 'normal');
            doc.setTextColor(0, 0, 0); 
            doc.text("...........................................", 162.5, 55.3);
            doc.text(patientData2.inspectiondate, 168, 55);

            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.3); // Set border thickness
            doc.rect(8, 60, 194, 17); // x, y, width, height
            doc.setFont('THSarabunNew', "bold");
            doc.setFontSize(15); 
            doc.setTextColor(255, 255, 255);
            // doc.text("ส่งตรวจ", 10, 53);
            highlightInPDF1(
                doc, "Operation",  10.5, 63, ["Operation"],[0, 0, 0], 2 // สีฟ้าอ่อน
            );
            doc.setFont('THSarabunNew', 'normal');
            doc.setTextColor(0, 0, 0); 
            const operation = patientData2.operation;
            
            doc.rect(30, 63, 4.5, 4.5); if (operation === 1) { doc.setFontSize(18); doc.text("√", 31, 67 ); doc.setFontSize(14); } doc.text("Core needle biopsy", 36, 67.5);
            doc.rect(69, 63, 4.5, 4.5); if (operation === 2) { doc.setFontSize(18); doc.text("√", 70, 67 ); doc.setFontSize(14); } doc.text("Incisional biopsy", 75, 67.5);
            doc.rect(103, 63, 4.5, 4.5); if (operation === 3) { doc.setFontSize(18); doc.text("√", 104, 67 ); doc.setFontSize(14); } doc.text("Punch biopsy", 109, 67.5);
            doc.rect(132, 63, 4.5, 4.5); if (operation === 4) { doc.setFontSize(18); doc.text("√", 133, 67 ); doc.setFontSize(14); } doc.text("Excision", 138, 67.5);
            doc.rect(152, 63, 4.5, 4.5); if (operation === 5) { doc.setFontSize(18); doc.text("√", 153, 67 ); doc.setFontSize(14); } doc.text("Wide excision", 158, 67.5);
            doc.rect(181, 63, 4.5, 4.5); if (operation === 6) { doc.setFontSize(18); doc.text("√", 182, 67 ); doc.setFontSize(14); } doc.text("Curettage", 187, 67.5);
            doc.rect(30, 70, 4.5, 4.5); if (operation === 7) { doc.setFontSize(18); doc.text("√", 31, 67 ); doc.setFontSize(14); } 
            doc.text("อื่นๆ....................................................................................................................................................................................................", 36, 74.3);
            
            doc.setDrawColor(0); // Set border color (black)
            doc.setLineWidth(0.3); // Set border thickness
            doc.rect(8, 80, 121, 120); // x, y, width, height
            
            doc.setLineWidth(0.2); // Set border thickness
            doc.rect(8, 180, 121, 20); // x, y, width, height
            doc.setFont('THSarabunNew', "bold");
            doc.setFontSize(15); 
            doc.setTextColor(255, 255, 255);
            // doc.text("ส่งตรวจ", 10, 53);
            // highlightInPDF(
                //     doc, "Suturemark",  11.5, 181, ["Suturemark"],[0, 0, 0], 2 
                // );
                // เรียกใช้ฟังก์ชันแบบใหม่
                highlightInPDF1(
                    doc, "Suture mark", 11.5, 183, ["Suture mark"], [0, 0, 0],2
                );
                doc.setFont('THSarabunNew', 'normal');
                doc.setTextColor(0, 0, 0); 
            const suturemark = patientData2.suturemark;
            doc.rect(35, 183, 4.5, 4.5); if (suturemark === 1) { doc.setFontSize(18); doc.text("√", 36, 186.5 ); doc.setFontSize(14); } doc.text("None", 41, 186.5);
            doc.rect(50, 183, 4.5, 4.5); if (suturemark === 2) { doc.setFontSize(18); doc.text("√", 51, 186.5 ); doc.setFontSize(14); } doc.text("Short: Superior, Long: Lateral", 56, 186.5);
            doc.rect(101, 183, 4.5, 4.5); if (suturemark === 3) { doc.setFontSize(18); doc.text("√", 102, 186.5 ); doc.setFontSize(14); } doc.text("Double: Deep", 107, 186.5);
            doc.rect(11.5, 192, 4.5, 4.5); if (suturemark === 4) { doc.setFontSize(18); doc.text("√", 36, 195.5 ); doc.setFontSize(14); } 
            doc.text("อื่นๆ...............................................................................................................................", 18, 195.3);


            doc.setFont('THSarabunNew', "bold");
            doc.setFontSize(15); 
            doc.setTextColor(255, 255, 255);
            // doc.text("ส่งตรวจ", 10, 53);
            highlightInPDF1(
                doc, "Important clinical information",  10.5, 83, ["Important clinical information"],[0, 0, 0], 2 
            );
            doc.setFont('THSarabunNew', 'normal');
            doc.setTextColor(0, 0, 0); 


            doc.setLineWidth(0.3); // Set border thickness
            doc.rect(131, 80, 71, 120); // x, y, width, height
            doc.setFont('THSarabunNew', "bold");
            doc.setFontSize(15); 
            doc.setTextColor(255, 255, 255);
            // doc.text("ส่งตรวจ", 10, 53);
            highlightInPDF1(
                doc, "รายละเอียดสิ่งส่งตรวจ",  136, 83, ["รายละเอียดสิ่งส่งตรวจ"],[0, 0, 0], 2 
            );
            doc.setFont('THSarabunNew', 'normal');
            doc.setTextColor(0, 0, 0); 
            doc.text("อวัยวะ ระบุข้าง ตำแหน่ง จำนวนชิ้น", 134, 94);
            const sampledetails = patientData2.sampledetails;
            
            doc.text("1)", 133, 100); doc.rect(137.5, 97, 3.5, 3.5); if (sampledetails === 1) { doc.setFontSize(16); doc.text("√", 138.5, 100 ); doc.setFontSize(14); } doc.text("Rigth", 142, 100);
            doc.rect(152, 97, 3.5, 3.5); if (sampledetails === 2) { doc.setFontSize(16); doc.text("√", 153, 100 ); doc.setFontSize(14); } doc.text("Left", 157, 100);
            doc.rect(166, 97, 3.5, 3.5); if (sampledetails === 3) { doc.setFontSize(16); doc.text("√", 167, 100 ); doc.setFontSize(14); } doc.text("Unspecified", 171, 100);

            doc.text("................................................................................", 133.5, 106.3);
            doc.text("................................................................................", 133.5, 113.3);

            const sampledetails1 = patientData2.sampledetails1;
            
            doc.text("2)", 133, 121); doc.rect(137.5, 118, 3.5, 3.5); if (sampledetails1 === 1) { doc.setFontSize(16); doc.text("√", 138.5, 121 ); doc.setFontSize(14); } doc.text("Rigth", 142, 121);
            doc.rect(152, 118, 3.5, 3.5); if (sampledetails1 === 2) { doc.setFontSize(16); doc.text("√", 153, 121 ); doc.setFontSize(14); } doc.text("Left", 157, 121);
            doc.rect(166, 118, 3.5, 3.5); if (sampledetails1 === 3) { doc.setFontSize(16); doc.text("√", 167, 121 ); doc.setFontSize(14); } doc.text("Unspecified", 171, 121);

            doc.text("................................................................................", 133.5, 128.3);
            doc.text("................................................................................", 133.5, 135.3);
            doc.text("................................................................................", 133.5, 142.3);
            doc.text("................................................................................", 133.5, 149.3);
            doc.text("................................................................................", 133.5, 156.3);
            doc.text("................................................................................", 133.5, 163.3);
            doc.text("................................................................................", 133.5, 170.3);
            doc.text("................................................................................", 133.5, 177.3);
            doc.text("................................................................................", 133.5, 184.3);
            doc.text("................................................................................", 133.5, 191.3);
            doc.text("รวมจำนวนสิ่งส่งตรวจ................................ถุง/ขวด", 133.5, 198);


            doc.setLineWidth(0.3); // Set border thickness
            doc.rect(8, 203, 194, 18); // x, y, width, height
            doc.setFont('THSarabunNew', "bold");
            doc.setFontSize(15); 
            doc.setTextColor(255, 255, 255);
            // doc.text("ส่งตรวจ", 10, 53);
            highlightInPDF1(
                doc, "Clinical Diagnosis/Differential diagnosis",  11.5, 206, ["Clinical Diagnosis/Differential diagnosis"],[0, 0, 0], 2 
            );
            doc.setFont('THSarabunNew', 'normal');
            doc.setTextColor(0, 0, 0); 
            doc.text("..........................................................................................................................................................................................................................", 11.5, 218.3);

            doc.setLineWidth(0.3); // Set border thickness
            doc.rect(8, 224, 194, 12); // x, y, width, height
            doc.setFont('THSarabunNew', "bold");
            doc.setFontSize(15); 
            doc.setTextColor(255, 255, 255);
            // doc.text("ส่งตรวจ", 10, 53);
            highlightInPDF1(
                doc, "Pre-surgical therapy",  11.5, 228, ["Pre-surgical therapy"],[0, 0, 0], 2 
            );
            doc.setFont('THSarabunNew', 'normal');
            doc.setTextColor(0, 0, 0); 
            const presurgical = patientData2.presurgical;
            doc.rect(48, 228, 4.5, 4.5); if (presurgical === 1) { doc.setFontSize(16); doc.text("√", 49, 232 ); doc.setFontSize(14); } doc.text("Chemotherapy", 54, 232);
            doc.rect(78, 228, 4.5, 4.5); if (presurgical === 2) { doc.setFontSize(16); doc.text("√", 79, 232 ); doc.setFontSize(14); } doc.text("Radiation", 84, 232);
            doc.rect(100, 228, 4.5, 4.5); if (presurgical === 2) { doc.setFontSize(16); doc.text("√", 101, 232 ); doc.setFontSize(14); } doc.text("อื่นๆ", 106, 232);doc.text("............................................................................................................", 112, 232.3);
            
            doc.setLineWidth(0.3); // Set border thickness
            doc.rect(8, 238, 194, 12); // x, y, width, height
            doc.setFont('THSarabunNew', "bold");
            doc.setFontSize(15); 
            doc.setTextColor(255, 255, 255);
            // doc.text("ส่งตรวจ", 10, 53);
            highlightInPDF1(
                doc, "แพทย์ผู้ส่งตรวจ",  11.5, 242, ["แพทย์ผู้ส่งตรวจ"],[0, 0, 0], 2 
            );
            doc.setTextColor(255, 255, 255);
            // doc.text("ส่งตรวจ", 10, 53);
            highlightInPDF1(
                doc, "Tel.",  150, 242, ["Tel."],[0, 0, 0], 2 
            );
            doc.setFont('THSarabunNew', 'normal');
            doc.setTextColor(0, 0, 0); 
            doc.text(".....................................................................................................................................", 35, 246.3);
            doc.text(patientData2.surgeon, 43, 246);
            doc.text("......................................................", 152, 246.3);
            doc.text(patientData2.tel, 160, 246);

            doc.setLineWidth(0.3); // Set border thickness
            doc.rect(8, 252, 194, 30); // x, y, width, height
            doc.setFont('THSarabunNew', "bold");
            doc.setFontSize(15); 
            doc.text("NOTE", 11.5, 257);
            doc.setFont('THSarabunNew', 'normal');
            doc.text("..........................................................................................................................................................................................................................", 11.5, 264.3);
            doc.text("..........................................................................................................................................................................................................................", 11.5, 271.3);
            doc.text("..........................................................................................................................................................................................................................", 11.5, 278.3);




            //ตัวอย่างการใช้งาน
            // highlightInPDF(
            //     doc, "ส่งตรวจ และ Ratnology เป็นคำสำคัญ", 10, 60, ["ส่งตรวจ", "Ratnology"],[173, 216, 230],2 // สีฟ้าอ่อน
            //      // กำหนดค่า padding เพิ่มเติม (optional)
            // );
            
            // doc.setDrawColor(0); // Set border color (black)
            // doc.setLineWidth(0.3); // Set border thickness
            // doc.rect(8, 51, 194, 238); // x, y, width, height

            
            
            // Generate the PDF as Blob
            const pdfBlob = doc.output('blob');
            resolve(URL.createObjectURL(pdfBlob));
        }).catch(error => {
            console.error("Error loading fonts:", error);
            reject(error);
        });
    });
};