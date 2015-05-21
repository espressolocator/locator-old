Template.locationsList.helpers({
  locations: function() {
    return Locations.find({}, {sort: {submitted: -1}});
  }
});

Template.locationsList.onRendered(function() {
  var self = this;
  this.autorun(function(c) {
    if (GoogleMaps.loaded()) {
      var canvas = self.$('.map-container').get(0);
      var mapOptions = {
        zoom: 12,
        scrollwheel: true,
        streetViewControl: false
      };
      // Create map object.
      var map = new google.maps.Map(canvas, mapOptions);
      // Center to current location.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          map.setCenter(currentLocation);
        });
      }
      // Also create GoogleMaps object for convenience.
      GoogleMaps._create('locationsMap', {
        type: 'Map',
        instance: map,
        options: mapOptions
      });

      c.stop();
    }
  });
});

Template.locationsList.onCreated(function() {
  GoogleMaps.load({
    libraries: 'places'
  });
});
