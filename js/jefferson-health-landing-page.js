/*
* Search Box
*/

(function() {
  var ui = {
    tabs: document.querySelectorAll('.jh-search-tabs-box__tabs li'),
    panels: document.querySelectorAll('.jh-search-tabs-box__panel')
  };

  // set first tab active
  ui.tabs[0].classList.add('is-active');
  ui.panels[0].classList.add('is-active');

  for (var i = 0; i < ui.tabs.length; i++) {
    ui.tabs[i].addEventListener('click', function(){
      if (!this.classList.contains('is-active')) {
        for (var j = 0; j < ui.tabs.length; j++) {
          ui.tabs[j].classList.remove('is-active');
        }
        this.classList.add('is-active');
        for (var k = 0; k < ui.panels.length; k++) {
          if (ui.panels[k].id === this.getAttribute('data-toggle')) {
            ui.panels[k].classList.add('is-active');
          } else {
            ui.panels[k].classList.remove('is-active');
          }
        }
      }
    });
  }
})();
