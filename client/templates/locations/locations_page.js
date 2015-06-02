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
          var boundsObject = {ne: {lng: ne.lng(), lat: ne.lat()}, sw: {lng: sw.lng(), lat: sw.lat()}};
          instance.mapBounds.set(boundsObject);
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

  var instance = this;

  // Init reactive var.
  instance.mapBounds = new ReactiveVar({});

  instance.autorun(function () {
    // Subscribe to the locations publication.
    var subscription = instance.subscribe('locations', instance.mapBounds.get());
  });
  // Locations cursor.
  instance.locations = function() {
    return Locations.find({}, {sort: {submitted: -1}});
  }
});
