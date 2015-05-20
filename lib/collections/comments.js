// Define SimpleSchema object
commentSchemaObject = {
  _id: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  locationId: {
    type: String,
  },
  body: {
    type: String,
    label: "Comment on this post",
    max: 2000,
    autoform: {
      rows: 3
    }
  },
  createdAt: {
    type: Date,
    optional: true,
    autoform: {
      omit: true
    }
  },
  createdBy: {
    type: Object,
    optional: true,
    autoform: {
      omit: true
    }
  },
  "createdBy.userId": {
    type: String
  },
  "createdBy.author": {
    type: String
  }
};

// Setup collection
Comments = new Mongo.Collection('comments');
commentSchema = new SimpleSchema(commentSchemaObject);
Comments.attachSchema(commentSchema);

// Comment methods
Meteor.methods({
  commentInsert: function(commentAttributes) {

    var user = Meteor.user();
    var location = Locations.findOne(commentAttributes.locationId);
    if (!location)
      throw new Meteor.Error('invalid-comment', 'You must comment on a location');

    var comment = _.extend(commentAttributes, {
      createdBy: {
        userId: user._id,
        author: user.username
      },
      createdAt: new Date()
    });

    // Validate against schema
    check(comment, commentSchema);

    // Update the post with the number of comments.
    Locations.update(comment.locationId, {$inc: {commentsCount: 1}});

    // create the comment, save the id
    comment._id = Comments.insert(comment);
    // now create a notification, informing the user that  there's been a comment
    createCommentNotification(comment);
    return comment._id;
  }
});
