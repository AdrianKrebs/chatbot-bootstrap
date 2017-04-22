import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './message.html';
import './answer_options.html';

Template.message.helpers({
    userIsBot(user) {
    return user == 'bot';
  }
});

Template.message.events({
  'click .delete'() {
    Meteor.call('messages.remove', this._id);
  }
});
