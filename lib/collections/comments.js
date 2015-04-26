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
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else {
        this.unset();
      }
    },
    autoform: {
      omit: true
    }
  },
  createdBy: {
    type: Object,
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

// Setup permisions
Comments.allow({
  insert: function(userId, comment) { return !! userId; }
});
