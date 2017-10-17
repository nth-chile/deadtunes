$(document).ready(function () {

                        var model = new DeadModel();
                        var view = new DeadView(model, {
                                                '$audio': $('audio'),
                                                '$button__next': $('.button__next'),
                                                '$button__play': $('.button__play'),
                                                '$button__prev': $('.button__prev'),
                                                '$list': $('.list'),
                                                '$player': $('.player')
                        });
                        var controller = new DeadController(model, view);
});