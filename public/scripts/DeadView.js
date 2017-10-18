function DeadView(model, elements) {
	this.model = model;
	this.elements = elements;

	//to add listeners to new list items
	this.backBtnSelected = new Event(this);
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
	this.model.uriIncludesTrack.attach((sender, args) => {
		this.trackSelectedFromHash(args);
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
	$('.button__back').click(() => {
		this.backBtnSelected.notify();
	});
	this.elements.$player.find('.player__bar').on('mousedown', this.seek.bind(this));
	this.elements.$audio.on('ended', this.onEnded.bind(this));	
}
DeadView.prototype = {
	addOnLoadedMetadataHandler: function(args) {
		const $audio = this.elements.$audio;
		const $player = this.elements.$player;

		$audio.on('loadedmetadata', onLoadedMetadataHandler);
		this.addOnTimeupdateHandler(args);

		function onLoadedMetadataHandler(e) {
			const year = args.date.year;
			const month = args.date.month.toString().length == 1 ? '0'.concat(args.date.month) : args.date.month;
			const day = args.date.day.toString().length == 1 ? '0'.concat(args.date.day) : args.date.day;

			var m = Math.floor(e.target.duration / 60);
			var s = Math.floor(e.target.duration % 60);
				m.toString();
				s = (s < 10) ? '0'.toString().concat(s) : s;
		
			$player.find('.player__date').html(`${month}-${day}-${year} &mdash; `);
			$player.find('.player__duration').html(`${m}:${s}`);
			$player.find('.player__title').html(args.trackData.title);
			$player.find('.player__venue').html(args.venue);
		}
	},
	addOnTimeupdateHandler: function(args) {
		const $audio = this.elements.$audio;
		const $player = this.elements.$player;

		$audio.on('timeupdate', onTimeupdateHandler);

		function onTimeupdateHandler(e) {
			const elapsed = e.target.currentTime;
			var m = Math.floor(e.target.currentTime / 60);
			var s = Math.floor(e.target.currentTime % 60);
			m.toString();
			s = (s < 10) ? '0'.toString().concat(s) : s;

			this.progressWidth = Math.round(e.target.currentTime * $('.player__bar').width() / e.target.duration) + 'px';

			$player.find('.player__elapsed').html(`${m}:${s}`);
			$player.find('.player__progress').width(this.progressWidth);
		}
	},
	assignTrackSelectListeners: function() {
		$('.list__item--track').click((e) => {
			if (e.target.tagName == 'A') {				
				const trackIndex = this.getElementIndex(e.target.parentElement);
				this.trackSelected.notify(trackIndex);
			}
			else if (e.target.tagName == 'LI') {
				console.log('itsand li');
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
	onEnded: function(e) {
		this.nextBtnSelected.notify();
	},
    seek: function seek(e) {
            var _this5 = this;

            e.preventDefault();
            this.updateTime(e);
            if (e.buttons == 1) {
                    this.elements.$player.find('.player__bar').on('mousemove', function (e) {
                            _this5.updateTime(e);
                            $(window).on('mouseup', function (e) {
                                    _this5.elements.$player.find('.player__bar').off('mousemove');
                            });
                    });
            }
    },
	trackSelectedFromHash: function(hash) {
		this.elements.$list.find('.list__item__link').each((index, item) => {
			if (hash == item.href.match(/\/#\/\d{4}-\d{2}-\d{2}\/(.*)/)[1]) {
				this.trackSelected.notify(index);
			}
		});
	},
    updateTime: function updateTime(e) {
            var player__bar = document.querySelector('.player__bar');
            var boundingRect = player__bar.getBoundingClientRect();
            this.elements.$audio[0].currentTime = Math.round((e.clientX - boundingRect.left) * this.elements.$audio[0].duration / this.elements.$player.find('.player__bar').width());
    },
	unhidePlayer: function() {
		this.elements.$player.removeClass('hidden');
		this.elements.$list.removeClass('no-margin');
	},
	updateList: function(data) {
		if (data.type == 'years' || data.type == 'shows') {
			this.elements.$list.html('');

			data.results.forEach((date) => {
				let $li = $('<li></li>');
				let $a = $('<a></a>');
				$li.addClass('list__item');
				$a.addClass('list__item__link');
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
				let $span = $('<span></span>');
				$li.addClass('list__item list__item--track');
				$a.addClass('list__item__link');
				$a.attr('href', track.href);
				$a.html(track.title);
				$span.html(track.duration);
				$span.addClass('list__item__duration');
				$.extend($a[0], {
					trackData: {
						data_src: track.data_src,
						duration: track.duration,
						title: track.title,
						trackNo: track.track
					}
				});


				$li.append($a);
				$li.append($span);
				this.elements.$list.append($li);
			});
		}
	},
	updatePlayer: function(args) {
		const $audio = this.elements.$audio;
		const $player = this.elements.$player;

		$audio.attr('src', args.trackData.data_src);
		this.addOnLoadedMetadataHandler(args);
	},
	
};