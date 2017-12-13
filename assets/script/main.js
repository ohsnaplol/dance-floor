$(document).ready(function() {
  $("#danceFloorImg").on("click", function(event) {
    console.log("x: " + event.originalEvent.screenX + " y: " + event.originalEvent.screenY);
  })
})
