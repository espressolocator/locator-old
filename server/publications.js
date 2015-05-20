Meteor.publish('locations', function() {
  return Locations.find();
});

Meteor.publish('comments', function(locationId) {
  check(locationId, String);
  return Comments.find({locationId: locationId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});
