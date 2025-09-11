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
    },
    announceQueue1: function (queueNumber, name, channel, options = {}) {
        const settings = {
            rate: options.rate || 0.7,
            pitch: options.pitch || 1.1,
            volume: options.volume || 2.0,
            textTemplate: options.textTemplate || "ขอเชิญคิวที่ {0} ที่ห้องตรวจ	{2} "
        };

        const text = settings.textTemplate
            .replace('{0}', queueNumber)
            .replace('{1}', name)
            .replace('{2}', channel);

        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'th-TH';
        speech.rate = settings.rate;
        speech.pitch = settings.pitch;
        speech.volume = settings.volume;

        const voices = speechSynthesis.getVoices();
        const thaiVoice = voices.find(voice => voice.lang === 'th-TH' || voice.lang === 'th');
        
        if (thaiVoice) {
            speech.voice = thaiVoice;
        }

        speechSynthesis.speak(speech);
    },
    announceQueue2: function (queueNumber, name, channel, spotPlace, options = {}) {
        const settings = {
            rate: options.rate || 0.7,
            pitch: options.pitch || 1.1,
            volume: options.volume || 2.0,
            textTemplate: options.textTemplate || "ขอเชิญคิวที่ {0} ที่ช่องซักประวัติที่ {3}"
        };

        // แปลง queueNumber เป็น string และจัดการค่า null
        const queueText = queueNumber !== null && queueNumber !== undefined ? queueNumber.toString() : "";

        const text = settings.textTemplate
            .replace('{0}', queueText)
            .replace('{1}', name)
            .replace('{2}', channel)
            .replace('{3}', spotPlace);

        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'th-TH';
        speech.rate = settings.rate;
        speech.pitch = settings.pitch;
        speech.volume = settings.volume;

        const voices = speechSynthesis.getVoices();
        const thaiVoice = voices.find(voice => voice.lang === 'th-TH' || voice.lang === 'th');
        
        if (thaiVoice) {
            speech.voice = thaiVoice;
        }

        speechSynthesis.speak(speech);
    },

    announceQueue3: function (queueNumber, name, channel, spotPlace, options = {}) {
        const settings = {
            rate: options.rate || 0.7,
            pitch: options.pitch || 1.1,
            volume: options.volume || 2.0,
            textTemplate: options.textTemplate || "ขอเชิญคิวที่ {0} ที่ห้องตรวจ {2}"
        };

        // แปลง queueNumber เป็น string และจัดการค่า null
        const queueText = queueNumber !== null && queueNumber !== undefined ? queueNumber.toString() : "";

        const text = settings.textTemplate
            .replace('{0}', queueText)
            .replace('{1}', name)
            .replace('{2}', channel)
            .replace('{3}', spotPlace);

        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'th-TH';
        speech.rate = settings.rate;
        speech.pitch = settings.pitch;
        speech.volume = settings.volume;

        const voices = speechSynthesis.getVoices();
        const thaiVoice = voices.find(voice => voice.lang === 'th-TH' || voice.lang === 'th');
        
        if (thaiVoice) {
            speech.voice = thaiVoice;
        }

        speechSynthesis.speak(speech);
    }
//     announceQueue2: function (queueNumber, name, channel, spotPlace, options = {}) {
//     const settings = {
//         rate: options.rate || 0.9,
//         pitch: options.pitch || 1.0,
//         volume: options.volume || 1.0
//     };

//     const queueText = queueNumber !== null && queueNumber !== undefined ? queueNumber.toString() : "";

//     // --- Step 1: TTS "ขอเชิญคิวซักประวัติที่"
//     const part1 = new SpeechSynthesisUtterance("ขอเชิญคิวซักประวัติที่");
//     part1.lang = 'th-TH';
//     part1.rate = settings.rate;
//     part1.pitch = settings.pitch;
//     part1.volume = settings.volume;

//     part1.onend = function () {
//         // --- Step 2: play queue number audio
//         const audioNumber = new Audio(`/audio/customaudio/${queueText}.mp3`);

//         audioNumber.onended = function () {
//             // --- Step 3: TTS "ที่ช่องซักประวัติที่"
//             const part3 = new SpeechSynthesisUtterance("ที่ช่องซักประวัติที่");
//             part3.lang = 'th-TH';
//             part3.rate = settings.rate;
//             part3.pitch = settings.pitch;
//             part3.volume = settings.volume;

//             part3.onend = function () {
//                 // --- Step 4: play spotPlace audio
//                 const audioSpot = new Audio(`/audio/customaudio/${spotPlace}.mp3`);
//                 audioSpot.play();
//             };

//             speechSynthesis.speak(part3);
//         };

//         audioNumber.play();
//     };

//     speechSynthesis.speak(part1);
// }



};