// Define SimpleSchema object
locationSchemaObject = {
  _id: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
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
    optional: true,
    autoform: {
      omit: true
    }
  },
  createdAt: {
    type: Date,
    optional: true,
    autoform: {
      omit: true
    }
  },
  updatedAt: {
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
    },
  },
  "createdBy.userId": {
    type: String
  },
  "createdBy.author": {
    type: String
  },
  updatedBy: {
    type: Object,
    optional: true,
    autoform: {
      omit: true
    },
  },
  "updatedBy.userId": {
    type: String
  },
  "updatedBy.author": {
    type: String
  }
};

Locations = new Mongo.Collection('locations');
locationSchema = new SimpleSchema(locationSchemaObject);
Locations.attachSchema(locationSchema);

Locations.allow({
  update: function(userId, location) { return ownsDocument(userId, location); },
  remove: function(userId, location) { return ownsDocument(userId, location); },
  insert: function(userId, location) { return !! userId; }
});

Meteor.methods({
  locationInsert: function(locationAttributes) {
    var locationWithSameLink = Locations.findOne({url: locationAttributes.url});
    if (locationWithSameLink) {
      throw new Meteor.Error('urlnotunique');
    };

    var user = Meteor.user();
    var location = _.extend(locationAttributes, {
      createdBy: {
        userId: user._id,
        author: user.username
      },
      createdAt: new Date(),
      commentsCount: 0
    });
    // Validate against schema
    check(location, locationSchema);
    var locationId = Locations.insert(location);

    return {
      _id: locationId
    };
  }
});
