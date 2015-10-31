Template.locationItem.helpers({
  locationStatus: function() {
    var locationStatus = (typeof this.status !== 'undefined') ? Locations.config.locationStatuses[this.status] : '';
    return locationStatus;
  }
});
