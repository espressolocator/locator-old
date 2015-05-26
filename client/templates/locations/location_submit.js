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
    formToDoc: function(doc) {
      var latlng = doc.location.split(',');
      doc.location = { type: "Point", coordinates: [ parseFloat(latlng[1]), parseFloat(latlng[0]) ] };
      return doc;
    },
    onSuccess: function(formType, result) {
      // Reset validation and form prior to redirection.
      this.validationContext.resetValidation();
      this.resetForm();
      Router.go('locationPage', { _id: result._id });
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
  var self = this;
  this.autorun(function (c) {
    if (GoogleMaps.loaded()) {
      var searchNode = self.$("#mapsearch");
      addGeocomplete(searchNode, { details: "#insertLocationForm" });
      c.stop();
    }
  });
});

Template.locationSubmit.onCreated(function() {
  GoogleMaps.load({
    libraries: 'places'
  });
});
