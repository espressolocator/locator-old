Template.locationItem.helpers({
  canEdit: function() {
    return ((this.createdBy.userId === Meteor.userId()) || Roles.userIsInRole(Meteor.user(), ['admin']));
  },
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  }
});
