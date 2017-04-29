import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Tracker} from 'meteor/tracker'
import {HTTP} from 'meteor/http'

import {Messages} from '../api/messages.js';
import {Chats} from '../api/chats.js';
import {_} from 'lodash';

import './chat.html';

var scrollBottom = function () {
    window.scrollTo(0, document.body.scrollHeight);
};

const SHOW_BUTTONS_TEST_STRING = "show buttons";

Template.chat.onCreated(function () {
    $('.spinner').hide();
    $('header').show();
    Meteor.subscribe('messages', function () {
        var messages = Messages.find().observe({
            added: function (res) {
                [5, 25, 75, 150, 250, 500, 1000].map(seconds => {
                    setTimeout(function () {
                        scrollBottom();
                    }, seconds);
                })
            },
        })
    });
});

Template.chat.onRendered(function () {
    scrollBottom();
    var self = this;
    self.autorun(function () {
        self.subscribe("chats", function () {
            const chatId = FlowRouter.getParam("chatId");
        });
    });
});

Template.chat.helpers({
    intent () {
        return FlowRouter.getParam("intent");
    },
    messages () {
        const chatId = FlowRouter.getParam("chatId");
        let values = Messages.find({chatId}, {sort: {createdAt: 1}});
        return values;
    },
    inputTemplate () {
        const chatId = FlowRouter.getParam("chatId");
        let lastMessage = Messages.findOne({chatId: chatId}, {sort: {createdAt: -1, limit: 1}});

        if (lastMessage.text === SHOW_BUTTONS_TEST_STRING) { // example of how to use buttons in your template
            return {
                template: 'buttons',
                data: [
                    {
                        title: "Option A"
                    },
                    {
                        title: "Option B"
                    }
                ]
            };
        }

        return {
            template: "text",
            data: ""
        };

    }
});

Template.chat.events({
    'click .js-send'(event) {
        const text = $(event.target).text();
        const module = $(event.target).data('module');
        const chatId = FlowRouter.getParam("chatId");

        Meteor.call('messages.insert', text, chatId, 'user');
        Meteor.call('messages.callApiAi', text, chatId);
        scrollBottom();
    },

    'submit .new-message-form, click .new-message .send'(event) {
        event.preventDefault();

        const text = $("#messageBox").val();
        const chatId = FlowRouter.getParam("chatId");

        Meteor.call('messages.insert', text, chatId, 'user');


        if (text !== SHOW_BUTTONS_TEST_STRING) {
            $(".typing").show();
            Meteor.setTimeout(function () {
                Meteor.call('messages.callApiAi', text, chatId);
                $(".typing").hide();
            }, 1500);
        }

        $("#messageBox").val('');
    }
});
