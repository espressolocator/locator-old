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
    label: "The name of cafe",
    max: 200
  },
  description: {
    type: String,
    optional: true,
    label: "Brief description",
    max: 400,
    autoform: {
      rows: 5
    }
  },
  url: {
    type: String,
    label: "Website",
    regEx: SimpleSchema.RegEx.Url,
    index: true,
    unique: true
  },
  address: {
    type: String,
    label: "Address"
  },
  location: {
    type: Object,
    autoform: {
      omit: true
    }
  },
  'location.lat': {
    type: String
  },
  'location.lng': {
    type: String
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
    denyUpdate: true,
    autoform: {
      omit: true
    }
  },
  updatedAt: {
    type: Date,
    optional: true,
    denyInsert: true,
    autoform: {
      omit: true
    }
  },
  createdBy: {
    type: Object,
    optional: true,
    denyUpdate: true,
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
    denyInsert: true,
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
  remove: function(userId, location) { return (ownsDocument(userId, location) || Roles.userIsInRole(Meteor.user(), ['admin'])); },
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
  },
  locationEdit: function(modifier, documentId) {
    check(documentId, String);

    var locationWithSameLink = Locations.findOne({ $and: [ { url: modifier.$set.url }, { _id: { $ne: documentId } } ] });
    if (locationWithSameLink) {
      throw new Meteor.Error('urlnotunique');
    };

    var user = Meteor.user();
    modifier.$set = _.extend(modifier.$set, {
      updatedBy: {
        userId: user._id,
        author: user.username
      },
      updatedAt: new Date()
    });
    // Validate against schema
    check(modifier, locationSchema);

    Locations.update(documentId, modifier, function(error) {
      if (error) {
        // display the error to the user
        throw new Meteor.Error('updateerror');
      }
    });

    return {
      _id: documentId
    };
  }
});
