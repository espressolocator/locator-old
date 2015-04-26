AutoForm.hooks({
  insertCommentForm: {
    before: {
      insert: function(comment) {
        var user = Meteor.user();
        var location = Locations.findOne(comment.locationId);
        if (!location) {
            throw new Meteor.Error('invalid-comment', 'You must comment on a location');
        }
        comment = _.extend(comment, {
            createdBy: {
            userId: user._id,
            author: user.username
            }
        });
        // update the post with the number of comments
        Locations.update(comment.locationId, {$inc: {commentsCount: 1}});
        console.log(comment);
        return comment;
      },
    },
  }
});
