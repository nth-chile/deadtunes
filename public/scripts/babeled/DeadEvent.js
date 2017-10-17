function Event(sender) {
        this.sender = sender;
        this.listeners = [];
}

Event.prototype = {

        attach: function (listener) {
                this.listeners.push(listener);
        },

        notify: function (args) {
                var index;

                for (index = 0; index < this.listeners.length; index++) {
                        this.listeners[index](this.sender, args);
                }
        }

};
