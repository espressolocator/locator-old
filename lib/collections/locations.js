Locations = new Mongo.Collection('locations');

Meteor.methods({
  locationInsert: function(locationAttributes) {

    NonEmptyString = Match.Where(function (x) {
      check(x, String);
      return x.length > 0;
    });
    check(Meteor.userId(), String);
    check(locationAttributes, {
      title: NonEmptyString,
      description: NonEmptyString,
      url: NonEmptyString
    });

    var locationWithSameLink = Locations.findOne({url: locationAttributes.url});
    if (locationWithSameLink) {
      return {
        locationExists: true,
        _id: locationWithSameLink._id
      }
    }

    var user = Meteor.user();
    var location = _.extend(locationAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });
    var locationId = Locations.insert(location);
    return {
      _id: locationId
    };
  }
});

Locations.allow({
  update: function(userId, location) { return ownsDocument(userId, location); },
  remove: function(userId, location) { return ownsDocument(userId, location); },
});

Locations.deny({
  update: function(userId, location, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title', 'description').length > 0);
  }
});
