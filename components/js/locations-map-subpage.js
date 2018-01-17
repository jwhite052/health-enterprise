/*
* Callback for Google Maps API
*/
function initLocationsMap() {

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
        var markericon = '/images/blue-marker-icon.png';
        var marker = new google.maps.Marker({
          position: {lat: list[i].position.lat, lng: list[i].position.lng},
          map: map,
          animation: google.maps.Animation.DROP,
          icon: markericon,
          // custom properties
          dataId: i,
          location: list[i]
        });
        // add marker reference to location list data
        list[i].marker = marker;

        this.markers.push(marker);
      }
    }
  }
  MapMarkers.prototype.setClickHandler = function(infoWindow) {
    // set click handler for each marker
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].addListener('click', clickHandler);
      this.markers[i].addListener('mouseover', handlerMouseEnter);
      this.markers[i].addListener('mouseout', handlerMouseLeave);
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
      this.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);

      // info window
      // infoWindow.update(this.location);
      // infoWindow.show();
      var content = '<h5>' + this.location.name + '</h5>';
      content += '<p>' + this.location.address + '</p>';
      content += '<p><a href="' + this.location.url + '" target="_blank">View Location Details</a>';
      infoWindow.setContent(content);
      infoWindow.open(this.map, this);

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
    function handlerMouseEnter() {
      this.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
      this.setIcon('/images/darkblue-marker-icon.png');
    }
    function handlerMouseLeave() {
      this.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
      this.setIcon('/images/blue-marker-icon.png');
    }
  };
  MapMarkers.prototype.setMouseoverHandlerListItems = function() {

    var listItems = document.getElementsByClassName('locations-list__item');
    console.log(listItems);
    // set click handler for each marker
    for (var i = 0; i < listItems.length; i++) {
      listItems[i].addEventListener('mouseenter', eventHandlerOn.bind(this, i));
      listItems[i].addEventListener('mouseleave', eventHandlerOff.bind(this, i));
    }
    function eventHandlerOn(index) {
      this.markers[index].setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
      this.markers[index].setIcon('/images/darkblue-marker-icon.png');
    }
    function eventHandlerOff(index) {
      // this.markers[index].setAnimation(null);
      this.markers[index].setIcon('/images/blue-marker-icon.png');
    }
  };

  // view elements
  var mapComponentElement = document.getElementsByClassName('locations__map')[0];

  // UI components
  var locationsMap = new LocationsMap(document.getElementById('map'));
  var locationsData = new LocationsData(mapComponentElement.getAttribute('data-source'));
  // var mapInfoWindow = new MapInfoWindow(mapComponentElement);
  var mapInfoWindow = new google.maps.InfoWindow();
  var mapMarkers = new MapMarkers(locationsMap.map, locationsData.data);
  mapMarkers.setClickHandler(mapInfoWindow);
  mapMarkers.setMouseoverHandlerListItems();

} // end initLocationsApp
