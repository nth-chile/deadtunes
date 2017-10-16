function DeadView(model, elements) {
	this.model = model;
	this.elements = elements

	//to add listeners to new list items
	this.playBtnSelected = new Event(this);
	this.prevBtnSelected = new Event(this);
	this.nextBtnSelected = new Event(this);
	this.trackSelected = new Event(this);

	// Attach model listeners
	this.model.listItemSelected.attach((sender, args) => {
		this.updateList(args);
		this.assignTrackSelectListeners();
	});
	this.model.trackSelected.attach((sender, args) => {
		this.unhidePlayer();
		this.updatePlayer(args);
	});

	// Attach listeners to DOM
	this.elements.$button__play.click(() => {
		this.playBtnSelected.notify()
	});
	this.elements.$button__prev.click(() => {
		this.prevBtnSelected.notify();
	});
	this.elements.$button__next.click(() => {
		this.nextBtnSelected.notify();
	});
	
}
DeadView.prototype = {
	assignTrackSelectListeners: function() {
		$('.list__item--track').click((e) => {
			if (e.target.tagName == 'A') {				
				const trackIndex = this.getElementIndex(e.target.parentElement);
				this.trackSelected.notify(trackIndex);
			}
			else if (e.target.tagName == 'LI') {
				const trackIndex = this.getElementIndex(e.target);
				this.trackSelected.notify(trackIndex);
			}
			else {
				console.log('Error: Event.target.tagName is neither "A" nor "LI".');
			}
		});
	},
	getElementIndex: function(node) {
	    var index = 0;
	    while ( (node = node.previousElementSibling) ) {
	        index++;
	    }
	    return index;
	},
	unhidePlayer: function() {
		this.elements.$player.removeClass('hidden');
	},
	updateList: function(data) {
		if (data.type == 'years' || data.type == 'shows') {
			this.elements.$list.html('');

			data.results.forEach((date) => {
				let $li = $('<li></li>');
				let $a = $('<a></a>');
				$li.addClass('list__item');
				$a.attr('href', date.href);
				$a.html(date.text);

				$li.append($a);
				this.elements.$list.append($li);
			});

		}

		// USING FIRST SOURCE
		//else if (data.type == 'tracks') {
		else if(data.type == 'sources') {
			this.elements.$list.html('');

			data.results[0].forEach((track) => {
				let $li = $('<li></li>');
				let $a = $('<a></a>');
				$li.addClass('list__item list__item--track');
				$a.attr('href', track.href);
				$a.html(track.title);
				$.extend($a[0], {
					trackData: {
						data_src: track.data_src,
						duration: track.duration,
						title: track.title,
						trackNo: track.track
					}
				});

				$li.append($a);
				this.elements.$list.append($li);
			});
		}
	},
	updatePlayer: function(args) {
		const $audio = this.elements.$audio;
		const $player = this.elements.$player;
		$audio.attr('src', args.trackData.data_src);

		$audio.on('loadedmetadata', onLoadedMetadataHandler);

		function onLoadedMetadataHandler(e) {
			const year = args.date.year;
			const month = args.date.month.toString().length == 1 ? '0'.concat(args.date.month) : args.date.month;
			const day = args.date.day.toString().length == 1 ? '0'.concat(args.date.day) : args.date.day;

			var m = Math.floor(e.target.duration / 60);
			var s = Math.floor(e.target.duration % 60);
				m.toString();
				s = (s < 10) ? '0'.toString().concat(s) : s;

			$player.find('.player__date').html(`${month}-${day}-${year}`);
			$player.find('.player__duration').html(`${m}:${s}`);
			$player.find('.player__title').html(args.trackData.title);
			$player.find('.player__venue').html(args.venue);
			$audio.on('timeupdate', onTimeupdateHandler);
		}
		function onTimeupdateHandler(e) {
			const elapsed = e.target.currentTime;
			var m = Math.floor(e.target.currentTime / 60);
			var s = Math.floor(e.target.currentTime % 60);
			m.toString();
			s = (s < 10) ? '0'.toString().concat(s) : s;

			$player.find('.player__elapsed').html(`${m}:${s}`);
		}
	}
	
};