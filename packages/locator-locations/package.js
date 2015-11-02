Package.describe({
  name: 'locator-locations',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  var packages = [
    'aldeed:autoform',
    'aldeed:collection2',
    'aldeed:simple-schema',
    'kabalin:autoform-geojson-point'
  ];

  api.use(packages);
  api.use(['templating'], 'client');

  api.imply(packages);

  api.addFiles([
    'lib/locations.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/stylesheets/location.css',
    'lib/client/templates/location_edit.html',
    'lib/client/templates/location_edit.js',
    'lib/client/templates/location_item.html',
    'lib/client/templates/location_item.js',
    'lib/client/templates/location_page.html',
    'lib/client/templates/location_page.js',
    'lib/client/templates/locations_page.html',
    'lib/client/templates/locations_page.js',
    'lib/client/templates/location_submit.html',
    'lib/client/templates/location_submit.js'
  ], ['client']);

  api.addFiles([
    'lib/server/publications.js'
  ], ['server']);

  api.export(['Locations','locationSchema']);

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('locator-locations');
});
