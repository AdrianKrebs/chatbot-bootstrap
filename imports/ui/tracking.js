import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {Messages} from '../api/messages.js';
import {Chats} from '../api/chats.js';

import './tracking.html';

Template.tracking.onCreated(function () {
  $('.spinner').hide();
});

Template.tracking.events({
  'click .chat-list-entry' (event) {
    FlowRouter.go('/tracking/' + $(event.currentTarget).data('id'));
  },
});

Template.tracking.helpers({
  chatIsSelected (id) {
    return id == FlowRouter.getParam("chatId");
  },

  userIsMona(user) {
    return user == 'bot';
  },
  chats () {
    let chats = Chats.find({}, {sort: {createdAt: -1}});
    return chats;
  },
  chat () {
    const chatId = FlowRouter.getParam("chatId");
    let chat = {};
    if (chatId) {
      chat =  Chats.findOne(chatId);
    }
    return JSON.stringify(chat, 0, 2);
  },
  messages () {
    const chatId = FlowRouter.getParam("chatId");
    let messages = [];
    if (chatId) {
      messages = Messages.find({chatId:chatId}, {sort: {createdAt: 1}});
    }
    return messages;
  },
});
