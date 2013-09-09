window.requestAnimFrame = (function (callback) {
    'use strict';
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 30);
    };
}());

(function () {

    var app = {
        
        options: {
            canvasID: 'drawArea',
            width: 600,
            height: 400
		},
        
        pen: {
            x: 0,
            y: 0,
            prevX: 0,
            prevY: 0,
            down: false
        },

        init: function () {
            
            // set up the canvas
            this.canvas = document.getElementById(this.options.canvasID);
            this.canvas.width = this.options.width;
            this.canvas.height = this.options.height;
            
            // set up the context
            this.ctx = this.canvas.getContext('2d');
            
            this.events();
            this.loop();
        },
        
        clear: function () {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        
        mousePosition: function (ev) {
            this.pen.prevX = ev.clientX - this.canvas.offsetLeft;
            this.pen.prevY = ev.clientY - this.canvas.offsetTop;
        },
        mouseDown: function (ev) {
            this.mousePosition(ev);
            this.pen.down = true;
            ev.preventDefault();
        },
        mouseUp: function (ev) {
            this.pen.down = false;
            ev.preventDefault();
        },
        mouseMove: function (ev) {
            this.pen.x = ev.clientX - this.canvas.offsetLeft;
            this.pen.y = ev.clientY - this.canvas.offsetTop;
        },
        
        draw: function () {
            
            var pen = this.pen,
                ctx = this.ctx;

            if (pen.down) {
                ctx.save();
                ctx.beginPath();
                if (pen.prevX > 0 && pen.prevY > 0) {
                    ctx.moveTo(pen.prevX, pen.prevY);
                }
                ctx.lineTo(pen.x, pen.y);
                ctx.closePath();
                ctx.stroke();
                ctx.restore();
                
                pen.prevX = pen.x;
                pen.prevY = pen.y;
            }
        },
        
        loop: function () {
            this.update();
            this.draw();
            window.requestAnimationFrame(this.loop.bind(this));
        },

        events: function () {

            var btn = document.getElementById('submit');
            
            this.canvas.addEventListener('mousedown', this.mouseDown.bind(this), false);
            this.canvas.addEventListener('mouseup', this.mouseUp.bind(this), false);
            this.canvas.addEventListener('mousemove', this.mouseMove.bind(this), false);

            btn.addEventListener('click', function () {
                console.log('Button pressed');
                value = this.ctx.getImageData(0, 0, this.options.width, this.options.height);

                gapi.hangout.data.submitDelta({
                    img: value
                });
            });
            
            // listen out for when the shared object changes
            gapi.hangout.data.onStateChanged.add(function () {
                var state = gapi.hangout.data.getState();
                console.log(state);
            });

        }

    };

    gapi.hangout.onApiReady.add(function (eventObj) {
        if (eventObj.isApiReady) {
            app.init();
        }
    });


}());
