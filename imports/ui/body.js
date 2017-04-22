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

});

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('HH:MM');
});
