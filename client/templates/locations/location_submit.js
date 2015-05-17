AutoForm.hooks({
  insertLocationForm: {
    before: {
      method: function(doc) {
        // Remove sticky validation errors if any.
        if (this.validationContext.keyIsInvalid('url')) {
          this.removeStickyValidationError('url');
        }
        return doc;
      }
    },
    onSuccess: function(formType, result) {
      // Reset validation and form prior to redirection.
      this.validationContext.resetValidation();
      this.resetForm();
      Router.go('locationPage', {_id: result._id});
    },
    onError: function(formType, error) {
      // Process non-unique filed error, add sticky error.
      if (error.error === 'urlnotunique') {
        this.addStickyValidationError('url', 'notUnique');
        AutoForm.validateField(this.formId, 'url');
      }
    }
  }
});

Template.locationSubmit.onRendered(function() {
  var searchNode = $("#mapsearch");
  this.autorun(function (c) {
    if (GoogleMaps.loaded()) {
      // Initialise geocomplete.
      searchNode.geocomplete({
        map: ".map-container",
        details: "#insertLocationForm",
        detailsAttribute: "data-geo",
        mapOptions: {
          zoom: 15,
          scrollwheel: true,
          streetViewControl: false
        },
        markerOptions: {
          draggable: true
        }
      });

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

      c.stop();
    }
  });
});

Template.locationSubmit.onCreated(function() {
  GoogleMaps.load({
    libraries: 'places'
  });
});
