// check that the userId specified owns the documents
ownsLocation = function(userId, doc) {
  return doc && doc.createdBy.userId === userId;
}

ownsNotification = function(userId, doc) {
  return doc && doc.userId === userId;
}
