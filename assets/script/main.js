// Initialize Firebase
var config = {
  apiKey: "AIzaSyAU1zkwv38jAxzuRXg7dDAAbv_Q8GqHo7k",
  authDomain: "dancefloor-20362.firebaseapp.com",
  databaseURL: "https://dancefloor-20362.firebaseio.com",
  projectId: "dancefloor-20362",
  storageBucket: "dancefloor-20362.appspot.com",
  messagingSenderId: "473688295370"
};
firebase.initializeApp(config)
var database = firebase.database()

$(document).ready(function() {
  fillGifSelect('dance', 20)
  $("#danceFloorImg").on("click", function(event) {
    addImage(event.originalEvent.clientX,event.originalEvent.clientY, './assets/img/dancetest.gif');
  })
})

function addImage(x, y, url) {
  var newImage = $('<img>')
  newImage.attr('class', 'overlays')
  newImage.attr('src', url)
  newImage.css('left', x + 'px')
  newImage.css('top', y + 'px')
  $('body').append(newImage)
}

function fillGifSelect(title, count, offset) {
  var queryURL = `https://api.giphy.com/v1/stickers/search?q=${title}&limit=${count}&offset=${offset}&api_key=dc6zaTOxFJmzC`
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
    for (var i = 0; i < count; i++) {
      $("#gifSelect").append(`
        <img class='img-thumbnail selectableGif' src='${response.data[i].images.original.url}'>
      `);
    }
  });
}
