Notifications = new Mongo.Collection('notifications');

Notifications.allow({
  update: function(userId, doc, fieldNames) {
    return ownsNotification(userId, doc) &&
      fieldNames.length === 1 && fieldNames[0] === 'read';
  }
});

createCommentNotification = function(comment) {
  var location = Locations.findOne(comment.locationId);
  if (comment.createdBy.userId !== location.createdBy.userId) {
    Notifications.insert({
      userId: location.createdBy.userId,
      locationId: location._id,
      commentId: comment._id,
      commenterName: comment.createdBy.author,
      read: false
    });
  }
};
