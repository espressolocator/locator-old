Meteor.publish('comments', function(locationId) {
  check(locationId, String);
  return Comments.find({locationId: locationId}, {sort: {createdAt: -1}});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});
