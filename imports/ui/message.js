import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './message.html';
import './answer_options.html';

Template.message.helpers({
  replaceImages(text) {
    return text.replace(/\[img\]([^\[]*)\[\/img\]/g,"<img src='$1' />");
  },
  userIsMona(user) {
    return user == 'bot';
  }
});

Template.message.events({
  'click .delete'() {
    Meteor.call('messages.remove', this._id);
  },

  'click .js-yes' () {
    const text = 'Ja';
    const chatId = FlowRouter.getParam("chatId");

    // Insert a task into the collection
    Meteor.call('messages.insert', text, chatId);
  },

  'click .js-no' () {
    const text = 'Nein';
    const chatId = FlowRouter.getParam("chatId");

    // Insert a task into the collection
    Meteor.call('messages.insert', text, chatId);
  }
});
