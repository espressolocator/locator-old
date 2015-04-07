Template.locationSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var location = {
      title: $(e.target).find('[name=title]').val(),
      description: $(e.target).find('[name=description]').val(),
      url: $(e.target).find('[name=url]').val()
    };

    Meteor.call('locationInsert', location, function(error, result) {
      // display the error to the user and abort
      if (error.reason == 'Match failed') {
        alert('One of required fields is empty.');
      } else {
        return alert(error.reason);
      }

      // show this result but route anyway
      if (result.locationExists)
        alert('This link has already been posted.');

      Router.go('locationPage', {_id: result._id});
    });
  }
});
