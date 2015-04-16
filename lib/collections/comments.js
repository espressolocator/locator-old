Comments = new Mongo.Collection('comments');

Meteor.methods({
  commentInsert: function(commentAttributes) {
    check(this.userId, String);
    check(commentAttributes, {
      locationId: String,
      body: String
    });
    var user = Meteor.user();
    var location = Locations.findOne(commentAttributes.locationId);
    if (!location)
      throw new Meteor.Error('invalid-comment', 'You must comment on a location');
    comment = _.extend(commentAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });
    // update the post with the number of comments
    Locations.update(comment.locationId, {$inc: {commentsCount: 1}});

    return Comments.insert(comment);
  }
});
