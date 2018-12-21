// const birthdayTime = 1545411600000;
const birthdayTime = 1545364244078;
const tempo = 74;
const frame = 16;

$(document).ready(() => {
  $(window).on("load", () => {
    $(".wrapper").addClass("fade-in");
    const now = new Date().getTime();
    if(now > birthdayTime) {
      $(".loading").addClass("fade-out");
      $(".prompt").addClass("fade-in");
      $(".prompt-play").addClass("fade-in");
      $(".prompt-button").on('click', () => {
        $(".prompt").addClass("fade-out");
        setTimeout(() => {
          $(".audio")[0].play();
          $(".lyrics").each((index, el) => {
            setTimeout(() => {
              $(el).siblings().removeClass("fade-in");
              setTimeout(() => $(el).addClass("fade-in"), 1000);
            }, 1000*((frame/tempo*60)*index - 1.75))
          })
          $(".audio").on("ended", () => {
            console.log("audio ended");
            $(".lyrics").removeClass("fade-in");
            $(".greeting").addClass("fade-in");
          })
        }, 1000*(3/tempo*60))
      })
    } else {
      $(".loading").addClass("fade-out");
      $(".prompt").addClass("fade-in");
      $(".prompt-wait").addClass("fade-in");
    }
  })
});
