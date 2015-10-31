// Define SimpleSchema object to store location coordinates.
twodsphereSchemaObject = {
  type: {
    type: String
  },
  coordinates: {
    type: [Number],
    decimal: true
  }
};
twodsphereSchema = new SimpleSchema(twodsphereSchemaObject);


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
    type: twodsphereSchema,
    index: "2dsphere",
    autoform: {
      omit: true
    }
  },
  tel: {
    type: String,
    label: "Phone",
    optional: true,
    max: 50
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
  },
  /**
    The post's status. One of pending (`1`), approved (`2`), or deleted (`3`)
  */
  status: {
    type: Number,
    optional: true,
    autoValue: function () {
      // only provide a default value
      // 1) this is an insert operation
      // 2) status field is not set in the document being inserted
      var user = Meteor.users.findOne(this.userId);
      if (this.isInsert && !this.isSet) {
        return Locations.getDefaultStatus(user);
      }
    },
    autoform: {
      omit: true
    }
  }
};

// Setup global namespace
Locations = new Mongo.Collection('locations');
locationSchema = new SimpleSchema(locationSchemaObject);
Locations.attachSchema(locationSchema);

// Posts config namespace
Locations.config = {};
Locations.config.locationStatuses = {
    1 : 'pending',
    2 : 'approved',
    3 : 'rejected'
  };
Locations.config.STATUS_PENDING = 1;
Locations.config.STATUS_APPROVED = 2;
Locations.config.STATUS_REJECTED = 3;

/**
 * Get default status for new posts.
 * @param {Object} user
 */
Locations.getDefaultStatus = function (user) {
  var hasAdminRights = (typeof user === 'undefined') ? false : Roles.userIsInRole(user, ['admin']);
  if (hasAdminRights) {
    // if user is admin, or else post approval is not required
    return Locations.config.STATUS_APPROVED;
  } else {
    // else
    return Locations.config.STATUS_PENDING;
  }
};


// Define allow callback.
Locations.allow({
  remove: function(userId, location) { return (isAdminUser()); },
});

// Server side methods.
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
