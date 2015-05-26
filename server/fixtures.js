// Fixture data
if (Locations.find().count() === 0) {
  var now = new Date().getTime();

  // create admin user
  Accounts.createUser({username: 'admin', email: 'admin@test.com', password: '11evi0880', profile: { name: 'Site admin' }});
  Roles.addUsersToRoles(Meteor.users.find({username: 'admin'}).fetch(), ['admin']);


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
    location: { type: "Point", coordinates: [ -2.782137641247573, 54.0307393841768 ] },
    address: "Kempton Road, Lancaster, United Kingdom",
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
    location:  { type: "Point", coordinates: [ -0.5883418836059491, 44.834658819555 ] },
    address: "33000 Bordeaux, France",
    commentsCount: 0
  }, { getAutoValues: false });

  Locations.insert({
    title: 'The Meteor Book',
    description: 'Some description',
    url: 'http://themeteorbook.com',
    createdAt: new Date(now - 12 * 3600 * 1000),
    createdBy: { userId: tom._id, author: tom.profile.name },
    location:  { type: "Point", coordinates: [ -2.7904901053100275, 54.032038435284264 ] },
    address: "27 Bowerham Road, Lancaster, United Kingdom",
    commentsCount: 0
  }, { getAutoValues: false });
}
