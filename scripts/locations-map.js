function initMap() {

  "use strict";

  // cache UI elements
  var locationsSectionEl = document.getElementsByClassName('locations-section')[0];

  var locationsUI = {
    menu: locationsSectionEl.getElementsByClassName('locations-menu')[0],
    infoWindow: locationsSectionEl.getElementsByClassName('locations-info-window__wrapper')[0],
    infoWindowContent: locationsSectionEl.getElementsByClassName('locations-info-window')[0],
    infowindow: {
      element: locationsSectionEl.getElementsByClassName('locations-info-window__wrapper')[0],
      titlebar: locationsSectionEl.getElementsByClassName('locations-info-window__title-bar')[0],
      titlebarname: locationsSectionEl.getElementsByClassName('locations-info-window__title-bar-name')[0]
    }
  };

  /*
  * Locations Menu UI
  */

  function LocationsMenuUI(documentElement) {
    var ui = {
        menu: documentElement.getElementsByClassName('locations-menu')[0],
        tabs: documentElement.querySelectorAll('.locations-menu__panel > .locations-menu__tab')
    };
    this.getUI = function() {
      return ui;
    };
  }
  LocationsMenuUI.prototype.getUI = function() {
    return this.getUI;
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
      _self.toggleMenu(locationsSectionEl.querySelectorAll('.locations-menu__tab.is-expanded')[0]);
      _self.toggleMenu(thisMenuTab);
    }
  };

  var locationsMenuUI = new LocationsMenuUI(locationsSectionEl);

  // attach listener to each menu tab, bind handler to locations menu object
  for (var i = 0; i < locationsMenuUI.getUI().tabs.length; i++) {
     locationsMenuUI.getUI().tabs[i].addEventListener('click', locationsMenuUI.expandMenu.bind(locationsMenuUI), false);
  }

  /*
  * Google Map Settings
  */

  // initial map settings
  var mapdefaults = {
    center: {lat: 40.0556365, lng: -75.1},
    zoom: 9
  };

  // initalize map
  var map = new google.maps.Map(document.getElementById('map'), {
    center: mapdefaults.center,
    zoom: mapdefaults.zoom,
    minZoom: 9,
    maxZoom: 16,
    mapTypeControl: false,
    streetViewControl: false,
    clickableIcons: false,
    styles:  [{'featureType':'administrative','elementType':'labels.text.fill','stylers':[{'color':'#152456'}]},{'featureType':'administrative.neighborhood','elementType':'labels.text.fill','stylers':[{'color':'#569bca'}]},{'featureType':'landscape','elementType':'all','stylers':[{'color':'#f2f4f8'}]},{'featureType':'landscape','elementType':'geometry.fill','stylers':[{'color':'#ffffff'}]},{'featureType':'poi','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'poi.park','elementType':'geometry.fill','stylers':[{'color':'#e6f3d6'},{'visibility':'on'}]},{'featureType':'road','elementType':'all','stylers':[{'saturation':-30},{'lightness':45},{'visibility':'simplified'}]},{'featureType':'road','elementType':'geometry.fill','stylers':[{'color':'#f2f4f8'}]},{'featureType':'road.highway','elementType':'all','stylers':[{'visibility':'simplified'}]},{'featureType':'road.highway','elementType':'geometry.fill','stylers':[{'color':'#cccccc'},{'visibility':'simplified'}]},{'featureType':'road.highway','elementType':'labels.text','stylers':[{'color':'#333333'}]},{'featureType':'road.arterial','elementType':'geometry.fill','stylers':[{'color':'#f4f4f4'}]},{'featureType':'road.arterial','elementType':'labels.text.fill','stylers':[{'color':'#787878'}]},{'featureType':'road.arterial','elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'all','stylers':[{'color':'#eaf6f8'},{'visibility':'on'}]},{'featureType':'water','elementType':'geometry.fill','stylers':[{'color':'#addbf9'}]}]
  });

  // instantiate map infowindow object
  // var infowindow = new google.maps.InfoWindow({ });

  // function LocationInfoWindow(content) {
  //   this.el = locationSection.getElementsByClassName('locations-info-window')[0];
  // };
  // LocationInfoWindow.prototype.showWindow = function() {
  //   var _self = this;
  //   _self.el.style.display = 'hide';
  // };
  // LocationInfoWindow.prototype.hideWindow = function() {
  //   var _self = this;
  //   _self.el.style.display = 'none';
  // };
  // LocationInfoWindow.prototype.setContent = function() {
  //   var _self = this;
  //   _self.el.style.display = 'none';
  // };
  //
  //
  // var locationInfoWindow = new LocationInfoWindow(content);

  // array to store map markers
  var markers = [];
  var currentSelectedMarker;

  // create markers
  var initMarkers = function(list) {
    for (var i = 0; i < list.length; i++) {
      // store new marker in list
      var markericon = '/images/blue-marker-icon.png';
      if (list[i].type === 'hospitals') {
        markericon = '/images/blue-marker-icon.png';
      } else if (list[i].type === 'outpatient') {
        markericon = '/images/purple-marker-icon.png';
      } else if (list[i].type === 'urgent') {
        markericon = '/images/orange-marker-icon.png';
      }
      var marker = new google.maps.Marker({
        position: {lat: list[i].position.lat, lng: list[i].position.lng},
        map: map,
        animation: google.maps.Animation.DROP,
        icon: markericon,
        // custom properties
        location: list[i]
      });
      list[i].marker = marker;
      marker.addListener('click', function() {
        var _self = this;
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){
          _self.setAnimation(null);
        }, 1400);

        // info window
        var infowindowtitle = '';
        var infowindowclass = '--default';
        if (this.location.type === 'hospital') {
          infowindowtitle = 'Hospitals';
          infowindowclass = '--hospitals';
        } else if (this.location.type === 'outpatient') {
          infowindowtitle = 'Outpatient';
          infowindowclass = '--outpatient';
        } else if (this.location.type === 'urgent') {
          infowindowtitle = 'Urgent Care';
          infowindowclass = '--urgentcare';
        }
        locationsUI.infowindow.titlebarname.innerHTML = infowindowtitle;
        // locationsUI.infowindow.element.className.replace(/locations-info-window__wrapper--[a-zA-z]*/g, ' ');
        locationsUI.infowindow.element.classList.remove('locations-info-window__wrapper--hospitals');
        locationsUI.infowindow.element.classList.remove('locations-info-window__wrapper--outpatient');
        locationsUI.infowindow.element.classList.remove('locations-info-window__wrapper--urgentcare');
        locationsUI.infowindow.element.classList.add('locations-info-window__wrapper' + infowindowclass);

        var content = '<h3 class="locations-info-window__title">' + this.location.name + '</h3>' +
        '<p class="locations-info-window__address">' + this.location.address + '<br />' +
        '<a class="locations-info-window__directionslink" href="' + encodeURI('https://www.google.com/maps/place/' + this.location.address.replace(/<br>/g,' ')) + '" target="_blank">Get Directions</a></p>';
        content += this.location.phone ? '<p class="locations-info-window__phone">' + this.location.phone + '</p>' : '';
        content += this.location.hours ? '<p class="locations-info-window__hours">' + this.location.hours + '</p>' : '';
        // content += '<div class="locations-info-window__locationlink"><a href="' + this.location.url + '">View More Details</a></div>';
        locationsUI.infoWindowContent.innerHTML = content;

        document.getElementsByClassName('locations-info-window__bottom')[0].innerHTML = '<div class="locations-info-window__locationlink"><a href="' + this.location.url + '">View More Details</a></div>';

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
        // var lngOffset = -0.005;
        console.log(this.getPosition().lat());
        map.setOptions({
          center: {lat: this.getPosition().lat(), lng: this.getPosition().lng()},
          zoom: zoomProp
        });
      });
      // store marker
      markers.push(marker);
    }
  };

  function showInfoWindow() {
    console.log(locationsUI.infoWindow.classList);
    if (!locationsUI.infoWindow.classList.contains('is-visible')) {
      locationsUI.infoWindow.classList.toggle('is-visible');
      locationsUI.infoWindow.classList.toggle('is-hidden');
    }
  }
  function hideInfoWindow() {
    console.log(locationsUI.infoWindow.classList);
    if (!locationsUI.infoWindow.classList.contains('is-hidden')) {
      locationsUI.infoWindow.classList.toggle('is-visible');
      locationsUI.infoWindow.classList.toggle('is-hidden');
    }
  }

  locationsUI.infoWindow.getElementsByClassName('locations-info-window__close')[0].addEventListener('click', function() {
    hideInfoWindow();
  });
  // add
  // google.maps.event.addListener(infowindow, 'domready', function() {
  //   var iwContent = document.getElementsByClassName('gm-style-iw')[0];
  //   var iwBackground = iwContent.parentNode.childNodes[0];
  //   iwBackground.querySelectorAll(':nth-child(2)')[0].style.background = '#fff';
  //   iwBackground.querySelectorAll(':nth-child(4)')[0].style.display = 'none';
  // });

  // create markers for each list of locations data
  initMarkers(hospitalsList);
  initMarkers(outpatientList);
  initMarkers(urgentcareList);

  // cache menu list elements
  var menuUI = {
    'hospitals': {
      'list': locationsUI.menu.querySelectorAll('.hospitals-menu .locations-menu__list')[0]
    },
    'outpatient': {
      'list': locationsUI.menu.querySelectorAll('.outpatient-menu .locations-menu__list')[0]
    },
    'urgentcare': {
      'list': locationsUI.menu.querySelectorAll('.urgentcare-menu .locations-menu__list')[0]
    }
  };

  /*
  * Locations Menu
  */

  // populate menu lists with locations
  var setMenuMarkersUI = function(data, ui) {
    for (var i = 0; i < data.length; i++) {
      var li = document.createElement('LI');
      li.innerHTML = '<a href="' + data[i].url + '">' + data[i].name + '</a>';
      // li.setAttribute('data-map-id', i);
      ui.appendChild(li);
    }
  };

  setMenuMarkersUI(hospitalsList, menuUI.hospitals.list);
  setMenuMarkersUI(outpatientList, menuUI.outpatient.list);
  setMenuMarkersUI(urgentcareList, menuUI.urgentcare.list);

  // reset map button
  locationsSectionEl.getElementsByClassName('locations__search-reset')[0].addEventListener('click', function(e) {
    e.preventDefault();
    map.setOptions({center: mapdefaults.center, zoom: mapdefaults.zoom });
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

  // mapFilterFieldsUI.address.addEventListener('keyup', function() {
  //   console.log("Test");
  //   console.log(this.value);
  //   if (this.value !== '') {
  //     mapFilterFieldsUI.distance.style.display = "none";
  //   } else {
  //     mapFilterFieldsUI.distance.style.display = "inline-block";
  //   }
  // });

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
    map.setOptions({center: mapdefaults.center, zoom: mapdefaults.zoom });
    clearMarkers();
    setMapOnAll(map);

    mapFilterFieldsUI.address.value = '';
    mapFilterFieldsUI.region.selectedIndex = 0;
    mapFilterFieldsUI.type.selectedIndex = 0;
    mapFilterFieldsUI.distance.selectedIndex = 0;
    document.getElementsByClassName('search-locations__distance-wrapper')[0].style.display = "none";
  });

  // document.getElementsByClassName('locations__search-clear')[0].addEventListener('click', function(e) {
  //   e.preventDefault();
  //   mapFilterFieldsUI.address.value = '';
  //   mapFilterFieldsUI.region.selectedIndex = 0;
  //   mapFilterFieldsUI.type.selectedIndex = 0;
  //   mapFilterFieldsUI.distance.selectedIndex = 0;
  //   document.getElementsByClassName('search-locations__distance-wrapper')[0].style.display = "none";
  // });

  // PLACES

  // Bias the autocomplete object to the user's geographical location,
  // as supplied by the browser's 'navigator.geolocation' object.
  // function geolocate() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(function(position) {
  //       var geolocation = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude
  //       };
  //       var circle = new google.maps.Circle({
  //         center: geolocation,
  //         radius: position.coords.accuracy
  //       });
  //       autocomplete.setBounds(circle.getBounds());
  //     });
  //   }
  // }

  // document.getElementById('autocomplete').addEventListener('onfocus', function() {
  //   console.log("Focus!");
  // });
  var autocomplete;

  function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
        {types: ['geocode','establishment']});

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
    console.log(place);
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
    console.log("Test");
    console.log(mapFilterFieldsUI.address.value);
    if (mapFilterFieldsUI.address.value === '') {
      console.log("Hide");
      document.getElementsByClassName('search-locations__distance-wrapper')[0].style.display = "none";
      currentSearchMarker.setMap(null);
      currentSearchCircle.setMap(null);
    } else {
      console.log("Show");
      document.getElementsByClassName('search-locations__distance-wrapper')[0].style.display = "inline-block";
    }
  }

  initAutocomplete();

} // end initMap()
