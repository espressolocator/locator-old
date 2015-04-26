// Fixture data
if (Locations.find().count() === 0) {
  var now = new Date().getTime();

  // create two users
  var tomId = Meteor.users.insert({
    profile: { name: 'tomcoleman' }
  });
  var tom = Meteor.users.findOne(tomId);
  var sachaId = Meteor.users.insert({
    profile: { name: 'sachagreif' }
  });
  var sacha = Meteor.users.findOne(sachaId);

  var telescopeId = Locations.insert({
    title: 'Introducing Telescope',
    description: 'Some description',
    url: 'http://sachagreif.com/introducing-telescope/',
    createdAt: new Date(now - 7 * 3600 * 1000),
    createdBy: { userId: sacha._id, author: sacha.profile.name },
    commentsCount: 2
  }, { getAutoValues: false } );

  Comments.insert({
    locationId: telescopeId,
    createdBy: { userId: tom._id, author: tom.profile.name },
    createdAt: new Date(now - 5 * 3600 * 1000),
    body: 'Interesting project Sacha, can I get involved?'
  }, { getAutoValues: false });

  Comments.insert({
    locationId: telescopeId,
    createdBy: { userId: sacha._id, author: sacha.profile.name },
    createdAt: new Date(now - 3 * 3600 * 1000),
    body: 'You sure can Tom!'
  }, { getAutoValues: false });

  Locations.insert({
    title: 'Meteor',
    description: 'Some description',
    url: 'http://meteor.com',
    createdAt: new Date(now - 10 * 3600 * 1000),
    createdBy: { userId: tom._id, author: tom.profile.name },
    commentsCount: 0
  }, { getAutoValues: false });

  Locations.insert({
    title: 'The Meteor Book',
    description: 'Some description',
    url: 'http://themeteorbook.com',
    createdAt: new Date(now - 12 * 3600 * 1000),
    createdBy: { userId: tom._id, author: tom.profile.name },
    commentsCount: 0
  }, { getAutoValues: false });
}
