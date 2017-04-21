var require = meteorInstall({"imports":{"api":{"chats.js":["meteor/meteor","meteor/mongo","lodash",function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// imports/api/chats.js                                                                         //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
module.export({                                                                                 // 1
  Chats: function () {                                                                          // 1
    return Chats;                                                                               // 1
  }                                                                                             // 1
});                                                                                             // 1
var Meteor = void 0;                                                                            // 1
module.importSync("meteor/meteor", {                                                            // 1
  "Meteor": function (v) {                                                                      // 1
    Meteor = v;                                                                                 // 1
  }                                                                                             // 1
}, 0);                                                                                          // 1
var Mongo = void 0;                                                                             // 1
module.importSync("meteor/mongo", {                                                             // 1
  "Mongo": function (v) {                                                                       // 1
    Mongo = v;                                                                                  // 1
  }                                                                                             // 1
}, 1);                                                                                          // 1
                                                                                                //
var _ = void 0;                                                                                 // 1
                                                                                                //
module.importSync("lodash", {                                                                   // 1
  "_": function (v) {                                                                           // 1
    _ = v;                                                                                      // 1
  }                                                                                             // 1
}, 2);                                                                                          // 1
var Chats = new Mongo.Collection('chat');                                                       // 5
                                                                                                //
if (Meteor.isServer) {                                                                          // 7
  Meteor.methods({                                                                              // 9
    'chats.insert': function () {                                                               // 10
      return Chats.insert({                                                                     // 11
        createdAt: new Date(),                                                                  // 12
        userAgent: headers.get(this, 'User-Agent'),                                             // 13
        errors: [],                                                                             // 14
        packages: []                                                                            // 15
      });                                                                                       // 11
    },                                                                                          // 17
    'chats.updateStep': function (_id, step) {                                                  // 19
      return Chats.update(_id, {                                                                // 20
        $set: {                                                                                 // 20
          step: step                                                                            // 20
        }                                                                                       // 20
      });                                                                                       // 20
    },                                                                                          // 21
    'chats.updateSessionContext': function (_id, sessionContext) {                              // 23
      return Chats.update(_id, {                                                                // 24
        $set: {                                                                                 // 24
          sessionContext: sessionContext                                                        // 24
        }                                                                                       // 24
      });                                                                                       // 24
    },                                                                                          // 25
    'chats.appendError': function (_id, error) {                                                // 27
      return Chats.update(_id, {                                                                // 28
        $push: {                                                                                // 28
          errors: error                                                                         // 28
        }                                                                                       // 28
      });                                                                                       // 28
    }                                                                                           // 29
  });                                                                                           // 9
}                                                                                               // 31
//////////////////////////////////////////////////////////////////////////////////////////////////

}],"messages.js":["meteor/meteor","meteor/mongo","meteor/check","meteor/http","apiai",function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// imports/api/messages.js                                                                      //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
module.export({                                                                                 // 1
    Messages: function () {                                                                     // 1
        return Messages;                                                                        // 1
    }                                                                                           // 1
});                                                                                             // 1
var Meteor = void 0;                                                                            // 1
module.importSync("meteor/meteor", {                                                            // 1
    "Meteor": function (v) {                                                                    // 1
        Meteor = v;                                                                             // 1
    }                                                                                           // 1
}, 0);                                                                                          // 1
var Mongo = void 0;                                                                             // 1
module.importSync("meteor/mongo", {                                                             // 1
    "Mongo": function (v) {                                                                     // 1
        Mongo = v;                                                                              // 1
    }                                                                                           // 1
}, 1);                                                                                          // 1
var check = void 0;                                                                             // 1
module.importSync("meteor/check", {                                                             // 1
    "check": function (v) {                                                                     // 1
        check = v;                                                                              // 1
    }                                                                                           // 1
}, 2);                                                                                          // 1
var HTTP = void 0;                                                                              // 1
module.importSync("meteor/http", {                                                              // 1
    "HTTP": function (v) {                                                                      // 1
        HTTP = v;                                                                               // 1
    }                                                                                           // 1
}, 3);                                                                                          // 1
                                                                                                //
var apiai = require('apiai');                                                                   // 5
                                                                                                //
var motionAiRequest = function (msg, session, callback) {                                       // 9
    HTTP.get('https://api.motion.ai/messageBot', {                                              // 10
        params: {                                                                               // 11
            msg: msg,                                                                           // 12
            session: session,                                                                   // 13
            bot: 39872,                                                                         // 14
            key: '41dbde35b62de513f017bb2c3b0c0ce4'                                             // 15
        }                                                                                       // 11
    }, function (error, result) {                                                               // 10
        callback(error, result);                                                                // 18
    });                                                                                         // 19
};                                                                                              // 20
                                                                                                //
var Messages = new Mongo.Collection('message');                                                 // 22
                                                                                                //
if (Meteor.isServer) {                                                                          // 24
    var API_AI_CLIENT_ACCESS_TOKEN = Meteor.settings.apiAiClientAccessToken; // your api key    // 25
                                                                                                //
    var api = apiai(API_AI_CLIENT_ACCESS_TOKEN);                                                // 26
    Meteor.methods({                                                                            // 27
        'messages.insert': function (text, chatId, user, intent) {                              // 28
            Messages.insert({                                                                   // 29
                text: text,                                                                     // 30
                chatId: chatId,                                                                 // 31
                intent: intent,                                                                 // 32
                user: user,                                                                     // 33
                createdAt: new Date()                                                           // 34
            });                                                                                 // 29
        },                                                                                      // 36
        'messages.callMotionAi': function (text, chatId) {                                      // 37
            motionAiRequest(text, chatId, function (error, response) {                          // 38
                if (error) {                                                                    // 39
                    console.log(error);                                                         // 40
                    return;                                                                     // 41
                }                                                                               // 42
                                                                                                //
                response.data.botResponse.split("::next::").map(function (responsePart) {       // 44
                    Meteor.call('messages.insert', responsePart, chatId, 'bot', response.data);
                });                                                                             // 46
            });                                                                                 // 49
        },                                                                                      // 50
        'messages.callApiAi': function (text, chatId) {                                         // 51
            var options = {                                                                     // 52
                sessionId: chatId                                                               // 53
            };                                                                                  // 52
            var request = api.textRequest(text, options);                                       // 55
            request.on('response', Meteor.bindEnvironment(function (response) {                 // 57
                console.log(response);                                                          // 58
                Meteor.call('messages.insert', response.result.fulfillment.speech, chatId, 'bot', response.result.metadata.intentName);
            }, function (error) {                                                               // 61
                console.log(error);                                                             // 62
            }));                                                                                // 63
            request.end();                                                                      // 65
        },                                                                                      // 66
        'messages.remove': function (messageId) {//NOOP                                         // 67
        }                                                                                       // 69
    });                                                                                         // 27
}                                                                                               // 71
//////////////////////////////////////////////////////////////////////////////////////////////////

}]}},"server":{"main.js":["../imports/api/messages.js","../imports/api/chats.js",function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// server/main.js                                                                               //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
module.importSync("../imports/api/messages.js");                                                // 1
module.importSync("../imports/api/chats.js");                                                   // 1
//////////////////////////////////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json"]});
require("./server/main.js");
//# sourceMappingURL=app.js.map
