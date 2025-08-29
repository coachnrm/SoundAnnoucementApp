// ตัวแปร global สำหรับเก็บ reference ไปยัง .NET functions
let dotNetFunctions = null;

// ฟังก์ชันสำหรับลงทะเบียน .NET functions
function registerDotNetFunctions(dotNetRef) {
    dotNetFunctions = dotNetRef;
}

// การเชื่อมต่อ SignalR
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/queueHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

// Event handlers สำหรับการรับข้อมูลจาก Server
connection.on("ReceiveQueueUpdate", (message) => {
    console.log("Queue update received:", message);
    showNotification(message, 'info');
});

connection.on("QueueStatusUpdated", (data) => {
    console.log("Queue status updated:", data);
    
    // เรียก .NET function เพื่ออัปเดต UI
    if (dotNetFunctions) {
        dotNetFunctions.invokeMethodAsync('UpdateQueueStatus', data.id, data.status);
    } else {
        updateQueueStatus(data.id, data.status);
    }
});

connection.on("QueueStatusHxUpdated", (data) => {
    console.log("Queue history status updated:", data);
    // อัปเดตสถานะประวัติคิวใน UI
    updateQueueHistoryStatus(data.id, data.statusHx);
});

connection.on("NewQueueAdded", (data) => {
    console.log("New queue added:", data);
    
    // เรียก .NET function เพื่อเพิ่มคิวใหม่ใน UI
    if (dotNetFunctions) {
        dotNetFunctions.invokeMethodAsync('AddNewQueueToDisplay', data);
    } else {
        addNewQueueToDisplay(data);
    }
});

// ฟังก์ชันสำหรับเริ่มการเชื่อมต่อ
async function startSignalRConnection() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
        
        // เข้าร่วมกลุ่มตามต้องการ
        await connection.invoke("JoinQueueGroup", "allQueues");
        
        // แสดงการแจ้งเตือน
        showNotification("เชื่อมต่อระบบคิวเรียบร้อย", 'success');
    } catch (err) {
        console.log(err);
        showNotification("ไม่สามารถเชื่อมต่อระบบคิว", 'error');
        setTimeout(startSignalRConnection, 5000);
    }
}

// ฟังก์ชันสำหรับแสดงการแจ้งเตือน
function showNotification(message, type = 'info') {
    // สร้างหรือใช้ระบบแจ้งเตือนที่มีอยู่
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // ลบการแจ้งเตือนหลังจาก 5 วินาที
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// ฟังก์ชันสำหรับอัปเดต UI
function updateQueueStatus(queueId, status) {
    // ลอจิกสำหรับอัปเดตสถานะคิวใน UI
    const queueElement = document.querySelector(`[data-queue-id="${queueId}"]`);
    if (queueElement) {
        queueElement.setAttribute('data-status', status);
        
        // อัปเดตการแสดงผลตามสถานะ
        const statusBadge = queueElement.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.className = `status-badge ${getStatusClass(status)}`;
            statusBadge.textContent = getStatusText(status);
        }
    }
}

function getStatusClass(status) {
    switch (status) {
        case 1: return 'status-arrived';
        case 2: return 'status-not-arrived';
        default: return 'status-waiting';
    }
}

function getStatusText(status) {
    switch (status) {
        case 1: return 'มาแล้ว';
        case 2: return 'ไม่มา';
        default: return 'รอเรียก';
    }
}

function addNewQueueToDisplay(queueData) {
    // ลอจิกสำหรับเพิ่มคิวใหม่ใน UI
    const queueList = document.getElementById('queueList');
    if (!queueList) return;
    
    const newQueueItem = document.createElement('div');
    newQueueItem.className = 'queue-item';
    newQueueItem.setAttribute('data-queue-id', queueData.id || Date.now());
    newQueueItem.innerHTML = `
        <div class="queue-info">
            <span class="patient-hn">HN: ${queueData.hn}</span>
            <span class="patient-name">${queueData.name || 'กำลังโหลด...'}</span>
        </div>
        <div class="queue-details">
            <span class="queue-number">คิว: ${queueData.queueHx || queueData.queueDep}</span>
            <span class="department">ห้อง: ${queueData.queueNameDep}</span>
        </div>
        <div class="queue-status">
            <span class="status-badge status-waiting">รอเรียก</span>
        </div>
    `;
    
    queueList.appendChild(newQueueItem);
}

// การจัดการเมื่อการเชื่อมต่อหลุด
connection.onclose(async () => {
    showNotification("การเชื่อมต่อขาดหาย พยายามเชื่อมต่อใหม่...", 'warning');
    await startSignalRConnection();
});

// Start the connection.
startSignalRConnection();

// ฟังก์ชันสำหรับเรียกคิว (ใช้ร่วมกับ audioHelper)
async function callQueue(queueNumber, patientName, department) {
    try {
        // เรียกใช้ audioHelper สำหรับประกาศเสียง
        if (typeof audioHelper !== 'undefined' && typeof audioHelper.announceQueue === 'function') {
            await audioHelper.announceQueue(queueNumber, patientName, department, 0.7, 1.2, 0.9);
        }
        
        // แจ้งเตือนผ่าน SignalR
        await connection.invoke("SendQueueUpdate", `เรียกคิว ${queueNumber} ผู้ป่วย: ${patientName} ที่ห้อง ${department}`);
    } catch (error) {
        console.error("Error calling queue:", error);
    }
}
// ฟังก์ชันสำหรับเข้าร่วมกลุ่มแผนก
async function joinDepartmentGroup(departmentId) {
    try {
        await connection.invoke("JoinDepartmentGroup", departmentId);
        console.log(`Joined department group: ${departmentId}`);
        showNotification(`เข้าร่วมกลุ่มแผนก: ${departmentId}`, 'info');
    } catch (err) {
        console.error("Error joining department group:", err);
    }
}

// ฟังก์ชันสำหรับออกจากกลุ่มแผนก
async function leaveDepartmentGroup(departmentId) {
    try {
        await connection.invoke("LeaveDepartmentGroup", departmentId);
        console.log(`Left department group: ${departmentId}`);
    } catch (err) {
        console.error("Error leaving department group:", err);
    }
}

// Event handler สำหรับข้อความจากแผนก
connection.on("ReceiveDepartmentMessage", (message) => {
    console.log("Department message received:", message);
    showNotification(`แผนก: ${message}`, 'info');
});

connection.on("DepartmentQueueUpdated", (data) => {
    console.log("Department queue updated:", data);
    // อัปเดต UI เฉพาะสำหรับแผนกนั้น
    updateDepartmentQueue(data);
});

connection.on("NewQueueAddedToDepartment", (data) => {
    console.log("New queue added to department:", data);
    // เพิ่มคิวใหม่ใน UI สำหรับแผนกนั้น
    addNewQueueToDepartment(data);
});

// ฟังก์ชันสำหรับอัปเดตคิวเฉพาะแผนก
function updateDepartmentQueue(data) {
    // ตรวจสอบว่าเป็นแผนกที่กำลังดูอยู่หรือไม่
    if (data.Department === currentDepartment) {
        updateQueueStatus(data.Id, data.Status);
    }
}

function addNewQueueToDepartment(data) {
    // ตรวจสอบว่าเป็นแผนกที่กำลังดูอยู่หรือไม่
    if (data.Department === currentDepartment) {
        addNewQueueToDisplay(data);
    }
}