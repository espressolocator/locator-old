AutoForm.hooks({
  insertLocationForm: {
    onSuccess: function(formType, result) {
      Router.go('locationPage', {_id: this.docId});
    },
  }
});
