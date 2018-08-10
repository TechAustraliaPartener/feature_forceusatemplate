<script>
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  var aspect = .5625;

  var player;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('homeInnovationVideoBg', {
      height: window.innerHeight,
      width: window.innerHeight*1.77,
      videoId: 'e1jlg0NMCLo',
      playerVars: { 
        autoplay: 1, 
        controls: 0, 
        showinfo: 0, 
        playlistId: 'e1jlg0NMCLo', 
        rel: 0 
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onError': onPlayerError
      }
    });
  };

  function onPlayerError(event) {
    console.log('error: ', event);
  }

  // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
    //document.querySelector('.player-holder').style.height = (window.innerHeight - 103)+ 'px';

    //this will need to be done in the resize listener as well
    if (window.innerHeight / window.innerWidth > aspect) {
      player.setSize(window.innerHeight / aspect, window.innerHeight);
    } else {
      player.setSize(window.innerWidth, window.innerWidth * aspect);
    }

    event.target.setVolume(0);
    event.target.playVideo();
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
      player.playVideo();
    }
  }
  function stopVideo() {
    player.stopVideo();
  }
</script>
