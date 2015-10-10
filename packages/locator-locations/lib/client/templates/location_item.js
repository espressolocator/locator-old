Template.locationItem.helpers({
  canEdit: function() {
    return ((this.createdBy.userId === Meteor.userId()) || isAdminUser());
  },
});
