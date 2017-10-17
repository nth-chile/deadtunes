// But the handlers go in the controller

function DeadModel() {
	window.onhashchange = this.selectListItem.bind(this);
	this.currentTrackIndex = -1;
	this.trackList = null;

	this.listItemSelected = new Event(this);
	this.uriIncludesTrack = new Event(this);
	this.trackSelected = new Event(this);
	this.trackChanged = new Event(this);

	this.selectListItem();

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
		if (
			hash.match(/^api\/[\d]{4}-[\d]{2}-[\d]{2}$/)
			|| hash.match(/^api\/[\d]{4}$/)
			|| hash.match(/^api$/)
		) {
			await this.getListData(hash);
			this.listItemSelected.notify(this.data);
		}
		else if (hash.match(/^api\/[\d]{4}-[\d]{2}-[\d]{2}\/(.*)$/)) {
			await this.getListData(hash.slice(0, 14));
			this.listItemSelected.notify(this.data);
			this.uriIncludesTrack.notify(hash.slice(15));

			// this.trackList.forEach((track, index, array) => {
			// 	if (track.title.replace(/\s/g, '_').replace(/\'/g, '') == hash.slice(15)) {
					
			// 	}
			// });

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