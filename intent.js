
  var watson = require('watson-developer-cloud');

  var conversation = new watson.ConversationV1({
    username: '9ec11fa7-414c-4241-a09b-a963f4b27bdf',
    password: 'CtYEktsPIOft',
    version: '2018-02-16'
  });
  
  var params = {
    workspace_id: 'a2bd928a-28f1-435e-acff-4528958c56dd',
    intent: 'hello',
    examples: [
      {
        text: 'Good morning'
      },
      {
        text: 'Hi there'
      }
    ]
  };
  
  conversation.createIntent(params, function(err, response) {
    if (err) {
      console.error(err);
    } else {
      console.log(JSON.stringify(response, null, 2));
    }
  });