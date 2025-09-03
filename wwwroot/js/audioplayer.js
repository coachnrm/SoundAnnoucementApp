// window.playaudio = (sound, id) => {
//     var audioPlayer = new Audio(sound);
//     audioPlayer.onended = () => {
//         if (id !== "") {
//             $(`#${id}`).removeClass('highlight');
//         }
//     }
//     audioPlayer.play();
//     console.log('play ' + sound)
//     if (id !== "") {
//         $(`#${id}`).addClass('highlight');
//     }
// }

window.playaudio = (sound, id) => {
    var audioPlayer = new Audio(sound);
    audioPlayer.onended = () => {
        if (id !== "") {
            document.getElementById(id)?.classList.remove('highlight');
        }
    };
    audioPlayer.play();
    console.log('play ' + sound);
    if (id !== "") {
        document.getElementById(id)?.classList.add('highlight');
    }
};

window.audioPlayer2 = {
  play: (src) => {
    const audio = new Audio(src);
    // optional: audio.preload = 'auto';
    audio.play();
  }
};
