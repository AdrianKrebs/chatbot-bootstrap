import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {HTTP} from 'meteor/http';
const apiai = require('apiai');



const motionAiRequest = function (msg, session, callback) {
    HTTP.get('https://api.motion.ai/messageBot', {
        params: {
            msg: msg,
            session: session,
            bot: 39872,
            key: '41dbde35b62de513f017bb2c3b0c0ce4',
        },
    }, (error, result) => {
        callback(error, result);
    });
};

if (Meteor.isServer) {
    Meteor.publish('messages', function tasksPublication() {
        return Messages.find({});
    });
}


export const Messages = new Mongo.Collection('message');

if (Meteor.isServer) {
    const API_AI_CLIENT_ACCESS_TOKEN = Meteor.settings.apiAiClientAccessToken; // your api key
    const api = apiai(API_AI_CLIENT_ACCESS_TOKEN);
    Meteor.methods({
        'messages.insert'(text, chatId, user, intent) {
            Messages.insert({
                text,
                chatId,
                intent: intent,
                user: user,
                createdAt: new Date()
            });
        },
        'messages.callMotionAi'(text, chatId) {
            motionAiRequest(text, chatId, (error, response) => {
                if (error) {
                    console.log(error);
                    return;
                }

                response.data.botResponse.split("::next::").map(responsePart => {
                    Meteor.call('messages.insert', responsePart, chatId, 'bot', response.data);
                });


            });
        },
        'messages.callApiAi'(text, chatId) {
            let options = {
                sessionId: chatId
            };
            let request = api.textRequest(text, options);

            request.on('response', Meteor.bindEnvironment(function (response) {
                console.log(response);
                Meteor.call('messages.insert', response.result.fulfillment.speech, chatId, 'bot', response.result.metadata.intentName);

            }, function (error) {
                console.log(error);
            }));

            request.end();
        },
        'messages.remove'(messageId) {
            //NOOP
        }
    });
}
