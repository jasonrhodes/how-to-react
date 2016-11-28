(function() {

  const banner = document.getElementById('banner')
  const button = document.getElementById('changeMessage')

  button.addEventListener('click', function(e) {
    banner.innerHTML = 'Some different message'
  })

})()
