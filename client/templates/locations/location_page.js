Template.locationPage.helpers({
  comments: function() {
    return Comments.find({locationId: this._id});
  }
});

Template.locationPage.onRendered(function() {
  var self = this;
  this.autorun(function(c) {
    if (GoogleMaps.loaded()) {
      var canvas = self.$('.map-container-view').get(0);
      var markerLatLng = new google.maps.LatLng(self.data.location.coordinates[1], self.data.location.coordinates[0]);
      var mapOptions = {
        zoom: 17,
        center: markerLatLng,
        draggable: false,
        zoomControl: false,
        disableDoubleClickZoom: true,
        scrollwheel: false,
        disableDefaultUI: true
      };
      // Create map object.
      var map = new google.maps.Map(canvas, mapOptions);
      // Create marker.
      var marker = new google.maps.Marker({
        position: markerLatLng,
        map: map,
        title: self.data.location.title,
        icon: 'logo-icon-marker.png',
        id: self.data.location._id
      });
      c.stop();
    }
  });
});

Template.locationPage.onCreated(function() {
  // Init Googlemaps.
  GoogleMaps.load({
    libraries: 'places'
  });
});
