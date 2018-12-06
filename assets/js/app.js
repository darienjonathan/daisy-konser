const heightConfig = {
  baseHeight: 3,
  elementInterval: 2
}

const { baseHeight, elementInterval } = heightConfig;

const elementPosition = {
  prompt: 0,
  daisy: baseHeight,
  video: baseHeight + elementInterval,
  goodluck: baseHeight + 2*elementInterval,
  pray: baseHeight + 3*elementInterval,
  havefun: baseHeight + 4*elementInterval,
  closing: baseHeight + 5*elementInterval,
};

const yPos = () => window.pageYOffset/window.innerHeight;

const calc = {
  // op = -(y - k)((y - k) - 2) dimana op = 1 (opacityMax) terjadi pada y = (k + k + 2)/2 = k + 1. Untuk mencapai opacityMax pada k, maka op = -(y - (k - 1))(y - (k - 1) - 2).
  // agar op = 1 tercapai lebih cepat, maka f(y) dibagi dengan bilangan positif < 1. 
  opacity: maxOpacityPos => -1*(yPos() - (maxOpacityPos - 1))*(yPos() - (maxOpacityPos - 1) - 2)/0.7,
  // volume = f(yPos)
  // 0 <= yPos <= maxVolumePos  -> Linear dari 0 sampe maxVolumePos
  // yPos > maxVolumePos        -> dari maxVolume turun ke minVolume di minVolumePos, kemudian naik lagi
  volume: (maxVolumePos, minVolumePos, minVolume) => {
    const maxVolume = 1;
    
    let volume = yPos() <= maxVolumePos
    ? yPos()/maxVolumePos
    : Math.abs((yPos() - minVolumePos)*(maxVolume - minVolume)/(maxVolumePos - minVolumePos)) + minVolume;

    volume = volume < 0 ? 0 : volume > maxVolume ? maxVolume : volume;
    return volume;
  }
}

const controlOpacity = () => {
  $(".box--prompt").css('opacity', calc.opacity(elementPosition.prompt));
  $(".box--daisy").css('opacity', calc.opacity(elementPosition.daisy));
  $(".box--video").css('opacity', calc.opacity(elementPosition.video));
  $(".box--goodluck").css('opacity', calc.opacity(elementPosition.goodluck));
  $(".box--pray").css('opacity', calc.opacity(elementPosition.pray));
  $(".box--havefun").css('opacity', calc.opacity(elementPosition.havefun));
  $(".box--closing").css('opacity', calc.opacity(elementPosition.closing));
}

const controlGain = (audioSource, gainNode) => {
  let audioVolume = calc.volume(elementPosition.video, elementPosition.pray);
  gainNode.gain.value = audioVolume;
  audioSource.connect(gainNode);

  console.log({ yPos: window.pageYOffset, audioVolume });
};

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
      gainNode.gain.value = 0;
      gainNode.connect(context.destination);
      source.connect(gainNode);

      removeLoadingElement();
      $(".prompt-button").on('click', () => promptScroll({ source, gainNode }));
    
    }, function(err){
      console.log(`Error: ${err}`);
    });
  };
  req.onerror = err => {
    removeLoadingElement();
    $(".prompt-button").on('click', () => promptScroll({ source, gainNode }));
  };
  req.send();
}

const removeLoadingElement = () => {
  $(".loading").addClass("fadeOut");
  setTimeout(() => $(".wrapper").addClass("fadeIn"), 500);
};

const promptScroll = ({ source, gainNode }) => {
  // start playing medias
  $(".content__video").get().forEach(vid => vid.play());
  if(source) source.start(0);

  // prepare scroll elements
  $(".wrapper").removeClass("wrapper--pre-click").addClass("wrapper--post-click");
  $(".box--prompt-button").addClass("fadeOut");
  setTimeout(() => $(".box--prompt-scroll").addClass("fadeIn"), 500);

  // prepare scroll event
  $(window).on('scroll', _.throttle(() => {
    if(source) controlGain(source, gainNode);
    controlOpacity();
  }, 25));
};

$(document).ready(() => $(window).on("load", loadSound));
