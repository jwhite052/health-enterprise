(function() {
  var elementsArr = document.getElementsByClassName('jh-stats-box-container');
  for (var i = 0; i < elementsArr.length; i++) {
    // check if stats overlay exists
    if (elementsArr[i].getElementsByClassName('jh-stats-box-overlay')[0]) {
      elementsArr[i].addEventListener('mouseover', function() {
        this.classList += ' is-active';
      });
      elementsArr[i].addEventListener('mouseleave', function() {
        this.classList.remove('is-active');
      });
      elementsArr[i].addEventListener('click', function() {
        this.classList.toggle('is-active');
      });
    }
  }
})();
