if (Locations.find().count() === 0) {
  Locations.insert({
    title: 'Introducing Telescope',
    url: 'http://sachagreif.com/introducing-telescope/'
  });

  Locations.insert({
    title: 'Meteor',
    url: 'http://meteor.com'
  });

  Locations.insert({
    title: 'The Meteor Book',
    url: 'http://themeteorbook.com'
  });
}
