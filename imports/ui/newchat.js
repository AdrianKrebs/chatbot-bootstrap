import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './newchat.html';

Template.newchat.onCreated(function () {
    $('.spinner').hide();
});

Template.newchat.helpers({});


Template.newchat.events({
        'click #newchat'()
        {
            Meteor.call('chats.insert', function (error, result) {
                const chatId = result;
                $('.spinner').show();

                //let text = Conversation.welcomeMessage;
                Meteor.call('messages.insert', "Hello my friend :)", chatId, 'bot');

                $('.spinner').hide();
                FlowRouter.go('/chat/' + chatId);

            });
        }
    }
)
;
