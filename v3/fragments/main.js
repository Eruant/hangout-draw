/*globals window, gapi*/
(function (document) {
    'use strict';

    var app = {
        
        options: {
            canvasID: 'drawArea',
            clearID: 'clear',
            sendID: 'send',
            width: 300,
            height: 200
		},
        
        pen: {
            x: 0,
            y: 0,
            prevX: 0,
            prevY: 0,
            down: false
        },
        
        paths: [],
        markers: [],

        init: function () {
            
            // set up the canvas
            this.canvas = document.getElementById(this.options.canvasID);
            this.canvas.width = this.options.width;
            this.canvas.height = this.options.height;
            
            // set up the context
            this.ctx = this.canvas.getContext('2d');
            
            this.events();
        },
        
        clear: function () {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        
        clearPoints: function () {
            this.paths = [];
            this.markers = [];
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
            this.pen.x = ev.clientX - this.canvas.offsetLeft;
            this.pen.y = ev.clientY - this.canvas.offsetTop;
            this.pen.down = false;
            this.update();
            ev.preventDefault();
        },
        
        update: function () {
            
            var startX = this.pen.prevX,
                startY = this.pen.prevY,
                endX = this.pen.x,
                endY = this.pen.y,
                range = 3;
            
            if ((endX > startX + range || endX < startX - range) || (endY > startY + range || endY < startY - range)) {
                this.paths.push({ start: [startX, startY], end: [endX, endY]});
            } else {
                this.markers.push([startX, startY]);
            }
        },
        
        draw: function () {
            
            var ctx = this.ctx,
                items,
                item,
                len,
                i;
            
            items = this.markers;
            len = items.lenght;
            for (i = 0; i < len; i += 1) {
                
                item = items[i];
                
                ctx.save();
                ctx.translate(item[i][0], items[i][0]);
                ctx.fillRect(0, 0, 10, 10);
                ctx.restore();
            }
            
            items = this.paths;
            len = items.lenght;
            for (i = 0; i < len; i += 1) {
                item = items[i];
                ctx.moveTo(item[i].start[0], item[i].start[1]);
                ctx.lineTo(item[i].end[0], item[i].end[1]);
            }
        },

        events: function () {

            var me = this,
                send = document.getElementById(this.options.sendID),
                clear = document.getElementById(this.options.clearID);
            
            this.canvas.addEventListener('mousedown', this.mouseDown.bind(this), false);
            this.canvas.addEventListener('mouseup', this.mouseUp.bind(this), false);

            send.addEventListener('click', function () {

                gapi.hangout.data.submitDelta({
                    img: 'data'
                });
            });
            
            clear.addEventListener('click', function () {
            });
            
            // listen out for when the shared object changes
            gapi.hangout.data.onStateChanged.add(function () {
                var state = gapi.hangout.data.getState();
            });

        }

    };

    gapi.hangout.onApiReady.add(function (eventObj) {
        if (eventObj.isApiReady) {
            app.init();
        }
    });


}(window.document));