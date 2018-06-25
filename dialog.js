var watson = require('watson-developer-cloud');

var conversation = new watson.ConversationV1({
  username: '9ec11fa7-414c-4241-a09b-a963f4b27bdf',
  password: 'CtYEktsPIOft',
  version: '2018-02-16'
});

var params = {
  workspace_id: 'a2bd928a-28f1-435e-acff-4528958c56dd',
  dialog_node: 'greeting',
  conditions:'#hello',
  output: {
    text: 'Hi! How can I help you?'
  },
  title: 'Greeting'
};

conversation.createDialogNode(params, function(err, response) {
  if (err) {
    console.error(err);
  } else {
    console.log(JSON.stringify(response, null, 2));
  }
});

function handleMessage(sender_psid, received_message) {
    let response;
    
    // Checks if the message contains text
    if (received_message.text) {    
      // Create the payload for a basic text message, which
      // will be added to the body of our request to the Send API
      response = {
        "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
      }
    } else if (received_message.attachments) {
      // Get the URL of the message attachment
      let attachment_url = received_message.attachments[0].payload.url;
      response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [{
              "title": "Is this the right picture?",
              "subtitle": "Tap a button to answer.",
              "image_url": attachment_url,
              "buttons": [
                {
                  "type": "postback",
                  "title": "Yes!",
                  "payload": "yes",
                },
                {
                  "type": "postback",
                  "title": "No!",
                  "payload": "no",
                }
              ],
            }]
          }
        }
      }
    } 
     // Send the response message
  callSendAPI(sender_psid, response);    
}