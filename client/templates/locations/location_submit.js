Template.locationSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var location = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    Meteor.call('locationInsert', location, function(error, result) {
      // display the error to the user and abort
      if (error)
        return alert(error.reason);

      // show this result but route anyway
      if (result.locationExists)
        alert('This link has already been posted.');

      Router.go('locationPage', {_id: result._id});
    });
  }
});
