Meteor.publish('locations', function(bounds) {
  // No boulds are passed, return empty array.
  if (Match.test(bounds, null)) {
      check(bounds, null);
      return [];
  }
  // If bounds are passed, create Polygon notation and query Locations.
  check(bounds, [[Number]]);
  var polygon = {
    type: "Polygon",
    coordinates: [bounds]
  };
  return Locations.find({location: {$geoWithin: {$geometry: polygon}}}, {sort: {submitted: -1}});
});

Meteor.publish('location', function(locationId) {
  check(locationId, String);
  return Locations.find({_id: locationId}, {sort: {submitted: -1}});
});
