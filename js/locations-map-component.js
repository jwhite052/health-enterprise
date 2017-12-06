function initLocationsApp() {

  "use strict";
  var mapComponentElement = document.getElementsByClassName('jh-locations__map')[0];

  var map = initMap(document.getElementById('map'));
  var data = initData();
  var markers = initMarkers(map, data.hospitals);
  var infowindow = initInfoWindow(mapComponentElement);

  // event handlers
  initMarkerEventHandlers(map, markers);

  function initMarkerEventHandlers(map, markers) {
    // event listeners
    for (var i = 0; i < markers.length; i++) {
      markers[i].addListener('click', clickHandler);
    }

    function clickHandler() {
      this.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){
        this.setAnimation(null);
      }.bind(this), 1400);
      this.setZIndex(10000);

      // updateInfoWindow(this.location);
      // showInfoWindow();
      map.setOptions({
        center: { lat: this.getPosition().lat(), lng: this.getPosition().lng() },
        zoom: 10
      });
    }
  }

  // var infowindows = initInfoWindows(markers);

  // initMarkers(map);
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
* Initialize Map
*/
function initMap(mapElement) {

  "use strict";

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
* Initialize Markers
*/
function initMarkers(map, data) {

  "use strict";

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

    // marker.addListener('click', function() {
    //   var _self = this;
    //   this.setAnimation(google.maps.Animation.BOUNCE);
    //   setTimeout(function(){
    //     _self.setAnimation(null);
    //   }, 1400);
    //   this.setZIndex(10000);
    //
    //   updateInfoWindow(this.location);
    //   showInfoWindow();
    //
    //   // map
    //   var zoomProp = 10; // default
    //   if (currentSelectedMarker !== this) {
    //       if (map.getZoom() !== 10) {
    //         zoomProp = map.getZoom();
    //       }
    //   } else {
    //     if (map.getZoom() === 10) {
    //       zoomProp = 15;
    //     } else {
    //       zoomProp = 10;
    //     }
    //   }
    //   currentSelectedMarker = this;
    //   map.setOptions({
    //     center: {lat: this.getPosition().lat(), lng: this.getPosition().lng()},
    //     zoom: zoomProp
    //   });
    // });
    // store marker
    markers.push(marker);
  }

  return markers;
}

/*
* Initialize Info Window
*/
// function initInfoWindow(markers) {
//
//   var infowindow;
//
//   infowindow.wrapper = document.createElement('DIV');
//   infowindow.wrapper.classList.add('jh-locations-info-window__wrapper', 'locations-info-window__wrapper--default', 'is-hidden');
//
//   infowindow.titlebar = document.createElement('DIV');
//   infowindow.titlebar.classList.add('jh-locations-info-window__title-bar');
//
//   infowindow.titlebarname = document.createElement('DIV');
//   infowindow.titlebarname.classList.add('jh-locations-info-window__title-bar-name');
//
//   infowindow.close = document.createElement('DIV');
//   infowindow.close.classList.add('jh-locations-info-window__close');
//
//   infowindow.window = document.createElement('DIV');
//   infowindow.window.classList.add('jh-locations-info-window');
//
//   infowindow.windowbottom = document.createElement('DIV');
//   infowindow.windowbottom.classList.add('jh-locations-info-window__bottom');
//
//   var infowindowElement;
//   infowindowElement = infowindow.wrapper;
//   infowindowElement.titlebar = infowindow.titlebar;
//   infowindowElement.titlebar.appendChild(infowindow.titlebarname);
//   infowindowElement.titlebar.appendChild(infowindow.close);
//   infowindowElement.appendChild(infowindow.window);
//   infowindowElement.appendChild(infowindow.bottom);
//
//   // init info window
//   document.getElementsByClassName('jh-locations__map')[0].appendChild();
//
//   // initalize window element UI
//   var content = '<h3 class="jh-locations-info-window__title">' + data.name + '</h3>' +
//   '<p class="jh-locations-info-window__address">' + data.address + '<br />' +
//   '<a class="jh-locations-info-window__directionslink" href="' + encodeURI('https://www.google.com/maps/place/' + data.address.replace(/<br>/g,' ')) + '" target="_blank">Get Directions</a></p>';
//   if (data.phone) { content += '<p class="jh-locations-info-window__phone">' + data.phone + '</p>'; }
//   if (data.hours) { content += '<p class="jh-locations-info-window__hours">' + data.hours + '</p>'; }
//
// }

function initInfoWindows(map, markers, element) {
  var windowElement = initInfoWindow(element);
  // element.appendChild(windowElement);

  return windowElement;
}

function initInfoWindow(element) {

  var infowindow = {
    wrapper: '',
    titlebar: '',
    titlebarname: '',
    close: '',
    content: '',
    windowbottom: ''
  };

  infowindow.wrapper = document.createElement('DIV');
  infowindow.wrapper.classList.add('jh-locations-info-window__wrapper', 'locations-info-window__wrapper--default', 'is-visible');

  infowindow.titlebar = document.createElement('DIV');
  infowindow.titlebar.classList.add('jh-locations-info-window__title-bar');

  infowindow.titlebarname = document.createElement('DIV');
  infowindow.titlebarname.classList.add('jh-locations-info-window__title-bar-name');
  infowindow.titlebar.appendChild(infowindow.titlebarname);

  infowindow.close = document.createElement('DIV');
  infowindow.close.classList.add('jh-locations-info-window__close');
  infowindow.titlebar.appendChild(infowindow.close);

  infowindow.content = document.createElement('DIV');
  infowindow.content.classList.add('jh-locations-info-window');

  infowindow.windowbottom = document.createElement('DIV');
  infowindow.windowbottom.classList.add('jh-locations-info-window__bottom');

  var infowindowElement;

  infowindowElement = infowindow.wrapper;
  infowindowElement.appendChild(infowindow.titlebar);
  infowindowElement.appendChild(infowindow.content);
  infowindowElement.appendChild(infowindow.windowbottom);

  element.appendChild(infowindowElement);

  // event listeners
  var infowindowElementCloseBtn = infowindowElement.getElementsByClassName('jh-locations-info-window__close')[0];
  infowindowElementCloseBtn.addEventListener('click', function() {
    hideInfoWindow(infowindowElement);
  });

  function showInfoWindow(el) {
    if (!el.classList.contains('is-visible')) {
      el.classList.toggle('is-visible');
      el.classList.toggle('is-hidden');
    }
  }

  function hideInfoWindow(el) {
    if (!el.classList.contains('is-hidden')) {
      el.classList.toggle('is-visible');
      el.classList.toggle('is-hidden');
    }
  }

  return infowindowElement;
}
