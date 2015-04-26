AutoForm.hooks({
  insertLocationForm: {
    onSuccess: function(formType, result) {
      this.resetForm();
      Router.go('locationPage', {_id: result._id});
    },
    onError: function(formType, error) {
      if (error.error === 'urlnotunique') {
        this.validationContext.addInvalidKeys([{name: "url", type: "notUnique"}]);
      }
    }
  }
});
