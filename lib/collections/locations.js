Locations = new Mongo.Collection('locations');

Locations.deny({
  update: function(userId, location, fieldNames, modifier) {
    var errors = validateLocation(modifier.$set);
    return errors.title || errors.url || errors.description;
  }
});

validateLocation = function (location) {
  var errors = {};
  if (!location.title)
    errors.title = "Please fill in a headline";
  if (!location.url)
    errors.url = "Please fill in a URL";
  if (!location.description)
    errors.description =  "Please fill in a description";
  return errors;
}

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

    var errors = validateLocation(locationAttributes);
    if (errors.title || errors.url || errors.description)
      throw new Meteor.Error('invalid-location', "You must set fields for your post");

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
