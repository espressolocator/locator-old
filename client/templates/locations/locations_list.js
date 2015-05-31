Template.locationsList.helpers({
  locations: function() {
    return Template.instance().locations();
  }
});

Template.locationsList.onCreated(function() {
  var instance = this;
  instance.autorun(function () {
    // Subscribe to the locations publication.
    var subscription = instance.subscribe('locations', Session.get('mapBounds'));
  });
  // Locations cursor.
  instance.locations = function() {
    return Locations.find({}, {sort: {submitted: -1}});
  }
});
