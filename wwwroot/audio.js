window.audioHelper = {
    announceNumber: function (number) {
        const utterance = new SpeechSynthesisUtterance(`ขอเชิญคิวซักประวัติที่ ${number} ที่ช่องบริการ 2 ค่ะ`);
        utterance.lang = 'th-TH'; // Set the language to Thai
        window.speechSynthesis.speak(utterance);
    }
};
