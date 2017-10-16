function DeadController(model, view) {
	this.model = model;
	this.view = view;
	this.audio = this.view.elements.$audio;
	this.playBtn = this.view.elements.$button__play;

	// Attach view handlers
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
	},
};