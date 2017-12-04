function initMap() {

  "use strict";

  // cache section container element
  var sectionUI = document.getElementsByClassName('locations-section')[0];

  // cache section components
  var componentsUI = {
    menu: sectionUI.getElementsByClassName('locations-menu')[0],
    infoWindow: sectionUI.getElementsByClassName('locations-info-window__wrapper')[0],
    infoWindowContent: sectionUI.getElementsByClassName('locations-info-window')[0],
    infowindow: {
      element: sectionUI.getElementsByClassName('locations-info-window__wrapper')[0],
      titlebar: sectionUI.getElementsByClassName('locations-info-window__title-bar')[0],
      titlebarname: sectionUI.getElementsByClassName('locations-info-window__title-bar-name')[0]
    }
  };

  // locations data
  var locationsListObj = (function() {
    var json = null;
    $.ajax({
      'async': false,
      'global': false,
      'url': "/locationsdata.json",
      'dataType': "json",
      'success': function (data) {
        json = data;
      }
    });
    return json;
  })();

  function initLocationsDataList(data) {
    var list = {
      hospitals: [],
      outpatient: [],
      urgentcare: []
    };
    for (var key in data) {
      var obj = data[key];
      for (var i = 0; i < obj.length; i++) {
        if (obj[i].type.toLowerCase() === 'hospital') {
          list.hospitals.push(obj[i]);
        } else if (obj[i].type.toLowerCase() === 'outpatient') {
          list.outpatient.push(obj[i]);
        } else if (obj[i].type.toLowerCase() === 'urgent') {
          list.urgentcare.push(obj[i]);
        }
      }
    }
    return list;
  }
  var locationsDataList = initLocationsDataList(locationsListObj);

  /*
  * Locations Menu UI
  */

  function LocationsMenuUI(documentElement) {
    this.ui = {
        menu: documentElement.getElementsByClassName('locations-menu')[0],
        tabs: documentElement.querySelectorAll('.locations-menu__panel > .locations-menu__tab')
    };
  }
  // return UI elements
  LocationsMenuUI.prototype.getUI = function() {
    return this.ui;
  };
  // toggle accessibility
  LocationsMenuUI.prototype.setAria = function(element1, element2, expanded) {
    if (expanded) {
      element1.setAttribute('aria-expanded', 'true');
      element2.setAttribute('aria-hidden', 'false');
    } else {
      element1.setAttribute('aria-expanded', 'false');
      element2.setAttribute('aria-hidden', 'true');
    }
  };
  // toggle menu collapse state
  LocationsMenuUI.prototype.toggleMenu = function(element) {
    var _self = this;

    var thisMenuTab = element;
    var thisMenuContent = element.nextElementSibling;
    if (thisMenuTab.classList.contains('is-collapsed')) {
      _self.setAria(thisMenuTab, thisMenuContent, true);
    } else {
      _self.setAria(thisMenuTab, thisMenuContent, false);
    }
    thisMenuContent.classList.toggle('is-collapsed');
    thisMenuContent.classList.toggle('is-expanded');
    thisMenuTab.classList.toggle('is-collapsed');
    thisMenuTab.classList.toggle('is-expanded');
  };
  // expand menu
  LocationsMenuUI.prototype.expandMenu = function(event) {
    var _self = this;

    event.preventDefault();
    var thisMenuTab = event.target.parentNode;

    if (!thisMenuTab.classList.contains('is-expanded')) {
      // collapse expanded menu
      _self.toggleMenu(sectionUI.querySelectorAll('.locations-menu__tab.is-expanded')[0]);
      _self.toggleMenu(thisMenuTab);
    }
  };

  // initalize new locations menu UI
  var locationsMenuUI = new LocationsMenuUI(sectionUI);

  // attach listener to each menu tab, bind handler to locations menu object
  for (var i = 0; i < locationsMenuUI.getUI().tabs.length; i++) {
     locationsMenuUI.getUI().tabs[i].addEventListener('click', locationsMenuUI.expandMenu.bind(locationsMenuUI), false);
  }

  /*
  * Google Map Settings
  */

  // initial map settings
  var mapDefaults = {
    center: {lat: 40.0556365, lng: -75.1},
    zoom: 9
  };

  // initalize map
  var map = new google.maps.Map(document.getElementById('map'), {
    center: mapDefaults.center,
    zoom: mapDefaults.zoom,
    minZoom: 9,
    maxZoom: 16,
    mapTypeControl: false,
    streetViewControl: false,
    clickableIcons: false,
    styles:  [{'featureType':'administrative','elementType':'labels.text.fill','stylers':[{'color':'#152456'}]},{'featureType':'administrative.neighborhood','elementType':'labels.text.fill','stylers':[{'color':'#569bca'}]},{'featureType':'landscape','elementType':'all','stylers':[{'color':'#f2f4f8'}]},{'featureType':'landscape','elementType':'geometry.fill','stylers':[{'color':'#ffffff'}]},{'featureType':'poi','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'poi.park','elementType':'geometry.fill','stylers':[{'color':'#e6f3d6'},{'visibility':'on'}]},{'featureType':'road','elementType':'all','stylers':[{'saturation':-30},{'lightness':45},{'visibility':'simplified'}]},{'featureType':'road','elementType':'geometry.fill','stylers':[{'color':'#f2f4f8'}]},{'featureType':'road.highway','elementType':'all','stylers':[{'visibility':'simplified'}]},{'featureType':'road.highway','elementType':'geometry.fill','stylers':[{'color':'#cccccc'},{'visibility':'simplified'}]},{'featureType':'road.highway','elementType':'labels.text','stylers':[{'color':'#333333'}]},{'featureType':'road.arterial','elementType':'geometry.fill','stylers':[{'color':'#f4f4f4'}]},{'featureType':'road.arterial','elementType':'labels.text.fill','stylers':[{'color':'#787878'}]},{'featureType':'road.arterial','elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'all','stylers':[{'color':'#eaf6f8'},{'visibility':'on'}]},{'featureType':'water','elementType':'geometry.fill','stylers':[{'color':'#addbf9'}]}]
  });

  // array to store map markers
  var markers = [];
  var currentSelectedMarker;

  // create marker instances
  var initMarkers = function(list, map) {

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

      marker.addListener('click', function() {
        var _self = this;
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){
          _self.setAnimation(null);
        }, 1400);
        this.setZIndex(10000);

        updateInfoWindow(this.location);
        showInfoWindow();

        // map
        var zoomProp = 10; // default
        if (currentSelectedMarker !== this) {
            if (map.getZoom() !== 10) {
              zoomProp = map.getZoom();
            }
        } else {
          if (map.getZoom() === 10) {
            zoomProp = 15;
          } else {
            zoomProp = 10;
          }
        }
        currentSelectedMarker = this;
        map.setOptions({
          center: {lat: this.getPosition().lat(), lng: this.getPosition().lng()},
          zoom: zoomProp
        });
      });
      // store marker
      markers.push(marker);
    }
  };

  function updateInfoWindow(data) {
    // info window types
    var infowindowtitle = '';
    var infowindowclass = '--default';
    if (data.type === 'hospital') {
      infowindowtitle = 'Hospitals';
      infowindowclass = '--hospitals';
    } else if (data.type === 'outpatient') {
      infowindowtitle = 'Outpatient';
      infowindowclass = '--outpatient';
    } else if (data.type === 'urgent') {
      infowindowtitle = 'Urgent Care';
      infowindowclass = '--urgentcare';
    }
    componentsUI.infowindow.titlebarname.innerHTML = infowindowtitle;
    console.log(componentsUI.infowindow.element.className);
    // remove existing window type class names
    componentsUI.infowindow.element.className = componentsUI.infowindow.element.className.replace(/locations-info-window__wrapper--[a-zA-z]*/g, ' ');
    // add current window type class name
    componentsUI.infowindow.element.classList.add('locations-info-window__wrapper' + infowindowclass);

    // initalize window element UI
    var content = '<h3 class="locations-info-window__title">' + data.name + '</h3>' +
    '<p class="locations-info-window__address">' + data.address + '<br />' +
    '<a class="locations-info-window__directionslink" href="' + encodeURI('https://www.google.com/maps/place/' + data.address.replace(/<br>/g,' ')) + '" target="_blank">Get Directions</a></p>';
    if (data.phone) { content += '<p class="locations-info-window__phone">' + data.phone + '</p>'; }
    if (data.hours) { content += '<p class="locations-info-window__hours">' + data.hours + '</p>'; }

    // update view - info window content
    componentsUI.infoWindowContent.innerHTML = content;
    // update view - view more details button link
    document.getElementsByClassName('locations-info-window__bottom')[0].innerHTML =
    '<div class="locations-info-window__locationlink"><a href="' + data.url + '">View More Details</a></div>';
  }
  function showInfoWindow() {
    var el = componentsUI.infoWindow.classList;
    if (!el.contains('is-visible')) {
      el.toggle('is-visible');
      el.toggle('is-hidden');
    }
  }
  function hideInfoWindow() {
    var el = componentsUI.infoWindow.classList;
    if (!el.contains('is-hidden')) {
      el.toggle('is-visible');
      el.toggle('is-hidden');
    }
  }

  componentsUI.infoWindow.getElementsByClassName('locations-info-window__close')[0].addEventListener('click', function() {
    hideInfoWindow();
  });

  // create markers for each list of locations data
  initMarkers(locationsDataList.hospitals, map);
  initMarkers(locationsDataList.outpatient, map);
  initMarkers(locationsDataList.urgentcare, map);

  /*
  * Locations Menu
  */

  // cache menu list elements
  var menuUI = {
    'hospitals': componentsUI.menu.querySelectorAll('.hospitals-menu .locations-menu__list')[0],
    'outpatient': componentsUI.menu.querySelectorAll('.outpatient-menu .locations-menu__list')[0],
    'urgentcare': componentsUI.menu.querySelectorAll('.urgentcare-menu .locations-menu__list')[0]
  };

  // populate menu lists with locations
  var setMenuMarkersUI = function(data, ui) {
    for (var i = 0; i < data.length; i++) {
      // closure used to bind the current scope values to the event handler callback
      (function() {
        var li = document.createElement('LI');
        var link = document.createElement('A');
        link.setAttribute('href', data[i].url);
        link.innerHTML = data[i].name;
        var dataMarker = data[i].marker;
        link.addEventListener('click', function(e) {
          e.preventDefault();
          console.log(dataMarker);
          // dataMarker.click();
          dataMarker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){
            dataMarker.setAnimation(null);
          }, 1400);
          dataMarker.setZIndex(10000);
          map.setOptions({
            center: {lat: dataMarker.getPosition().lat(), lng: dataMarker.getPosition().lng()}
            // zoom: zoomProp
          });
          updateInfoWindow(dataMarker.location);
          showInfoWindow();
        });
        li.appendChild(link);

        // var options = document.createElement('DIV');
        // options.classList += 'link-options';
        // options.innerHTML = 'LINKS' + i;

        // // hover event listeners
        // li.addEventListener('mouseenter', function() {
        //   var options = this.getElementsByClassName('link-options')[0];
        //   if (!options.classList.contains('is-visible')) {
        //     options.classList.toggle('is-visible');
        //   }
        //   console.log('entered!');
        // });
        // li.addEventListener('mouseleave', function() {
        //   var options = this.getElementsByClassName('link-options')[0];
        //   if (options.classList.contains('is-visible')) {
        //     options.classList.toggle('is-visible');
        //   }
        //   console.log('leave!');
        // });
        // li.appendChild(options);
        ui.appendChild(li);
      }());
    }
  };
  setMenuMarkersUI(locationsDataList.hospitals, menuUI.hospitals);
  setMenuMarkersUI(locationsDataList.outpatient, menuUI.outpatient);
  setMenuMarkersUI(locationsDataList.urgentcare, menuUI.urgentcare);

  // reset map button
  sectionUI.getElementsByClassName('locations__search-reset')[0].addEventListener('click', function(e) {
    e.preventDefault();
    map.setOptions({center: mapDefaults.center, zoom: mapDefaults.zoom });
    clearMarkers();
    setMapOnAll(map);
    hideInfoWindow();
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

  /*
  * Locations Map Filters
  */

  var mapFilterFieldsUI = {
    'address': document.getElementsByClassName('search-locations__address')[0],
    'distance': document.getElementsByClassName('search-locations__distance')[0],
    'region': document.getElementsByClassName('search-locations__region')[0],
    'type': document.getElementsByClassName('search-locations__type')[0]
  };

  var currentMarkers = markers;

  var updateMap = function() {
    var region = document.getElementsByClassName('search-locations__region')[0].value;
    var type = document.getElementsByClassName('search-locations__type')[0].value;
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
    var distance = document.getElementsByClassName('search-locations__distance')[0].value;
    var address = document.getElementsByClassName('search-locations__address')[0].value;

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

  document.getElementsByClassName('locations__search-reset')[0].addEventListener('click', function(e) {
    e.preventDefault();
    if (currentSearchMarker) {
      currentSearchCircle.setMap(null);
      currentSearchMarker.setMap(null);
    }
    map.setOptions({center: mapDefaults.center, zoom: mapDefaults.zoom });
    clearMarkers();
    setMapOnAll(map);

    mapFilterFieldsUI.address.value = '';
    mapFilterFieldsUI.region.selectedIndex = 0;
    mapFilterFieldsUI.type.selectedIndex = 0;
    mapFilterFieldsUI.distance.selectedIndex = 0;
    document.getElementsByClassName('search-locations__distance-wrapper')[0].style.display = "none";
  });

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
      document.getElementsByClassName('search-locations__distance-wrapper')[0].style.display = "none";
      currentSearchMarker.setMap(null);
      currentSearchCircle.setMap(null);
    } else {
      document.getElementsByClassName('search-locations__distance-wrapper')[0].style.display = "inline-block";
    }
  }

  initAutocomplete();

} // end initMap()
