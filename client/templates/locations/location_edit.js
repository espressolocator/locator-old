Template.locationEdit.events({
  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this location?")) {
      var currentLocationId = this._id;
      Locations.remove(currentLocationId);
      Router.go('locationsList');
    }
  }
});

AutoForm.hooks({
  editLocationForm: {
    before: {
      "method-update": function(doc) {
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
