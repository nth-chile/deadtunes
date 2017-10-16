$(document).ready(function() {

const model = new DeadModel();
const view = new DeadView(model, {
			'$audio': $('audio'),
			'$button__next': $('.button__next'),
			'$button__play': $('.button__play'),
			'$button__prev': $('.button__prev'),
			'$list': $('.list'),
			'$player': $('.player')
		});
const controller = new DeadController(model, view);


});