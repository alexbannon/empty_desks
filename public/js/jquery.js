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
})
