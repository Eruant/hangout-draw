/*globals window*/

(function (window, document) {
    'use strict';

	var app = {
        options: {
            canvasID: 'drawArea',
            width: 600,
            height: 400
		},
        init: function () {
            
            // set up the canvas
            this.canvas = document.getElementById(this.options.canvasID);
            
            this.canvas.width = this.options.width;
            this.canvas.height = this.options.height;
            
            // set up the context
            this.ctx = this.canvas.getContext('2d');
            
            // test draw
            this.ctx.fillRect(20, 20, 40, 40);
        }
    };
        
    app.init();

}(window, window.document));