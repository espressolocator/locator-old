Template.locationsPage.helpers({
  locations: function() {
    return Template.instance().locations();
  }
});

Template.locationsPage.onRendered(function() {
  var instance = this;
  this.autorun(function(c) {
    if (GoogleMaps.loaded()) {
      var searchLocationInput = instance.$('.search-locations-input');
      var mapProperties = {
        map: instance.$('.map-container'),
        mapOptions: {
          zoom: 12,
          scrollwheel: true,
          streetViewControl: false
        },
        markerOptions: {
          disabled: true
        },
        types: ['(regions)']
      }
      addGeocomplete(searchLocationInput, mapProperties);

      // Use idle state and update search result and markers.
      var map = searchLocationInput.geocomplete("map");
      google.maps.event.addListener(map, 'idle', function() {
        var bounds = map.getBounds();
        if (bounds) {
          var ne = bounds.getNorthEast();
          var sw = bounds.getSouthWest();
          var boundsCoordinates = [
            [ne.lng(), ne.lat()],
            [sw.lng(), ne.lat()],
            [sw.lng(), sw.lat()],
            [ne.lng(), sw.lat()],
            [ne.lng(), ne.lat()]
          ];
          instance.mapBoundsCoordinates.set(boundsCoordinates);
        }
      });
      c.stop();
    }
  });
});

Template.locationsPage.onCreated(function() {
  // Init Googlemaps.
  GoogleMaps.load({
    libraries: 'places'
  });
  // Declare markers array.
  var markers = {};
  // Declare opened infowindow reference.
  var openedInfoWindow = null;

  var instance = this;

  // Init reactive var.
  instance.mapBoundsCoordinates = new ReactiveVar(null);

  instance.autorun(function () {
    // Subscribe to the locations publication.
    var subscription = instance.subscribe('locations', instance.mapBoundsCoordinates.get());
    if (subscription.ready()) {
      // If at least one location avialable, add marker.
      if (instance.locations().count()) {
        var map = instance.$('.search-locations-input').geocomplete("map");
        // Iterate through found locations.
        instance.locations().forEach(function(location) {
          // See if we already have marker on the map.
          if (!markers[location._id]) {
            var latLng = new google.maps.LatLng(location.location.coordinates[1], location.location.coordinates[0]);
            // Create marker.
            var marker = new google.maps.Marker({
              position: latLng,
              map: map,
              title: location.title,
              icon: 'logo-icon-marker.png',
              id: location._id
            });
            // Create infowindow.
            var infoWindow = new google.maps.InfoWindow({
              content: '<div>'+location.title+'</div>'
            });
            // Add event to show infowindow.
            google.maps.event.addListener(marker, 'click', function() {
              // Close infowindow that was open previously.
              if (openedInfoWindow) {
                openedInfoWindow.close();
              }
              // Open the one user clicked on and store its reference in
              // variable, so we can close it later.
              infoWindow.open(map, marker);
              openedInfoWindow = infoWindow;
            });
            // Add marker to markers array, so we do not recreate it in future.
            markers[location._id] = marker;
          }
        });
      }
    }
  });
  // Locations cursor.
  instance.locations = function() {
    return Locations.find({}, {sort: {submitted: -1}});
  }
});
