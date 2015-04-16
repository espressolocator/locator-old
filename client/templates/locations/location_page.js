Template.locationPage.helpers({
  comments: function() {
    return Comments.find({locationId: this._id});
  }
});
