const birthdayTime = 1545411600000;
const tempo = 74;
const frame = 16;

$(document).ready(() => {
  $(window).on("load", () => {
    const now = new Date().getTime();
    if(now < birthdayTime) {
      $(".loading").addClass("fade-out");
      $(".prompt").addClass("fade-in");
      $(".prompt-button").addClass("fade-in");
      $(".prompt-button").on('click', () => {
        $(".audio")[0].play();
        $(".prompt").addClass("fade-out");
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
      })
    } else {
      $(".loading").addClass("fade-out");
      $(".prompt").addClass("fade-in");
      $(".prompt-wait").addClass("fade-in");
    }
  })
});
