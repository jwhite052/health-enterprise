/*
* Callback for Google Maps API
*/
function initLocationsMap(dataObj) {

  'use strict';

  /**
   * Initialize Map
  */
  function LocationsMap(mapElement) {
    this.element = mapElement;
    this.defaultMapSettings = {
      center: { lat: 40.0556365, lng: -75.1 },
      zoom: 9
    };
    this.map = new google.maps.Map(this.element, {
      center: this.defaultMapSettings.center,
      zoom: this.defaultMapSettings.zoom,
      minZoom: 9,
      maxZoom: 16,
      mapTypeControl: false,
      streetViewControl: false,
      clickableIcons: false,
      fullscreenControl: false,
      styles:  [{'featureType':'administrative','elementType':'labels.text.fill','stylers':[{'color':'#152456'}]},{'featureType':'administrative.neighborhood','elementType':'labels.text.fill','stylers':[{'color':'#569bca'}]},{'featureType':'landscape','elementType':'all','stylers':[{'color':'#f2f4f8'}]},{'featureType':'landscape','elementType':'geometry.fill','stylers':[{'color':'#ffffff'}]},{'featureType':'poi','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'poi.park','elementType':'geometry.fill','stylers':[{'color':'#e6f3d6'},{'visibility':'on'}]},{'featureType':'road','elementType':'all','stylers':[{'saturation':-30},{'lightness':45},{'visibility':'simplified'}]},{'featureType':'road','elementType':'geometry.fill','stylers':[{'color':'#f2f4f8'}]},{'featureType':'road.highway','elementType':'all','stylers':[{'visibility':'simplified'}]},{'featureType':'road.highway','elementType':'geometry.fill','stylers':[{'color':'#cccccc'},{'visibility':'simplified'}]},{'featureType':'road.highway','elementType':'labels.text','stylers':[{'color':'#333333'}]},{'featureType':'road.arterial','elementType':'geometry.fill','stylers':[{'color':'#f4f4f4'}]},{'featureType':'road.arterial','elementType':'labels.text.fill','stylers':[{'color':'#787878'}]},{'featureType':'road.arterial','elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'all','stylers':[{'color':'#eaf6f8'},{'visibility':'on'}]},{'featureType':'water','elementType':'geometry.fill','stylers':[{'color':'#addbf9'}]}]
    });
  }

  /**
   * Locations Data
  */
  function LocationsData(locations) {
    this.data = {};

    var locationsStr = locations.toLowerCase();
    var jsonObj = (function() {
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
    for (var key in jsonObj) {
      console.log("locationsStr.indexOf(key): ", locationsStr.indexOf(key));
      if (locationsStr.indexOf(key) !== -1) {
        this.data[key] = jsonObj[key];
      }
    }
  }

  /**
   * Initialize Markers
  */
  function MapMarkers(map, data) {
    // array to store map markers
    this.map = map;
    this.markers = [];

    this.data = data;

    this.currentMarker = {};
    this.currentMarkersOnMap = {};

    for (var key in data) {
      var list = data[key];
      for (var i = 0; i < list.length; i++) {
        // determine marker icon
        var markericons = ['/images/blue-marker-icon.png', '/images/purple-marker-icon.png', '/images/orange-marker-icon.png', '/images/darkblue-marker-icon.png'];
        var markericon = '';
        if (list[i].type === 'hospital') {
          markericon = markericons[0];
        } else if (list[i].type === 'outpatient') {
          markericon = markericons[1];
        } else if (list[i].type === 'urgent') {
          markericon = markericons[2];
        } else {
          markericon = markericons[0];
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

        // marker.addListener('mouseover', function() {
        //   this.setIcon(markericons[3]);
        // }.bind(marker));
        // marker.addListener('mouseout', function() {
        //   this.setIcon(markericon);
        // }.bind(marker));

        this.markers.push(marker);
      }
    }
  }
  MapMarkers.prototype.setClickHandler = function(infoWindow) {
    // set click handler for each marker
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].addListener('click', clickHandler);
    }
    function clickHandler() {
      var defaultZoomIn = 15;
      var defaultZoomOut = 10;
      var currentZoom = this.map.getZoom();

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
      currentZoom = this.map.getZoom(); // default

      if (this.currentMarker !== this) {
        currentZoom = this.map.getZoom();
      }
      else {
        if (currentZoom > defaultZoomOut) {
          currentZoom = defaultZoomIn;
        } else {
          currentZoom = defaultZoomOut;
        }
      }

      this.currentMarker = this;
    }
  };

  /**
   * Map Info Window
  */
  function MapInfoWindow(mapElement) {
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

    // add info window element to view
    mapElement.append(this.ui.element);

    // event listeners
    this.ui.element.getElementsByClassName('jh-locations-info-window__close')[0].addEventListener('click', function() {
      this.hide();
    }.bind(this));
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

  /**
   * Locations List Menu
  */
  function LocationsAccordionMenu(data, element) {
    this.data = data;
    this.ui = {
      element: element,
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
    populateList(this.ui.menu.hospitals, data.hospitals);
    populateList(this.ui.menu.outpatient, data.outpatient);
    populateList(this.ui.menu.urgentcare, data.urgentcare);
    function populateList(element, data) {
      for (var i = 0; i < data.length; i++) {
        var li = document.createElement('LI');
        var link = document.createElement('A');
        link.setAttribute('href', data[i].url);
        link.innerHTML = data[i].name;
        li.appendChild(link);
        element.appendChild(li);
        li.addEventListener('click', clickHandler.bind(data[i]));
      }
    }
    function clickHandler(e) {
      e.preventDefault();
      google.maps.event.trigger(this.marker, 'click');
    }

    // attach listener to each menu tab, bind handler to locations menu object
    this.ui.tab.hospitals.addEventListener('click', function(e) {
      this.expandMenu(e);
    }.bind(this));

    this.ui.tab.outpatient.addEventListener('click', function(e) {
      this.expandMenu(e);
    }.bind(this));

    this.ui.tab.urgentcare.addEventListener('click', function(e) {
      this.expandMenu(e);
    }.bind(this));
  }
  LocationsAccordionMenu.prototype.setAria = function(element1, element2, expanded) {
    if (expanded) {
      element1.setAttribute('aria-expanded', 'true');
      element2.setAttribute('aria-hidden', 'false');
    } else {
      element1.setAttribute('aria-expanded', 'false');
      element2.setAttribute('aria-hidden', 'true');
    }
  };
  LocationsAccordionMenu.prototype.toggleMenu = function(element) {
    var thisMenuTab = element;
    var thisMenuContent = element.nextElementSibling;
    if (thisMenuTab.classList.contains('is-collapsed')) {
      this.setAria(thisMenuTab, thisMenuContent, true);
    } else {
      this.setAria(thisMenuTab, thisMenuContent, false);
    }
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


  /**
   * Locations Map Filters
  */
  function MapMarkerFilters(/** @param {LocationsMap} */ locationsMap, /** @param {Object} */ markers) {
    var currentMarkers = markers;
    var map = locationsMap.map;
    var mapFilterFieldsUI = {
      'address': document.getElementsByClassName('jh-search-locations__address')[0],
      'distance': document.getElementsByClassName('jh-search-locations__distance')[0],
      'region': document.getElementsByClassName('jh-search-locations__region')[0],
      'type': document.getElementsByClassName('jh-search-locations__type')[0]
    };

    var updateMap = function() {
      var region = document.getElementsByClassName('jh-search-locations__region')[0].value;
      var type = document.getElementsByClassName('jh-search-locations__type')[0].value;
      for (var i = 0; i < currentMarkers.length; i++) {
        if ((currentMarkers[i].location.region === region.toLowerCase() || region.toLowerCase() === "default") &&
            (currentMarkers[i].location.type === type.toLowerCase() || type.toLowerCase() === "default")) {
          currentMarkers[i].setMap(map);
        } else {
          currentMarkers[i].setMap(null);
        }
      }
    };

    var updateMapRadius = function() {
      var distance = document.getElementsByClassName('jh-search-locations__distance')[0].value;
      var address = document.getElementsByClassName('jh-search-locations__address')[0].value;

      if (distance !== 'default') {
        console.log('Distance: ' + distance);
        switch (distance) {
          case '1':
            currentSearchCircle.setOptions({radius: getRadiusInMeters(1)});
            map.setOptions({zoom: 15, center: currentSearchMarker.position});
            break;
          case '5':
            currentSearchCircle.setOptions({radius: getRadiusInMeters(5)});
            map.setOptions({zoom: 12, center: currentSearchMarker.position});
            break;
          case '10':
            currentSearchCircle.setOptions({radius: getRadiusInMeters(10)});
            map.setOptions({zoom: 11, center: currentSearchMarker.position});
            break;
          case '25':
            currentSearchCircle.setOptions({radius: getRadiusInMeters(25)});
            map.setOptions({zoom: 10, center: currentSearchMarker.position});
            break;
          default:
            break;
        }
      }

      function getRadiusInMeters(miles) {
        return (1609.34 * miles) / 2;
      }
    };

    // attach listeners to search fields
    mapFilterFieldsUI.region.addEventListener('change', updateMap);
    mapFilterFieldsUI.type.addEventListener('change', updateMap);
    mapFilterFieldsUI.distance.addEventListener('change', updateMapRadius);

    document.getElementsByClassName('jh-locations__search-reset')[0].addEventListener('click', function(e) {
      e.preventDefault();
      if (currentSearchMarker) {
        currentSearchCircle.setMap(null);
        currentSearchMarker.setMap(null);
      }
      map.setOptions({center: locationsMap.defaultMapSettings.center, zoom: locationsMap.defaultMapSettings.zoom });
      clearMarkers();
      setMapOnAll(map);

      mapFilterFieldsUI.address.value = '';
      mapFilterFieldsUI.region.selectedIndex = 0;
      mapFilterFieldsUI.type.selectedIndex = 0;
      mapFilterFieldsUI.distance.selectedIndex = 0;
      document.getElementsByClassName('jh-search-locations__distance-wrapper')[0].style.display = "none";
    });

    // sets the map on all markers in the array
    function setMapOnAll(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    }

    // removes the markers from the map
    function clearMarkers() {
      setMapOnAll(null);
    }

    var autocomplete;

    function initAutocomplete() {
      // Create the autocomplete object, restricting the search to geographical
      // location types.
      autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {
        types: ['geocode','establishment']
      });

      // When the user selects an address from the dropdown, populate the address
      // fields in the form.
      autocomplete.addListener('place_changed', fillInAddress);
    }

    var geocoder = new google.maps.Geocoder();

    var currentSearchMarker;
    var currentSearchCircle;

    function fillInAddress() {
      // Get the place details from the autocomplete object.
      var place = autocomplete.getPlace();
      geocoder.geocode({'address': place.name}, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
            if (currentSearchMarker) {
              currentSearchMarker.setMap(null);
            }
            currentSearchMarker = new google.maps.Marker({
              position: results[0].geometry.location,
              map: map,
              //animation: google.maps.Animation.DROP,
              optimized: false,
              zIndex:-99999999,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
                strokeColor: '#569bca'
              }
            });
            // currentSearchMarker.setAnimation(google.maps.Animation.BOUNCE);
            map.setOptions({
              center: results[0].geometry.location,
              zoom: 12
            });
            if (currentSearchCircle) {
              currentSearchCircle.setMap(null);
            }
            currentSearchCircle = new google.maps.Circle({
              strokeColor: '#569bca',
              strokeOpacity: 0.7,
              strokeWeight: 1,
              fillColor: '#569bca',
              fillOpacity: 0.1,
              map: map,
              center: results[0].geometry.location,
              radius: 1609.34
            });
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      });
      // show distance filter option only if location/address field is not empty
      if (mapFilterFieldsUI.address.value === '') {
        document.getElementsByClassName('jh-search-locations__distance-wrapper')[0].style.display = "none";
        currentSearchMarker.setMap(null);
        currentSearchCircle.setMap(null);
      } else {
        document.getElementsByClassName('jh-search-locations__distance-wrapper')[0].style.display = "inline-block";
      }
    }
    initAutocomplete();
  }

  // view elements
  var mapComponentElement = document.getElementsByClassName('jh-locations__map')[0];

  // UI components
  var locationsMap = new LocationsMap(document.getElementById('map'));
  var locationsData = new LocationsData(mapComponentElement.getAttribute('data-source'));
  locationsData.data = dataObj;
  var mapInfoWindow = new MapInfoWindow(mapComponentElement);
  var mapMarkers = new MapMarkers(locationsMap.map, locationsData.data);
  mapMarkers.setClickHandler(mapInfoWindow);

  var locationsMenu = {};
  var locationsMenuElement = document.getElementsByClassName('jh-locations-menu')[0];
  if (locationsMenuElement) {
    locationsMenu = new LocationsAccordionMenu(locationsData.data, locationsMenuElement);
  }

  var mapMarkerFilters = {};
  var mapMarkerFiltersElement = document.getElementsByClassName('jh-locations__search')[0];
  if (mapMarkerFiltersElement) {
    mapMarkerFilters = new MapMarkerFilters(locationsMap, mapMarkers.markers);
  }
} // end initLocationsApp
