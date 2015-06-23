Template.locationEdit.events({
  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this location?")) {
      var currentLocationId = this._id;
      Locations.remove(currentLocationId);
      Router.go('locationsPage');
    }
  }
});

AutoForm.hooks({
  editLocationForm: {
    before: {
      "method-update": function(modifier) {
        // Remove sticky validation errors if any.
        if (this.validationContext.keyIsInvalid('url')) {
          this.removeStickyValidationError('url');
        }
        var latlng = modifier.$set.location.split(',');
        modifier.$set.location = { type: "Point", coordinates: [ parseFloat(latlng[1]), parseFloat(latlng[0]) ] };
        return modifier;
      }
    },
    docToForm: function(doc) {
      var latlng = doc.location.coordinates.reverse();
      doc.location = latlng.join(',');
      return doc;
    },
    formToModifier: function(modifier) {
      // Does not seems work, using "before" hook to amend object.
      return modifier;
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

Template.locationEdit.onRendered(function() {
  var self = this;
  this.autorun(function(c) {
    if (GoogleMaps.loaded()) {
      var searchNode = self.$("#mapsearch");
      var latlng = AutoForm.getFieldValue('location', 'editLocationForm').split(',');
      addGeocomplete(searchNode, {
        details: "#editLocationForm",
        location: new google.maps.LatLng(latlng[0], latlng[1])
      });
      c.stop();
    }
  });
});

Template.locationEdit.onCreated(function() {
  GoogleMaps.load({
    libraries: 'places'
  });
});
