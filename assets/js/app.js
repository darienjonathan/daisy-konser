const config = {
  height: {
    baseHeight: 3,
    elementInterval: 2
  },
  volume: {
    maxVolume: 1,
    minVolume: 0.05
  }
};

const { baseHeight, elementInterval } = config.height;

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
  // opacity = f(yPos) = -(yPos - k)((yPos - k) - 2) // dimana opacity = 1 (opacityMax) terjadi pada yPos = (k + k + 2)/2 = k + 1.
  // Untuk mencapai opacityMax pada k, maka opacity = -(yPos - (k - 1))(yPos - (k - 1) - 2).
  // agar opacityMax tercapai lebih cepat, maka f(yPos) dibagi dengan bilangan positif < 1. 
  opacity: maxOpacityPos => -1*(yPos() - (maxOpacityPos - 1))*(yPos() - (maxOpacityPos - 1) - 2)/0.7,
  // volume = f(yPos)
  // 0 <= yPos <= maxVolumePos  -> Linear dari 0 sampe maxVolumePos
  // yPos > maxVolumePos        -> dari maxVolume turun ke minVolume di minVolumePos, kemudian naik lagi secara linear (gunakan fungsi absolut)
  volume: (maxVolumePos, minVolumePos) => {
    const { maxVolume, minVolume } = config.volume;
    let volume = yPos() <= maxVolumePos
    ? yPos()/maxVolumePos
    : Math.abs((yPos() - minVolumePos)*(maxVolume - minVolume)/(maxVolumePos - minVolumePos)) + minVolume;

    volume = volume < 0 ? 0 : volume > maxVolume ? maxVolume : volume;
    return volume;
  }
}

const controlOpacity = () => {
  Object.keys(elementPosition).forEach(elName => {
    $(`.box--${elName}`).css('opacity', calc.opacity(elementPosition[elName]))
  });
};

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

      prepareContent(({ source, gainNode }));
    }, function(err){
      console.log(`Error: ${err}`);
    });
  };
  req.onerror = () => prepareContent(({ source, gainNode }));
  req.send();
}

const prepareContent = ({ source, gainNode }) => {
  $(".loading").addClass("fadeOut");
  setTimeout(() => $(".wrapper").addClass("fadeIn"), 500);
  $(".prompt-button").on('click', () => promptScroll({ source, gainNode }));
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
    if(source && gainNode) controlGain(source, gainNode);
    controlOpacity();
  }, 25));
};

$(document).ready(() => $(window).on("load", loadSound));
