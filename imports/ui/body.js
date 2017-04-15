import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import moment from 'moment';

import { Chats } from '../api/chats.js';

import './newchat.js';
import './message.js';
import './body.html';
import './tracking.js';


import './chat.js';


Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('chats');
  Meteor.subscribe('messages');
});

Template.body.helpers({
  statusMessage() {
    const chatId = FlowRouter.getParam("chatId");
    let chat = Chats.findOne({_id: chatId});
    if (chat) {
      return Conversation['steps'][chat.step].status;
    } else {
      return '';
    }
  }
});

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('HH:MM');
});
