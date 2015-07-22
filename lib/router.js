Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return Meteor.subscribe('notifications');
  }
});

Router.route('/', {name: 'locationsPage'});
Router.route('/locations/:_id', {
  name: 'locationPage',
  waitOn: function() {
    return [Meteor.subscribe('comments', this.params._id), Meteor.subscribe('location', this.params._id)];
  },
  data: function() { return Locations.findOne(this.params._id); }
});

Router.route('/submit', {name: 'locationSubmit'});

Router.route('/locations/:_id/edit', {
  name: 'locationEdit',
  data: function() { return Locations.findOne(this.params._id); },
  waitOn: function() {
    return Meteor.subscribe('location', this.params._id);
  }
});

Router.route('/admin', {
  name: 'accountsAdmin',
  onBeforeAction: function() {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else if(!isAdminUser()) {
      console.log('redirecting');
      this.redirect('/');
    } else {
      this.next();
    }
  }
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
