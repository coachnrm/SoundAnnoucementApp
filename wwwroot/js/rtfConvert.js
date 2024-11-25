// This function will convert RTF to plain text by stripping out RTF control words.
window.convertRtfToPlainText = function(rtf) {
    // Regular expression to remove RTF control words (e.g., \b, \i, \fs48)
    var text = rtf.replace(/{\\[^}]*}/g, "") // Remove RTF control words
        .replace(/\\par/g, "\n") // Replace RTF paragraph breaks with newlines
        .replace(/\\tab/g, "\t") // Replace RTF tab characters with tab
        .replace(/\\u\d+?\?/g, "") // Remove Unicode characters (if any)
        .replace(/\r\n|\r|\n/g, "\n"); // Normalize line breaks

    return text.trim(); // Remove any leading/trailing whitespace
};

window.audioHelper = {
    announceQueue: function (number, name, channel) {
        const utterance = new SpeechSynthesisUtterance(`ขอเชิญคิวซักประวัติที่ ${number} คุณ${name} ที่${channel} ค่ะ`);
        utterance.lang = 'th-TH'; // Set the language to Thai
        window.speechSynthesis.speak(utterance);
    }
};