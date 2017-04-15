import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Tracker} from 'meteor/tracker'
import {HTTP} from 'meteor/http'

import {Messages} from '../api/messages.js';
import {Chats} from '../api/chats.js';
import { _ } from 'lodash';

import './chat.html';

var scrollBottom = function () {
  window.scrollTo(0,document.body.scrollHeight);
}

Template.chat.onCreated(function () {
    $('.spinner').hide();
    Meteor.subscribe('messages', function () {
        var messages = Messages.find().observe({
            added: function (res) {
              [5, 25, 75, 150].map( seconds => {
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
      //if (lastMessage) {
        //let quickReplies = _.get(lastMessage, 'intent.quickReplies')
       // if (quickReplies && quickReplies.length > 0 && quickReplies[0] != "") {
       //      quickReplies = quickReplies.map( reply => {
       //        return {title: reply.title, module: lastMessage.intent.module};
       //      });
            return {template: 'buttons', data: [{title: "TEST", module: 444444},{title: "Second", module: 444444}]};
      //  }
    //  }
    }
});

Template.chat.events({
    'click .js-send'(event) {
        const text = $(event.target).text();
        const module = $(event.target).data('module');
        const chatId = FlowRouter.getParam("chatId");

        Meteor.call('messages.insert', text, chatId, 'user');

        scrollBottom();
    },

    'submit .new-message-form, click .new-message .send'(event) {
      event.preventDefault();

      const text = $("#messageBox").val();
      const chatId = FlowRouter.getParam("chatId");

      Meteor.call('messages.insert', text, chatId, 'user');

      $("#messageBox").val('');
    }
});
