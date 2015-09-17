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
})
