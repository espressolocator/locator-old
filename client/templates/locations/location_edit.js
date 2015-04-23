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
    onSuccess: function(formType, result) {
      Router.go('locationPage', {_id: this.docId});
    },
  }
});
