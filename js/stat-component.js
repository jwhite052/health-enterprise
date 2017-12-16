(function() {
  var elementsArr = document.getElementsByClassName('jh-stats-box-container');
  for (var i = 0; i < elementsArr.length; i++) {
    // check if stats overlay exists
    if (elementsArr[i].getElementsByClassName('jh-stats-box-overlay')[0]) {
      elementsArr[i].addEventListener('mouseover', function() {
        this.getElementsByClassName('jh-stats-box')[0].classList += ' is-active';
        this.getElementsByClassName('jh-stats-box-overlay')[0].classList += ' is-active';
      });
      elementsArr[i].addEventListener('mouseleave', function() {
        this.getElementsByClassName('jh-stats-box')[0].classList.remove('is-active');
        this.getElementsByClassName('jh-stats-box-overlay')[0].classList.remove('is-active');
      });
      elementsArr[i].addEventListener('click', function() {
        this.getElementsByClassName('jh-stats-box-overlay')[0].classList.toggle('is-active');
        this.getElementsByClassName('jh-stats-box-overlay')[0].classList.toggle('is-active');
      });
    }
  }
})();
