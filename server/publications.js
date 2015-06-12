Meteor.publish('locations', function(bounds) {
  if (Match.test(bounds, null)) {
      check(bounds, null);
      return [];
  }
  check(bounds, [[Number]]);
  var polygon = {
    type: "Polygon",
    coordinates: [bounds]
  };
  return Locations.find({location: {$geoWithin: {$geometry: polygon}}}, {sort: {submitted: -1}});
});

Meteor.publish('location', function(locationId) {
  check(locationId, String);
  return Locations.find({_id: locationId}, {sort: {submitted: -1}});
});

Meteor.publish('comments', function(locationId) {
  check(locationId, String);
  return Comments.find({locationId: locationId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});
