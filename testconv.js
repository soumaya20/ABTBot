var watson = require('watson-developer-cloud');

var conversation = new watson.ConversationV1({
  username: '{username}',
  password: '{password}',
  version: '2018-02-16'
});