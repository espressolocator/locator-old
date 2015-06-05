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

  var markers = {};

  var instance = this;

  // Init reactive var.
  instance.mapBoundsCoordinates = new ReactiveVar(null);

  instance.autorun(function () {
    // Subscribe to the locations publication.
    var subscription = instance.subscribe('locations', instance.mapBoundsCoordinates.get());
    if (subscription.ready()) {
      if (instance.locations().count()) {
        var map = instance.$('.search-locations-input').geocomplete("map");
        instance.locations().forEach(function(location) {
          if (!markers[location._id]) {
            var latLng = new google.maps.LatLng(location.location.coordinates[1], location.location.coordinates[0]);
            var marker = new google.maps.Marker({
              position: latLng,
              map: map,
              title: 'Hello World!',
              id: location._id
            });
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
