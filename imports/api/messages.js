import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {HTTP} from 'meteor/http';
import {Chats} from './chats.js';

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

export const Messages = new Mongo.Collection('message');

if (Meteor.isServer) {
    Meteor.publish('messages', function tasksPublication() {
        return Messages.find({});
    });
}

if (Meteor.isServer) {
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
        'messages.callApiAI'(text, chatId) {
            let options = {
                sessionId: chatId
            };
            let request = app.textRequest(text, options);

            request.on('response', Meteor.bindEnvironment(function (response, errror) {
                console.log(response);
                Meteor.call('messages.insert', response.result.fulfillment.speech, chatId, 'bot', response.result.metadata.intentName);

            }, function (error) {
                console.log(error);
            }));

            request.end();
        },
        'messages.remove'(messageId) {
            check(messageId, String);
            const message = Message.findOne(messageId);
            Messages.remove(taskId);
        }
    });
}
