Template.locationItem.helpers({
  ownSubmission: function() {
    return this.createdBy.userId === Meteor.userId();
  },
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  }
});
