// wwwroot/js/youtube-player.js
let player;

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player('yt-player', {
    videoId: 'lCIN8h0b0sk',
    width: 560,
    height: 315
  });
};
