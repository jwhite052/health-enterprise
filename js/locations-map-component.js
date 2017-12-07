/*
* Callback for Google Maps API
*/
function initLocationsApp() {
  "use strict";

  var mapComponentElement = document.getElementsByClassName('jh-locations__map')[0];

  var map = initMap(document.getElementById('map'));
  var data = initData();
  var markers = initMarkers(map, data.hospitals);
  var infoWindow = new MapInfoWindow();

  // add info window element to view
  mapComponentElement.append(infoWindow.ui.element);

  // event listeners
  infoWindow.ui.element.getElementsByClassName('jh-locations-info-window__close')[0].addEventListener('click', function() {
    this.hide();
  }.bind(infoWindow));

  initMarkerClickHandler(map, markers, infoWindow);

  var locationsMenu = new LocationsAccordionMenu(data.hospitals);
  // attach listener to each menu tab, bind handler to locations menu object
  locationsMenu.ui.tab.hospitals.addEventListener('click', function(e) {
    console.log(this);
    this.expandMenu(e);
  }.bind(locationsMenu));

  locationsMenu.ui.tab.outpatient.addEventListener('click', function(e) {
    this.expandMenu(e);
  }.bind(locationsMenu));

  locationsMenu.ui.tab.urgentcare.addEventListener('click', function(e) {
    this.expandMenu(e);
  }.bind(locationsMenu));

  /*
  * Initialize Map
  */
  function initMap(mapElement) {
    var mapContainerElement = mapElement;

    // initial map settings
    var mapDefaults = {
      center: { lat: 40.0556365, lng: -75.1 },
      zoom: 9
    };

    // initalize map
    var map = new google.maps.Map(mapContainerElement, {
      center: mapDefaults.center,
      zoom: mapDefaults.zoom,
      minZoom: 9,
      maxZoom: 16,
      mapTypeControl: false,
      streetViewControl: false,
      clickableIcons: false,
      styles:  [{'featureType':'administrative','elementType':'labels.text.fill','stylers':[{'color':'#152456'}]},{'featureType':'administrative.neighborhood','elementType':'labels.text.fill','stylers':[{'color':'#569bca'}]},{'featureType':'landscape','elementType':'all','stylers':[{'color':'#f2f4f8'}]},{'featureType':'landscape','elementType':'geometry.fill','stylers':[{'color':'#ffffff'}]},{'featureType':'poi','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'poi.park','elementType':'geometry.fill','stylers':[{'color':'#e6f3d6'},{'visibility':'on'}]},{'featureType':'road','elementType':'all','stylers':[{'saturation':-30},{'lightness':45},{'visibility':'simplified'}]},{'featureType':'road','elementType':'geometry.fill','stylers':[{'color':'#f2f4f8'}]},{'featureType':'road.highway','elementType':'all','stylers':[{'visibility':'simplified'}]},{'featureType':'road.highway','elementType':'geometry.fill','stylers':[{'color':'#cccccc'},{'visibility':'simplified'}]},{'featureType':'road.highway','elementType':'labels.text','stylers':[{'color':'#333333'}]},{'featureType':'road.arterial','elementType':'geometry.fill','stylers':[{'color':'#f4f4f4'}]},{'featureType':'road.arterial','elementType':'labels.text.fill','stylers':[{'color':'#787878'}]},{'featureType':'road.arterial','elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'all','stylers':[{'color':'#eaf6f8'},{'visibility':'on'}]},{'featureType':'water','elementType':'geometry.fill','stylers':[{'color':'#addbf9'}]}]
    });

    return map;
  }

  /*
  * Return Locations Data
  */
  function initData() {
    return (function() {
      var json = null;
      $.ajax({
        'async': false,
        'global': false,
        'url': "/locationsdata.json",
        'dataType': "json",
        'success': function (res) {
          json = res;
        }
      });
      return json;
    })();
  }

  /*
  * Initialize Markers
  */
  function initMarkers(map, data) {
    var list = data;

    // array to store map markers
    var markers = [];
    var currentSelectedMarker;

    for (var i = 0; i < list.length; i++) {
      // determine marker icon
      var markericon;
      if (list[i].type === 'hospital') {
        markericon = '/images/blue-marker-icon.png';
      } else if (list[i].type === 'outpatient') {
        markericon = '/images/purple-marker-icon.png';
      } else if (list[i].type === 'urgent') {
        markericon = '/images/orange-marker-icon.png';
      } else {
        markericon = '/images/blue-marker-icon.png';
      }

      var marker = new google.maps.Marker({
        position: {lat: list[i].position.lat, lng: list[i].position.lng},
        map: map,
        animation: google.maps.Animation.DROP,
        icon: markericon,
        // custom properties
        location: list[i]
      });
      // add marker reference to location list data
      list[i].marker = marker;

      markers.push(marker);
    }

    return markers;
  }

  /*
  * Map Info Window
  */
  function MapInfoWindow() {
    this.ui = {
      element: document.createElement('DIV'),
      titleBar: document.createElement('DIV'),
      titleBarName: document.createElement('DIV'),
      close: document.createElement('DIV'),
      content: document.createElement('DIV'),
      windowBottom: document.createElement('DIV')
    };

    this.ui.element.classList.add('jh-locations-info-window__wrapper', 'locations-info-window__wrapper--default', 'is-hidden');
    this.ui.titleBar.classList.add('jh-locations-info-window__title-bar');
    this.ui.titleBarName.classList.add('jh-locations-info-window__title-bar-name');
    this.ui.close.classList.add('jh-locations-info-window__close');
    this.ui.content.classList.add('jh-locations-info-window');
    this.ui.windowBottom.classList.add('jh-locations-info-window__bottom');

    this.ui.titleBar.appendChild(this.ui.titleBarName);
    this.ui.titleBar.appendChild(this.ui.close);
    this.ui.element.appendChild(this.ui.titleBar);
    this.ui.element.appendChild(this.ui.content);
    this.ui.element.appendChild(this.ui.windowBottom);
  }
  MapInfoWindow.prototype.show = function() {
    if (!this.ui.element.classList.contains('is-visible')) {
      this.ui.element.classList.toggle('is-visible');
      this.ui.element.classList.toggle('is-hidden');
    }
  };
  MapInfoWindow.prototype.hide = function() {
    if (!this.ui.element.classList.contains('is-hidden')) {
      this.ui.element.classList.toggle('is-visible');
      this.ui.element.classList.toggle('is-hidden');
    }
  };
  MapInfoWindow.prototype.update = function(data) {
    var title = '';
    var classStr = '--default';
    if (data.type.toLowerCase() === 'hospital') {
      title = 'Hospitals';
      classStr = '--hospitals';
    } else if (data.type.toLowerCase() === 'outpatient') {
      title = 'Outpatient';
      classStr = '--outpatient';
    } else if (data.type.toLowerCase() === 'urgent') {
      title = 'Urgent Care';
      classStr = '--urgentcare';
    }
    this.ui.titleBarName.innerHTML = title;
    // remove existing window type class names
    this.ui.element.className = this.ui.element.className.replace(/locations-info-window__wrapper--[a-zA-z]*/g, ' ');
    // add current window type class name
    this.ui.element.classList.add('jh-locations-info-window__wrapper' + classStr);

    var content = '<h3 class="jh-locations-info-window__title">' + data.name + '</h3>' +
    '<p class="jh-locations-info-window__address">' + data.address + '<br />' +
    '<a class="jh-locations-info-window__directionslink" href="' + encodeURI('https://www.google.com/maps/place/' + data.address.replace(/<br>/g,' ')) + '" target="_blank">Get Directions</a></p>';
    if (data.phone) { content += '<p class="jh-locations-info-window__phone">' + data.phone + '</p>'; }
    if (data.hours) { content += '<p class="jh-locations-info-window__hours">' + data.hours + '</p>'; }
    this.ui.content.innerHTML = content;

    // update view - view more details button link
    this.ui.windowBottom.innerHTML =
    '<div class="jh-locations-info-window__locationlink"><a href="' + data.url + '">View More Details</a></div>';
  };

  /*
  * Marker Click Handler
  */
  function initMarkerClickHandler(map, markers, infoWindow) {
    // set click handler for each marker
    for (var i = 0; i < markers.length; i++) {
      markers[i].addListener('click', clickHandler);
    }

    function clickHandler() {
      // marker
      this.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){
        this.setAnimation(null);
      }.bind(this), 1400);
      this.setZIndex(10000);

      // info window
      infoWindow.update(this.location);
      infoWindow.show();

      // map
      map.setOptions({
        center: { lat: this.getPosition().lat(), lng: this.getPosition().lng() },
        zoom: 10
      });
    }
  }

  /*
  * Locations List Menu
  */
  function LocationsAccordionMenu(data) {
    this.ui = {
      element: document.getElementsByClassName('jh-locations-menu')[0],
      tab: {
        'hospitals': document.querySelectorAll('.hospitals-menu .jh-locations-menu__tab')[0],
        'outpatient': document.querySelectorAll('.outpatient-menu .jh-locations-menu__tab')[0],
        'urgentcare': document.querySelectorAll('.urgentcare-menu .jh-locations-menu__tab')[0]
      },
      menu: {
        'hospitals': document.querySelectorAll('.hospitals-menu .jh-locations-menu__list')[0],
        'outpatient': document.querySelectorAll('.outpatient-menu .jh-locations-menu__list')[0],
        'urgentcare': document.querySelectorAll('.urgentcare-menu .jh-locations-menu__list')[0]
      }
    };
    var populateList = function(element, data) {
      for (var i = 0; i < data.length; i++) {
        var li = document.createElement('LI');
        var link = document.createElement('A');
        link.setAttribute('href', data[i].url);
        link.innerHTML = data[i].name;
        li.appendChild(link);
        element.appendChild(li);
      }
    };
    populateList(this.ui.menu['hospitals'], data);
    this.test = function() {
      console.log('test!');
    };
  }
  LocationsAccordionMenu.prototype.toggleMenu = function(element) {
    var thisMenuTab = element;
    var thisMenuContent = element.nextElementSibling;
    // if (thisMenuTab.classList.contains('is-collapsed')) {
    //   this.setAria(thisMenuTab, thisMenuContent, true);
    // } else {
    //   this.setAria(thisMenuTab, thisMenuContent, false);
    // }
    thisMenuContent.classList.toggle('is-collapsed');
    thisMenuContent.classList.toggle('is-expanded');
    thisMenuTab.classList.toggle('is-collapsed');
    thisMenuTab.classList.toggle('is-expanded');
  };
  LocationsAccordionMenu.prototype.expandMenu = function(event) {
    event.preventDefault();
    var thisMenuTab = event.target.parentNode;
    if (!thisMenuTab.classList.contains('is-expanded')) {
      // collapse expanded menu
      this.toggleMenu(this.ui.element.querySelectorAll('.jh-locations-menu__tab.is-expanded')[0]);
      this.toggleMenu(thisMenuTab);
    }
  };
} // end initLocationsApp
