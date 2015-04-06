Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('locations'); }
});

Router.route('/', {name: 'locationsList'});
Router.route('/locations/:_id', {
  name: 'locationPage',
  data: function() { return Locations.findOne(this.params._id); }
});

Router.route('/submit', {name: 'locationSubmit'});

Router.route('/locations/:_id/edit', {
  name: 'locationEdit',
  data: function() { return Locations.findOne(this.params._id); }
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'locationPage'});
Router.onBeforeAction(requireLogin, {only: 'locationSubmit'});
