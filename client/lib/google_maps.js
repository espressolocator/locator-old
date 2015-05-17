addGeocomplete = function (searchNode, initProperties) {
  var defaultProperties = {
    map: ".map-container",
    detailsAttribute: "data-geo",
    mapOptions: {
      zoom: 15,
      scrollwheel: true,
      streetViewControl: false
    },
    markerOptions: {
      draggable: true
    }
  };
  // Merge defaults and custom properties, initProperties should provide 'details' parameter at least.
  initProperties = _.extend(defaultProperties, initProperties);

  // Initialise geocomplete.
  searchNode.geocomplete(initProperties);

  // Pick current location from the browser.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var map = searchNode.geocomplete("map");
      map.setCenter(currentLocation);
      var marker = searchNode.geocomplete("marker");
      marker.setPosition(currentLocation);
      searchNode.trigger("geocode:dragged", currentLocation);
    });
  }

  // Bind marker dragging updates.
  searchNode.bind("geocode:dragged", function(event, latLng) {
    $("input[data-geo=lat]").val(latLng.lat());
    $("input[data-geo=lng]").val(latLng.lng());
  });
}
