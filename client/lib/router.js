

FlowRouter.route('/', {
    action: function () {
        BlazeLayout.render("mainlayout", {main: "newchat"});
    }
});

FlowRouter.route('/chat', {
    action: function (params, queryParams) {
        BlazeLayout.render("mainlayout", {main: "newchat"});
    }
});

FlowRouter.route('/chat/:chatId', {
    action: function (params, queryParams) {
        BlazeLayout.render("mainlayout", {main: "chat"});
    }
});

FlowRouter.route('/tracking', {
    action: function () {
        BlazeLayout.render("mainlayout", {main: "tracking"});
    }
});

FlowRouter.route('/tracking/:chatId', {
    action: function () {
        BlazeLayout.render("mainlayout", {main: "tracking"});
    }
});

