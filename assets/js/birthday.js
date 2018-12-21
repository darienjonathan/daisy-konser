// const birthdayTime = 1545411600000;
const birthdayTime = 1545364244078;
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
      $(".lyrics").each((index, el) => {
        setTimeout(() => {
          console.log(gainNode.gain.value);
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

const prepareContent = () => {
  console.log("window loaded");
  var context = 'AudioContext' in window
  ? new AudioContext()
  : new webkitAudioContext();

  var source = context.createBufferSource();
  var gainNode = context.createGain();
  
  var req = new XMLHttpRequest();
  req.open('GET', 'assets/audio/birthday.mp3', true);
  req.responseType = 'arraybuffer';
  req.onload = function(){
    console.log("request loaded");
    context.decodeAudioData(req.response, function(buffer){
      console.log("audio decoded");
      source.buffer = buffer;
      gainNode.gain.value = 1;
      gainNode.connect(context.destination);
      source.connect(gainNode);
      $(".wrapper").addClass("fade-in");
      const now = new Date().getTime();
      console.log({ now, birthdayTime });
      if(now > birthdayTime) {
        console.log("play");
        play(source, gainNode);
      } else {
        wait();
      }
    }, function(err){
      console.log(`Error: ${err}`);
    });
  };
  req.onerror = () => prepareContent(({ source, gainNode }));
  req.send();
}

$(document).ready(prepareContent);
