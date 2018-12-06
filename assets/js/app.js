

$(document).ready(() => {
  $(window).on("load", () => {
    $(".loading").addClass("fadeOut");
    setTimeout(() => $(".wrapper").addClass("fadeIn"), 500);
    $(".content__video").get().forEach(vid => vid.volume = 0);

    $(".prompt-button").on('click', promptClick);
    $(window).on('scroll', _.throttle(scroll, 25));
  });
});


const loadSound = () => {
  var context = 'AudioContext' in window
  ? new AudioContext()
  : new webkitAudioContext();

  var source = context.createBufferSource();
  var gainNode = context.createGain();
  
  var req = new XMLHttpRequest();
  req.open('GET', 'assets/audio/audio.mp3', true);
  req.responseType = 'arraybuffer';
  req.onload = function(){
    context.decodeAudioData(req.response, function(buffer){
      source.buffer = buffer;
      gainNode.gain.value = 1;
      gainNode.connect(context.destination);
      source.connect(context.destination);
      source.start(0);
    }, function(err){
      console.log(`Error: ${err}`);
    });
  };
  req.send();
}

const promptClick = () => {
  loadSound();
  $(".wrapper").removeClass("wrapper--pre-click").addClass("wrapper--post-click");
  $(".content__video").get().forEach(vid => {
    let foo = vid.play();
    foo
    .then(res => console.log(res))
    .catch(err => console.log(err));
  });
  $(".box--prompt-button").addClass("fadeOut");
  setTimeout(() => $(".box--prompt-scroll").addClass("fadeIn"), 500);
};

const scroll = () => {
  const baseHeightMultiplier = 3;
  const elementInterval = 2;
  const yPos = window.pageYOffset;
  const height = window.innerHeight;
  const calcOpacity = maxOpacityPos => -1*(yPos - (maxOpacityPos - 1)*height)*(yPos - (maxOpacityPos - 1)*height - 2*height)/(height*height*0.7); //max opacity in maxOpacityPos
  let elementOpacity = {
    prompt: calcOpacity(0),
    daisy: calcOpacity(baseHeightMultiplier),
    video: calcOpacity(baseHeightMultiplier + elementInterval),
    goodluck: calcOpacity(baseHeightMultiplier + 2*elementInterval),
    pray: calcOpacity(baseHeightMultiplier + 3*elementInterval),
    havefun: calcOpacity(baseHeightMultiplier + 4*elementInterval),
    closing: calcOpacity(baseHeightMultiplier + 5*elementInterval),
  };

  $(".box--prompt").css('opacity', elementOpacity.prompt);
  $(".box--daisy").css('opacity', elementOpacity.daisy);
  $(".box--video").css('opacity', elementOpacity.video);
  $(".box--goodluck").css('opacity', elementOpacity.goodluck);
  $(".box--pray").css('opacity', elementOpacity.pray);
  $(".box--havefun").css('opacity', elementOpacity.havefun);
  $(".box--closing").css('opacity', elementOpacity.closing);

  const videoMaxVolume = baseHeightMultiplier + elementInterval + 1;
  let videoVolume = ((yPos - videoMaxVolume*height)/videoMaxVolume + height)/(2*height);
  videoVolume =
    videoVolume < 0
    ? 0
    : videoVolume > 0.5
    ? 0.5
    : videoVolume;

  $(".content__video").get().forEach(vid => vid.volume = videoVolume);
  $(".content__video").get().forEach(vid => console.log(vid.volume));

  console.log({ yPos, videoVolume });
}
