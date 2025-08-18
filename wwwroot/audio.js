// window.audioHelper = {
//     announceNumber: function (number) {
//         const utterance = new SpeechSynthesisUtterance(`ขอเชิญคิวซักประวัติที่ ${number} ที่ช่องบริการ 2 ค่ะ`);
//         utterance.lang = 'th-TH'; // Set the language to Thai
//         window.speechSynthesis.speak(utterance);
//     }
// };

window.audioHelper = {
    announceQueue: function (number, name, channel) {
        const utterance = new SpeechSynthesisUtterance(`ขอเชิญคิวซักประวัติที่${number} คุณ${name} ที่ช่องซักประวัติที่${channel}ครับ`);
        utterance.lang = 'th-TH'; // Set the language to Thai
        window.speechSynthesis.speak(utterance);
    }
};

window.audioHelper2 = {
    announceWard: function (name) {
        const text = `ผู้ป่วยจากวอร์ด ${name}`;
        const utt  = new SpeechSynthesisUtterance(text);
        utt.lang   = "th-TH";
        window.speechSynthesis.speak(utt);
    }
};

// window.audioHelper3 = {
//     announceQueue: function (number, name, channel) {
//         const utterance = new SpeechSynthesisUtterance(`ขอเชิญคิวซักประวัติที่ ${number}   ที่ช่องซักประวัติที่ ${channel}`);
//         utterance.lang = 'th-TH'; // Set the language to Thai
//         window.speechSynthesis.speak(utterance);
//     }
// };

window.audioHelper3 = {
    announceQueue: function (number, name, channel) {
        // Split the number into parts (e.g., "เอ 001" -> ["เอ", "001"])
        const parts = number.split(' ');
        const thaiLetter = parts[0];
        const numberPart = parts.length > 1 ? parts[1] : '';
        
        // Convert each digit to Thai word with pauses
        let numberSpeech = '';
        for (const digit of numberPart) {
            const thaiDigit = {
                '0': 'ศูนย์',
                '1': 'หนึ่ง',
                '2': 'สอง',
                '3': 'สาม',
                '4': 'สี่',
                '5': 'ห้า',
                '6': 'หก',
                '7': 'เจ็ด',
                '8': 'แปด',
                '9': 'เก้า'
            }[digit] || digit;
            
            numberSpeech += thaiDigit + ' ..... '; // Add pause between digits
        }
        
        const fullText = `ขอเชิญคิวซักประวัติที่ ${thaiLetter} ... ${numberSpeech} ... ที่ช่องซักประวัติที่ ${channel}`;
        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.lang = 'th-TH';
        utterance.rate = 0.7; // Slower speech rate (0.1 to 10, 1 is normal)
        
        window.speechSynthesis.speak(utterance);
    }
};
