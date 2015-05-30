Meteor.publish('locations', function(bounds) {
  if (Match.test(bounds, null)) {
      check(bounds, null);
      return [];
  }
  check(bounds, {ne: {lng: Number, lat: Number}, sw: {lng: Number, lat: Number}});
  var polygon = {
    type: "Polygon",
    coordinates: [[
      [bounds.ne.lng, bounds.ne.lat],
      [bounds.sw.lng, bounds.ne.lat],
      [bounds.sw.lng, bounds.sw.lat],
      [bounds.ne.lng, bounds.sw.lat],
      [bounds.ne.lng, bounds.ne.lat]
    ]]
  };
  return Locations.find({location: {$geoWithin: {$geometry: polygon}}});;
});

Meteor.publish('comments', function(locationId) {
  check(locationId, String);
  return Comments.find({locationId: locationId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});
