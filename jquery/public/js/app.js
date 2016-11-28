var $ = jQuery
var messages = [
  'A totally different random message',
  'This message maybe came from an async API call',
  'Wow this is another message'
];

$(document).ready(function () {
  var banner = $("#banner")
  $('#updateBannerButton').on('click', function() {
    var oldMessage = banner.text()
    banner.text(messages.shift())
    messages.push(oldMessage)
  })
})
