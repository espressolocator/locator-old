/**
 * Location views are filters used for subscribing to and viewing locations
 * @namespace Locations.views
 */
Locations.views = {};

/**
 * Add a location view
 * @param {string} viewName - The name of the view
 * @param {function} [viewFunction] - The function used to calculate query terms. Takes terms and baseParameters arguments
 */
Locations.views.add = function (viewName, viewFunction) {
  Locations.views[viewName] = viewFunction;
};

/**
 * Base parameters that will be common to all other view unless specific properties are overwritten
 */
Locations.views.baseParameters = {
  find: {
    status: Locations.config.STATUS_APPROVED
  },
  options: {
    limit: 10
  }
};

/**
 * New view
 */
Locations.views.add("new", function (terms) {
  return {
    options: {sort: {createdAt: -1}}
  };
});


/**
 * Pending view
 */
Locations.views.add("pending", function (terms) {
  return {
    find: {
      status: Locations.config.STATUS_PENDING
    },
    options: {sort: {createdAt: -1}},
    showFuture: true
  };
});

/**
 * Rejected view
 */
Locations.views.add("rejected", function (terms) {
  return {
    find: {
      status: Locations.config.STATUS_REJECTED
    },
    options: {sort: {createdAt: -1}},
    showFuture: true
  };
});
