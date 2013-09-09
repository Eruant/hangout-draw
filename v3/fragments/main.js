/*globals window, gapi*/
(function (document) {
    'use strict';
    
    var app = {
        
        options: {
            canvasID: 'drawArea',
            clearID: 'clear',
            sendID: 'send',
            width: 600,
            height: 400
        },
        
        brush: {
            startPosition: false,
            endPosition: false,
            down: false
        },
        
        data: {
            lines: [],
            points: []
        },
        
        init: function () {
            
            // set up the canvas
            this.canvas = document.getElementById(this.options.canvasID);
            this.canvas.width = this.options.width;
            this.canvas.height = this.options.height;
            
            // set up the context
            this.ctx = this.canvas.getContext('2d');
            
            this.events();
        },
        
        mousePosition: function (ev) {
            return {
                x: ev.clientX - this.canvas.offsetLeft,
                y: ev.clientY - this.canvas.offsetTop
            };
        },
        mouseDown: function (ev) {
            this.brush.startPosition = this.mousePosition(ev);
            this.brush.down = true;
            ev.preventDefault();
        },
        mouseUp: function (ev) {
            this.brush.endPosition = this.mousePosition(ev);
            this.brush.down = false;
            this.newStroke();
            ev.preventDefault();
        },
        
        newStroke: function () {
            var xRange = this.brush.startPosition.x - this.brush.endPosition.x,
                yRange = this.brush.startPosition.y - this.brush.endPosition.y,
                range = 5;
            
            if (xRange < range && xRange > -range && yRange < range && yRange > -range) {
                this.data.points.push([this.brush.startPosition.x, this.brush.startPosition.y]);
            } else {
                this.data.lines.push([this.brush.startPosition.x, this.brush.startPosition.y, this.brush.endPosition.x, this.brush.endPosition.y]);
            }
            this.brush.startPosition = false;
            this.brush.endPosition = false;
            
            this.draw();
        },
        
        drawLine: function (startX, startY, endX, endY) {
            
            var ctx = this.ctx;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.closePath();
            ctx.stroke();
        },
        
        drawPoint: function (x, y) {
            
            var ctx = this.ctx;
            
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.stroke();
        },
        
        draw: function () {
            var ctx = this.ctx,
                linesLen = this.data.lines.length,
                pointsLen = this.data.points.length,
                item,
                i;
            
            ctx.clearRect(0, 0, this.options.width, this.options.height);
            
            for (i = 0; i < linesLen; i += 1) {
                item = this.data.lines[i];
                this.drawLine(item[0], item[1], item[2], item[3]);
            }
            
            for (i = 0; i < pointsLen; i += 1) {
                item = this.data.points[i];
                this.drawPoint(item[0], item[1]);
            }
        },
        
        events: function () {
            
            var me = this;
            
            this.canvas.addEventListener('mousedown', this.mouseDown.bind(this), false);
            this.canvas.addEventListener('mouseup', this.mouseUp.bind(this), false);
            
            document.getElementById(this.options.clearID).addEventListener('click', function () {
                me.data = {
                    lines: [],
                    points: []
                };
                me.draw();
            }, false);
            
            document.getElementById(this.options.sendID).addEventListener('click', function () {
                gapi.hangout.data.submitDelta({
                    lines: me.data.lines.join(','),
                    points: me.data.points.join(',')
                });
            }, false);
            
            // listen out for when the shared object changes
            gapi.hangout.data.onStateChanged.add(function () {
                var state = gapi.hangout.data.getState();
                
                me.data = {
                    lines: state.lines.split(','),
                    points: state.points.split(',')
                };
                
                me.draw();
            });
            
        }
        
    };
    
    gapi.hangout.onApiReady.add(function (eventObj) {
        if (eventObj.isApiReady) {
            app.init();
        }
    });
    
    
}(window.document));