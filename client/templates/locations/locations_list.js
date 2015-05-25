Template.locationsList.helpers({
  locations: function() {
    return Locations.find({}, {sort: {submitted: -1}});
  }
});

Template.locationsList.onRendered(function() {
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
      c.stop();
    }
  });
});

Template.locationsList.onCreated(function() {
  GoogleMaps.load({
    libraries: 'places'
  });
});
