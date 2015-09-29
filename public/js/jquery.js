$(document).ready(function(){
  $("#user_box").click(function(){
    $("#user_dropdown").toggle();
  })
  $(document).bind('click', function(e) {
    if($(e.target).closest('#user_box').length === 0 && $(e.target) != $("#user_dropdown")) {
      if($("#user_dropdown").css("display") == "block"){
        $("#user_dropdown").toggle()
      }
    }
  });
  $(".search_bar").submit(function(e){
    var search_term = $(".search_input").val();
    console.log(search_term)
    e.preventDefault();
    console.log("searched")
    window.location.replace("/#/search_results/"+search_term)
    $(".search_input").val("");
  })
  resizeDiv();

  window.onresize = function(event) {
    resizeDiv();
  }

  function resizeDiv() {
    vpw = $(window).width();
    vph = $(window).height() - 80;
    $('#background').css({'height': vph + 'px'});
    $("#overlay_signin").css({'height': vph + 'px'});
  }
  $("sign_up_window").hide();
  $("#sign_in").css("background-color", "rgb(40, 32, 111)");
  $("#sign_up").click(function(){
    $("#sign_in").css("background-color", "rgb(30, 62, 141)");
    $("#sign_up").css("background-color", "rgb(40, 32, 111)");
    $("#sign_in_window").fadeOut();
    $("#sign_up_window").fadeIn();
  })
  $("#sign_in").click(function(){
    $("#sign_up").css("background-color", "rgb(30, 62, 141)")
    $("#sign_in").css("background-color", "rgb(40, 32, 111)")
    $("#sign_in_window").fadeIn();
    $("#sign_up_window").fadeOut();
  })
})
