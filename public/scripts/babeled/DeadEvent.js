"use strict";

function Event(sender) {
	this.sender = sender;
	this.listeners = [];
}

Event.prototype = {

	attach: function attach(listener) {
		this.listeners.push(listener);
	},

	notify: function notify(args) {
		var index;

		for (index = 0; index < this.listeners.length; index++) {
			this.listeners[index](this.sender, args);
		}
	}

};