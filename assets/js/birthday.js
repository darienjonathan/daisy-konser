const birthdayTime = 1545411600000;
const tempo = 74;
const frame = 16;
const audioDuration = 133;

const play = (source, gainNode) => {
  $(".loading").addClass("fade-out");
  $(".prompt").addClass("fade-in");
  $(".prompt-play").addClass("fade-in");
  $(".prompt-button").on('click', () => {
    $(".prompt").addClass("fade-out");
    setTimeout(() => {
      source.start(0);
      gainNode.gain.value = 1;
      source.connect(gainNode);
      $(".lyrics").each((index, el) => {
        setTimeout(() => {
          $(el).siblings().removeClass("fade-in");
          setTimeout(() => $(el).addClass("fade-in"), 1000);
        }, 1000*((frame/tempo*60)*index - 1.75))
      })
      setTimeout(() => {
        console.log("audio ended");
        $(".lyrics").removeClass("fade-in");
        $(".greeting").addClass("fade-in");
      }, 1000*audioDuration);
    }, 1000*(3/tempo*60))
  })
};

const wait = () => {
  $(".loading").addClass("fade-out");
  $(".prompt").addClass("fade-in");
  $(".prompt-wait").addClass("fade-in");
};

const loadSound = () => {
  var context = 'AudioContext' in window
  ? new AudioContext()
  : new webkitAudioContext();

  var source = context.createBufferSource();
  var gainNode = context.createGain();
  
  var req = new XMLHttpRequest();
  req.open('GET', 'assets/audio/birthday.mp3', true);
  req.responseType = 'arraybuffer';
  req.onload = function(){
    context.decodeAudioData(req.response, function(buffer){
      source.buffer = buffer;
      gainNode.gain.value = 0;
      gainNode.connect(context.destination);
      source.connect(gainNode);

      $(".wrapper").addClass("fade-in");
      const now = new Date().getTime();
      if(now > birthdayTime) {
        play(source, gainNode);
      } else {
        wait();
      }
    }, function(err){
      console.log(`Error: ${err}`);
    });
  };
  req.onerror = () => console.log('error');
  req.send();
}

$(document).ready(loadSound);


