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

