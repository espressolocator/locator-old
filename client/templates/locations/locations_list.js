Template.locationsList.helpers({
  locations: function() {
    return Locations.find({}, {sort: {submitted: -1}});
  }
});
