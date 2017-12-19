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
  var playerGifURL = './assets/img/dancetest.gif'
  // var playerKey = sessionStorage.getItem('playerKey')
  var playerKey = null
  // Put 20 dance gifs into the gifSelect div
  fillGifSelect('dance', 20)
  $("#danceFloorImg").on("click", function(event) {
    var offs = $('#danceFloorImg').offset();
    var mouseClickX = event.clientX - offs.left
    var mouseClickY = event.clientY - offs.top
    // get snapshot of database
    database.ref().once('value', function(snapshot) {
      // if snapshot of the database has our player's key, he must be on the dance floor
      if (playerKey !== null && snapshot.hasChild(playerKey)) {
        console.log(`Set ${playerKey} location to x: ${mouseClickX},y: ${mouseClickY}`)
        // set new location in database
        database.ref().child(playerKey).update({
          location: {
            x: mouseClickX,
            y: mouseClickY
          }
        })
      } else { // if snapshot doesn't have playerKey
        // put new player in db
        var playerRef = database.ref().push({
          gifURL: playerGifURL,
          location: {
            x: mouseClickX,
            y: mouseClickY
          }
        })
        // sessionStorage.setItem('playerKey', playerRef.key) // Keep track of which image they own through the database key
        playerKey = playerRef.key
      }
    })
  })
  // When clicking a gif from the gifSelect div, set our playerGifURL to url of gif they clicked
  $("#gifSelect").on('click', '.selectableGif', function() {
     playerGifURL = $(this).attr('src')
     if (playerKey !== null) {
       database.ref().child(playerKey).update({
         gifURL: playerGifURL
       })
       console.log(`${playerKey} gifURL set to ${playerGifURL}`)
     }
  })

  /**
   * When user closes window, if user has a playerKey, remove it from the database.
   * Session storage should automatically clear when they've closed the window too.
   */
  $(window).unload(function() {
    if (playerKey !== null) {
      database.ref().child(playerKey).remove()
    }
  })
})

/**
 * Every time a child is added to the database, add it to the dancefloor
 */
database.ref().on('child_added', function(snapshot) {
  var user = snapshot.val()
  addImage(user.location.x, user.location.y, user.gifURL, snapshot.ge.path.n[0])
})

/**
 * When someone changes position or image, update it for everyone
 */
database.ref().on('child_changed', function(snapshot) {
  // only update image if it is different from what is in db
  if ($(`#${snapshot.ge.path.n[0]}`).attr('src') !== snapshot.val().gifURL) {
    $(`#${snapshot.ge.path.n[0]}`).attr('src', snapshot.val().gifURL)
  }
  moveImageWithID(snapshot.ge.path.n[0], snapshot.val().location.x, snapshot.val().location.y)
})

/**
 * When a child is deleted, remove their image from the dance floor
 */
database.ref().on('child_removed', function(deletedSnapshot) {
  console.log(`deleting ${deletedSnapshot.ge.path.n[0]}`)
  removeImage(deletedSnapshot.ge.path.n[0])
})

function moveImageWithID(id, x, y) {
  $(`#${id}`).animate({
    'left': x + 'px',
    'top': y + 'px'
  }, 'fast')
}

/**
 * adds an image to the body with the given x y coordinates and url of the image
 */
function addImage(x, y, url, id) {
  var newImage = $('<img>')
  newImage.attr('id', id)
  newImage.attr('class', 'overlays')
  newImage.attr('src', url)
  newImage.css('left', x + 'px')
  newImage.css('top', y + 'px')
  $('#dancefloorContainer').append(newImage)
}

function removeImage(id) {
  $(`#${id}`).remove()
}
/**
 * Adds gifs to the gifSelect div. Title is theme of gifs, count is how many
 * gifs are added and offset changes the index giphy starts at
 */
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

/* Toggle   */
  $("#start").click(function(){
      $("#dancefloorContainer").toggle();
          }); 
  $("#start").click(function(){
      $("#intro").toggle();
          }); 
}