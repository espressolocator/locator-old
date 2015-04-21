Locations = new Mongo.Collection('locations');

Schemas = {};
Schemas.Location = new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 200
  },
  description: {
    type: String,
    label: "Decription",
    max: 200
  },
  url: {
    type: String,
    label: "URL",
    regEx: SimpleSchema.RegEx.Url,
    index: true,
    unique: true
  },
  commentsCount: {
    type: Number,
    autoValue: function() {
      if (this.isInsert) {
        return 0;
      } else if (this.isUpsert) {
        return {$setOnInsert: 0};
      } else {
        this.unset();
      }
    },
    denyUpdate: true,
    autoform: {
      omit: true
    }
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    },
    denyUpdate: true,
    autoform: {
      omit: true
    }
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true,
    autoform: {
      omit: true
    }
  },
  createdBy: {
    type: Object,
    autoform: {
      omit: true
    },
    denyUpdate: true
  },
  "createdBy.userId": {
    type: String,
    autoValue: function() {
      if (this.isInsert) {
        return Meteor.user()._id;
      } else if (this.isUpsert) {
        return {$setOnInsert: Meteor.user()._id};
      } else {
        this.unset();
      }
    }
  },
  "createdBy.username": {
    type: String,
    autoValue: function() {
      if (this.isInsert) {
        return Meteor.user().username;
      } else if (this.isUpsert) {
        return {$setOnInsert: Meteor.user().username};
      } else {
        this.unset();
      }
    }
  },
  updatedBy: {
    type: Object,
    autoform: {
      omit: true
    },
    optional: true,
    denyInsert: true
  },
  "updatedBy.userId": {
    type: String,
    autoValue: function() {
      if (this.isUpdate) {
        return Meteor.user()._id;
      }
    }
  },
  "updatedBy.username": {
    type: String,
    autoValue: function() {
      if (this.isUpdate) {
        return Meteor.user().username;
      }
    }
  }
});

Locations.attachSchema(Schemas.Location);

Locations.allow({
  update: function(userId, location) { return ownsDocument(userId, location); },
  remove: function(userId, location) { return ownsDocument(userId, location); },
  insert: function(userId, location) { return !! userId; }
});

Locations.deny({
  update: function(userId, location, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title', 'description').length > 0);
  }
});
