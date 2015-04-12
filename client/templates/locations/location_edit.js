Template.locationEdit.created = function() {
  Session.set('locationEditErrors', {});
}

Template.locationEdit.helpers({
  errorMessage: function(field) {
    return Session.get('locationEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('locationEditErrors')[field] ? 'has-error' : '';
  }
});

Template.locationEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentLocationId = this._id;

    var locationProperties = {
      url: $(e.target).find('[name=url]').val(),
      description: $(e.target).find('[name=description]').val(),
      title: $(e.target).find('[name=title]').val()
    }

    var errors = validateLocation(locationProperties);
    if (errors.title || errors.url || errors.description)
      return Session.set('locationEditErrors', errors);

    Locations.update(currentLocationId, {$set: locationProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Router.go('locationPage', {_id: currentLocationId});
      }
    });
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this location?")) {
      var currentLocationId = this._id;
      Locations.remove(currentLocationId);
      Router.go('locationsList');
    }
  }
});
