function DeadController(model, view) {
	this.model = model;
	this.view = view;
	this.audio = this.view.elements.$audio;
	this.playBtn = this.view.elements.$button__play;

	// Attach view handlers
	this.view.backBtnSelected.attach((sender, args) => {
		this.back();
		this.model.trackList = null;
		this.model.selectListItem();
	});
	this.view.playBtnSelected.attach((sender, args) => {
		if (!this.playBtn.hasClass('playing')) this.play();
		else this.pause();
	});
	this.view.prevBtnSelected.attach((sender, args) => {
		this.prev();
	});
	this.view.nextBtnSelected.attach((sender, args) => {
		this.next();
	});
	this.view.trackSelected.attach((sender, args) => {
		if (!this.model.trackList) {
			const listItems = this.view.elements.$list[0].children;
			var trackList = [];
			for (var i = 0; i < listItems.length; i++) {
				trackList.push(listItems[i].children[0].trackData);
			};
			this.model.buildTrackList(trackList);
		}

		this.selectTrack(args);
	});
}
DeadController.prototype = {
	selectTrack: function(index) {
		this.model.updateCurrentTrack(index);
		this.play();
	},
	back: function() {
		const hash = window.location.hash.substr(1);
		if (hash.match(/\/\d{4}-\d{2}-\d{2}\/.+/)) {
			var newHash = hash.match(/\/\d{4}-\d{2}-\d{2}(\/.*)/)[1];
			window.history.pushState({}, '', '#' + hash.slice(0, 11));
		}
		else if (hash.match(/^\/[\d]{4}-[\d]{2}-[\d]{2}$/))
			window.history.pushState({}, '', '#' + hash.slice(0, 5));
		else if (hash.match(/^\/[\d]{4}$/))
			window.history.pushState({}, '', hash.slice(0, 1));
	},
	next: function() {
		this.model.selectNext();
	},
	pause: function() {
		this.audio[0].pause();
		this.playBtn.removeClass('playing');
	},
	play: function() {
		this.audio[0].play();
		this.playBtn.addClass('playing');
	},
	prev: function() {
		this.model.selectPrev();
	}
};