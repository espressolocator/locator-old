Template.locationsPage.helpers({
  locations: function() {
    return Template.instance().locations();
  }
});

Template.locationsPage.onRendered(function() {
  var instance = this;
  this.autorun(function(c) {
    if (GoogleMaps.loaded()) {
      var searchLocationInput = instance.$('.search-locations-input');
      var mapProperties = {
        map: instance.$('.map-container'),
        mapOptions: {
          zoom: 12,
          minZoom: 9,
          scrollwheel: true,
          streetViewControl: false
        },
        markerOptions: {
          disabled: true
        },
        types: ['(regions)']
      };

      // If we have some cooridantes stored from previous page visit, use
      // them.
      var lastposition = Session.get('lastposition');
      if (lastposition) {
        mapProperties.location = lastposition.center;
        mapProperties.mapOptions.zoom = lastposition.zoom;
      }
      // Init the map and the search box.
      addGeocomplete(searchLocationInput, mapProperties);

      // Map idle state listener. It is useful to track the end of any map
      // action such as zoom or repositioning. Once user is finished with
      // map action we update search result and markers.
      var map = searchLocationInput.geocomplete("map");
      google.maps.event.addListener(map, 'idle', function() {
        // Ger current map bounds, conver them to polygon and save in reactive
        // variable that will trigger subscription update.
        var bounds = map.getBounds();
        if (bounds) {
          var ne = bounds.getNorthEast();
          var sw = bounds.getSouthWest();
          var boundsCoordinates = [
            [sw.lng(), ne.lat()], // nw
            [ne.lng(), ne.lat()], // ne
            [ne.lng(), sw.lat()], // se
            [sw.lng(), sw.lat()], // sw
            [sw.lng(), ne.lat()], // nw
          ];
          instance.mapBoundsCoordinates.set(boundsCoordinates);
        }
        // Store the last map position and zoom level in the session variable.
        var center = map.getCenter();
        if (center) {
          Session.set('lastposition', { center: [center.lat(), center.lng()], zoom: map.getZoom() });
        }
      });
      // Map click event listener.
      google.maps.event.addListener(map, 'click', function(event) {
        // Close infowindow if it is open.
        if (instance.openedInfoWindow) {
          instance.openedInfoWindow.close();
        }
      });
      c.stop();
    }
  });
});

Template.locationsPage.onCreated(function() {
  // Init Googlemaps.
  GoogleMaps.load({
    libraries: 'places'
  });
  // Declare markers array.
  var markers = {};
  // Init reactive vars.
  var instance = this;
  instance.mapBoundsCoordinates = new ReactiveVar(null);
  // Declare opened infowindow reference.
  instance.openedInfoWindow = null;

  instance.autorun(function () {
    // Subscribe to the locations publication and limit results to
    // what is on the current map view.
    var subscription = instance.subscribe('locations', instance.mapBoundsCoordinates.get());
    if (subscription.ready()) {
      // If at least one location avialable, add marker.
      if (instance.locations().count()) {
        var map = instance.$('.search-locations-input').geocomplete("map");
        // Iterate through found locations.
        instance.locations().forEach(function(location) {
          // See if we already have marker on the map.
          if (!markers[location._id]) {
            var latLng = new google.maps.LatLng(location.location.coordinates[1], location.location.coordinates[0]);
            // Create marker.
            var marker = new google.maps.Marker({
              position: latLng,
              map: map,
              title: location.title,
              icon: '/logo-icon-marker.png',
              id: location._id
            });
            // Create infowindow.
            var infoWindow = new InfoBubble({
              content: '<div id="content"><h4>'+location.title+'</h4><div>'+location.address+'</div></div>',
              maxWidth: 300,
              minHeight: 100,
              padding: 6,
              borderRadius: 4,
              arrowSize: 10,
              borderWidth: 1,
              disableAutoPan: true,
              hideCloseButton: true
            });
            // Add event to show infowindow.
            google.maps.event.addListener(marker, 'click', function() {
              // If this infowindow is open, it means user clicked on the same
              // marker, we do not need to do anything.
              if (infoWindow.isOpen()) {
                return;
              }
              // Close infowindow that was open previously.
              if (instance.openedInfoWindow) {
                instance.openedInfoWindow.close();
              }
              // Open the one user clicked on and store its reference in
              // variable, so we can close it later.
              infoWindow.open(map, marker);
              instance.openedInfoWindow = infoWindow;
            });
            // Add marker to markers array, so we do not recreate it in future.
            markers[location._id] = marker;
          }
        });
      }
    }
  });
  // Locations cursor.
  instance.locations = function() {
    return Locations.find({}, {sort: {submitted: -1}});
  }
});
