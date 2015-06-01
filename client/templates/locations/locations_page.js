Template.locationsPage.helpers({
  locations: function() {
    return Template.instance().locations();
  }
});

Template.locationsPage.onRendered(function() {
  var self = this;
  this.autorun(function(c) {
    if (GoogleMaps.loaded()) {
      var searchLocationInput = self.$('.search-locations-input');
      var mapProperties = {
        map: self.$('.map-container'),
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
          Session.set('mapBounds', boundsObject);
        }
      });
      c.stop();
    }
  });
});

Template.locationsPage.onCreated(function() {
  GoogleMaps.load({
    libraries: 'places'
  });

  var instance = this;
  instance.autorun(function () {
    // Subscribe to the locations publication.
    var subscription = instance.subscribe('locations', Session.get('mapBounds'));
  });
  // Locations cursor.
  instance.locations = function() {
    return Locations.find({}, {sort: {submitted: -1}});
  }
});
