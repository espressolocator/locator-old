Template.locationSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var location = {
      title: $(e.target).find('[name=title]').val(),
      description: $(e.target).find('[name=description]').val(),
      url: $(e.target).find('[name=url]').val()
    };

    var errors = validateLocation(location);
    if (errors.title || errors.url || errors.description)
      return Session.set('locationSubmitErrors', errors);

    Meteor.call('locationInsert', location, function(error, result) {
      // display the error to the user and abort
      if (error)
        return throwError(error.reason);

      // show this result but route anyway
      if (result.locationExists)
        throwError('This link has already been posted.');

      Router.go('locationPage', {_id: result._id});
    });
  }
});

Template.locationSubmit.created = function() {
  Session.set('locationSubmitErrors', {});
}

Template.locationSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('locationSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('locationSubmitErrors')[field] ? 'has-error' : '';
  }
});
