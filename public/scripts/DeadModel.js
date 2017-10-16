function DeadModel() {
	window.onhashchange = this.selectListItem.bind(this);
	this.currentTrackIndex = -1;
	this.trackList = null;

	this.listItemSelected = new Event(this);
	// this.nextBtnSelected = new Event(this);
	// this.playBtnSelected = new Event(this);
	// this.prevBtnSelected = new Event(this);
	this.trackSelected = new Event(this);
	this.trackChanged = new Event(this);

}
DeadModel.prototype = {
	buildTrackList: function(trackList) {
		this.trackList = trackList;
	},
	getListData: function(hash) {
		return $.get(hash).then(res => this.data = res);
	},
	selectListItem: async function() {
		const hash = 'api' + window.location.hash.substr(1);
		if(	hash.match(/^api\/[\d]{4}-[\d]{2}-[\d]{2}$/)
			|| hash.match(/^api\/[\d]{4}-[\d]{2}$/)
			|| hash.match(/^api\/[\d]{4}$/)
			) {
			await this.getListData(hash);
			this.listItemSelected.notify(this.data);
		}
		else {
			// this.updateCurrentTrack(this.data);
			// this.trackSelected.notify(this.currentTrack);
		}
	},
	selectNext: function() {
		this.updateCurrentTrack(this.currentTrack + 1);
	},
	selectPrev: function() {
		this.updateCurrentTrack(this.currentTrack - 1);
	},
	updateCurrentTrack: function(index) {
		if (-1 < index && index < this.trackList.length) this.currentTrack = index;
		else if (index == -1) this.currentTrack = 0;
		this.trackSelected.notify({
			date: this.data.date,
			sourceTitle: this.data.sourceTitle,
			subject: this.data.subject,
			title: this.data.title,
			trackData: this.trackList[this.currentTrack],
			venue: this.data.venue
		});
	}
};