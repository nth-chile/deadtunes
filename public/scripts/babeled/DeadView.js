'use strict';

function DeadView(model, elements) {
	var _this = this;

	this.model = model;
	this.elements = elements;

	//to add listeners to new list items
	this.backBtnSelected = new Event(this);
	this.playBtnSelected = new Event(this);
	this.prevBtnSelected = new Event(this);
	this.nextBtnSelected = new Event(this);
	this.trackSelected = new Event(this);

	// Attach model listeners
	this.model.listItemSelected.attach(function (sender, args) {
		_this.updateList(args);
		_this.assignTrackSelectListeners();
	});
	this.model.trackSelected.attach(function (sender, args) {
		_this.unhidePlayer();
		_this.updatePlayer(args);
	});
	this.model.uriIncludesTrack.attach(function (sender, args) {
		_this.trackSelectedFromHash(args);
	});

	// Attach listeners to DOM
	this.elements.$button__play.click(function () {
		_this.playBtnSelected.notify();
	});
	this.elements.$button__prev.click(function () {
		_this.prevBtnSelected.notify();
	});
	this.elements.$button__next.click(function () {
		_this.nextBtnSelected.notify();
	});
	$('.button__back').click(function () {
		_this.backBtnSelected.notify();
	});
	this.elements.$player.find('.player__bar').on('click mousemove', this.seek.bind(this));
	this.elements.$audio.on('ended', this.onEnded.bind(this));
}
DeadView.prototype = {
	addOnLoadedMetadataHandler: function addOnLoadedMetadataHandler(args) {
		var $audio = this.elements.$audio;
		var $player = this.elements.$player;

		$audio.on('loadedmetadata', onLoadedMetadataHandler);
		this.addOnTimeupdateHandler(args);

		function onLoadedMetadataHandler(e) {
			var year = args.date.year;
			var month = args.date.month.toString().length == 1 ? '0'.concat(args.date.month) : args.date.month;
			var day = args.date.day.toString().length == 1 ? '0'.concat(args.date.day) : args.date.day;

			var m = Math.floor(e.target.duration / 60);
			var s = Math.floor(e.target.duration % 60);
			m.toString();
			s = s < 10 ? '0'.toString().concat(s) : s;

			$player.find('.player__date').html(month + '-' + day + '-' + year + ' &mdash; ');
			$player.find('.player__duration').html(m + ':' + s);
			$player.find('.player__title').html(args.trackData.title);
			$player.find('.player__venue').html(args.venue);
		}
	},
	addOnTimeupdateHandler: function addOnTimeupdateHandler(args) {
		var $audio = this.elements.$audio;
		var $player = this.elements.$player;

		$audio.on('timeupdate', onTimeupdateHandler);

		function onTimeupdateHandler(e) {
			var elapsed = e.target.currentTime;
			var m = Math.floor(e.target.currentTime / 60);
			var s = Math.floor(e.target.currentTime % 60);
			m.toString();
			s = s < 10 ? '0'.toString().concat(s) : s;

			this.progressWidth = Math.round(e.target.currentTime * $('.player__bar').width() / e.target.duration) + 'px';

			$player.find('.player__elapsed').html(m + ':' + s);
			$player.find('.player__progress').width(this.progressWidth);
		}
	},
	assignTrackSelectListeners: function assignTrackSelectListeners() {
		var _this2 = this;

		$('.list__item--track').click(function (e) {
			if (e.target.tagName == 'A') {
				var trackIndex = _this2.getElementIndex(e.target.parentElement);
				_this2.trackSelected.notify(trackIndex);
			} else if (e.target.tagName == 'LI') {
				console.log('itsand li');
				var _trackIndex = _this2.getElementIndex(e.target);
				_this2.trackSelected.notify(_trackIndex);
			} else {
				console.log('Error: Event.target.tagName is neither "A" nor "LI".');
			}
		});
	},
	getElementIndex: function getElementIndex(node) {
		var index = 0;
		while (node = node.previousElementSibling) {
			index++;
		}
		return index;
	},
	onEnded: function onEnded(e) {
		this.nextBtnSelected.notify();
	},
	seek: function seek(e) {
		if (e.which != 0) {
			var player__bar = document.querySelector('.player__bar');
			var boundingRect = player__bar.getBoundingClientRect();
			this.elements.$audio[0].currentTime = Math.round((e.clientX - boundingRect.left) * this.elements.$audio[0].duration / this.elements.$player.find('.player__bar').width());
		}
	},
	trackSelectedFromHash: function trackSelectedFromHash(hash) {
		var _this3 = this;

		this.elements.$list.find('.list__item__link').each(function (index, item) {
			if (hash == item.href.slice(35)) {
				_this3.trackSelected.notify(index);
			}
		});
	},
	updateTime: function updateTime(e) {
		var bar = document.querySelector('.player__bar');
		var rect = bar.getBoundingClientRect();
		this.elements.$audio.currentTime = Math.round((e.clientX - rect.left) * audio.duration / $('.player__bar').width());
	},
	unhidePlayer: function unhidePlayer() {
		this.elements.$player.removeClass('hidden');
		this.elements.$list.removeClass('no-margin');
	},
	updateList: function updateList(data) {
		var _this4 = this;

		if (data.type == 'years' || data.type == 'shows') {
			this.elements.$list.html('');

			data.results.forEach(function (date) {
				var $li = $('<li></li>');
				var $a = $('<a></a>');
				$li.addClass('list__item');
				$a.addClass('list__item__link');
				$a.attr('href', date.href);
				$a.html(date.text);

				$li.append($a);
				_this4.elements.$list.append($li);
			});
		}

		// USING FIRST SOURCE
		//else if (data.type == 'tracks') {
		else if (data.type == 'sources') {
				this.elements.$list.html('');

				data.results[0].forEach(function (track) {
					var $li = $('<li></li>');
					var $a = $('<a></a>');
					var $span = $('<span></span>');
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
					_this4.elements.$list.append($li);
				});
			}
	},
	updatePlayer: function updatePlayer(args) {
		var $audio = this.elements.$audio;
		var $player = this.elements.$player;

		$audio.attr('src', args.trackData.data_src);
		this.addOnLoadedMetadataHandler(args);
	}

};