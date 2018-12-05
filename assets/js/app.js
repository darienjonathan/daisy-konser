

$(document).ready(() => {
  $(window).on("load", () => {
    $(".loading").addClass("fadeOut");
    setTimeout(() => $(".wrapper").addClass("fadeIn"), 500);
    $(".content__video").get().forEach(vid => vid.volume = 0);
    $(".prompt-button").on('click', promptClick);

    const source = loadSound();
    source.start(0);

    $(window).on('scroll', _.throttle(scroll, 25));
  });
});


const loadSound = () => {
  let audioBuffer = null;
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  let context = new AudioContext();
  
  let req = new XMLHttpRequest();
  req.open('GET', './assets/audio/audio.mp3', true);
  req.responseType = 'arraybuffer';
  req.onload = () => {
    context.decodeAudioData(req.response, buffer => {
      audioBuffer = buffer;
    });
  };
  req.send();

  let source = context.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(context.destination);
  return source;
}

const promptClick = () => {
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
