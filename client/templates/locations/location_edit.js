Template.locationEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentLocationId = this._id;

    var locationProperties = {
      url: $(e.target).find('[name=url]').val(),
      description: $(e.target).find('[name=description]').val(),
      title: $(e.target).find('[name=title]').val()
    }

    Locations.update(currentLocationId, {$set: locationProperties}, function(error) {
      if (error) {
        // display the error to the user
        alert(error.reason);
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
