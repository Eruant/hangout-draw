/*globals window, gapi, YT*/

/** Standard requestAnimFrame from paulirish.com, running 30 fps */
window.requestAnimFrame = (function (callback) {
    'use strict';
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 30);
    };
}());


(function (document) {
    'use strict';
    
    var app = {
        
        /**
         * @cfg {Object} options
         * *ID		= id's for elements on page
         * width	= width of canvas / player element
         * height	= height of canvas /player element
         * colors	= object of colours used in this project
         */
        options: {
            canvasID: 'drawArea',
            videoID: 'videoArea',
            clearID: 'clear',
            sendID: 'send',
            width: 600,
            height: 365,
            colors: {
                blue: 'rgb(51, 102, 255)',
                transparentBlue: 'rgba(51, 102, 255, 0.4)'
            }
        },
        
        /**
         * {Object} brush - used for tracking the mouse position, and when to draw icons
         */
        brush: {
            startPosition: false,
            endPosition: false,
            currentPosition: false,
            down: false
        },
        
        /**
         * {Object} data - stores the points added to the screen
         */
        data: {
            lines: [],
            points: []
        },
        
        /**
         * @method init - kicks off the process
         */
        init: function () {
            
            // set up the canvas
            this.canvas = document.getElementById(this.options.canvasID);
            this.canvas.width = this.options.width;
            this.canvas.height = this.options.height;
            
            // set up the context
            this.ctx = this.canvas.getContext('2d');
            this.ctx.translate(-5, -5);
            
            // create a gradient effect for painting with later
            this.gradient = this.ctx.createLinearGradient(0, 0, 30, 0);
            this.gradient.addColorStop('0', this.options.colors.blue);
            this.gradient.addColorStop('1', this.options.colors.transparentBlue);
            
            // load the video
            this.setupVideo();
            
            this.events();	// add event listeners
            this.loop();	// kicks off the animation loop
        },
        
        setupVideo: function () {
            var me = this,
                firstScriptTag = document.getElementsByTagName('script')[0],
                tag = document.createElement('script');
            
            // add the api to the page
            tag.src = '//www.youtube.com/iframe_api';
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = function () {
                me.player = new YT.Player('videoArea', {
                    width: '600',
                    height: '400',
                    videoId: '6vF8tC3Hue0',
                    playerVars: {
                        controls: 1,
                        info: 0,
                        autoplay: 0
                    },
                    events: {
                        'onReady': me.videoReady,
                        'onStateChange': me.videoStateChange
                    }
                });
                
                
            };
        },
        
        videoReady: function (ev) {
        },
        
        videoSeek: function (x) {
            this.player.pauseVideo().seekTo(x, true);
        },
        
        videoStateChange: function (ev) {
            //console.log('videoStateChange', ev);
        },
        
        /**
         * @method mousePosition - returns the mouse position relative to the top left of the canvas
         * @returns {Object}
         */
        mousePosition: function (ev) {
            return {
                x: ev.clientX - this.canvas.offsetLeft,
                y: ev.clientY - this.canvas.offsetTop
            };
        },
        
        /**
         * @medthod mouseDown - logs the starting position of the mouse and sets a painting flag
         */
        mouseDown: function (ev) {
            this.brush.startPosition = this.mousePosition(ev);
            this.brush.down = true;
            ev.preventDefault();
        },
        
        /**
         * @method mouseUp - logs the end position of the mouse, removes the painting flag and requests a new drawing object
         */
        mouseUp: function (ev) {
            this.brush.endPosition = this.mousePosition(ev);
            this.brush.down = false;
            this.newStroke();
            ev.preventDefault();
        },
        
        /**
         * @method mouseMove - sets the current position of the brush
         */
        mouseMove: function (ev) {
            this.brush.currentPosition = this.mousePosition(ev);
        },
        
        /**
         * @method newStroke - adds either a point or line to the data object
         */
        newStroke: function () {
            var me = this,
                xRange = this.brush.startPosition.x - this.brush.endPosition.x,
                yRange = this.brush.startPosition.y - this.brush.endPosition.y,
                range = 5;
            
            if (xRange < range && xRange > -range && yRange < range && yRange > -range) {
                // add [x, y, rotation, startingFrame]
                this.data.points.push([this.brush.startPosition.x, this.brush.startPosition.y, 0, 0]);
            } else {
                this.data.lines.push([this.brush.startPosition.x, this.brush.startPosition.y, this.brush.endPosition.x, this.brush.endPosition.y]);
            }
            
            this.brush.startPosition = false;
            this.brush.endPosition = false;
                
        },
        
        /**
         * @method drawLine - paints a line on the canvas
         */
        drawLine: function (startX, startY, endX, endY) {
            
            var ctx = this.ctx;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.closePath();
            ctx.stroke();
        },
        
        /**
         * @method drawArrow - paints an arrow on the canvas
         */
        drawArrow: function (startX, startY, endX, endY) {
            
            var ctx = this.ctx,
                headLen = 10,
                angle = Math.atan2(endY - startY, endX - startX);
            
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.closePath();
            ctx.stroke();
            
            ctx.beginPath();
            
            ctx.moveTo(endX - headLen * Math.cos(angle - Math.PI / 6), endY - headLen * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(endX, endY);
            ctx.lineTo(endX - headLen * Math.cos(angle + Math.PI / 6), endY - headLen * Math.sin(angle + Math.PI / 6));
            
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        },
        
        /**
         * @method drawPoint - paints a circle on the canvas
         */
        drawPoint: function (x, y, rotation, frameNumber) {
            
            var ctx = this.ctx,
                scale;
            
            ctx.save();
            
            ctx.translate(x, y);
            
            // make the circle appear when first loaded
            if (frameNumber < 30) {
                scale = frameNumber / 30;
                ctx.scale(scale, scale * 0.4);
            } else {
                ctx.scale(1, 0.4);
            }
            
            // adds the animation of the gradient
            ctx.rotate(rotation);
            
            ctx.beginPath();
            ctx.arc(0, 0, 40, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        },
        
        /**
         * @method update - adds any logic needed before rendering each frame
         */
        update: function () {
        },
        
        /**
         * @method draw - takes the data object and draws it to the canvas
         */
        draw: function () {
            var ctx = this.ctx,
                linesLen = this.data.lines.length,
                pointsLen = this.data.points.length,
                item,
                i;
            
            ctx.clearRect(0, 0, this.options.width, this.options.height);
            ctx.strokeStyle = this.options.colors.blue;
            ctx.lineWidth = 7;
            
            for (i = 0; i < linesLen; i += 1) {
                item = this.data.lines[i];
                this.drawArrow(item[0], item[1], item[2], item[3]);
            }
            
            ctx.strokeStyle = this.gradient;
            for (i = 0; i < pointsLen; i += 1) {
                item = this.data.points[i];
                this.drawPoint(item[0], item[1], item[2], item[3]);
                
                if (item[2] > 6.29) {
                    item[2] -= (Math.PI * 2);
                }
                item[2] += 3 * (Math.PI / 180);
                if (item[3] < 30) {
                    item[3] += 3;
                }
            }
            
            if (this.brush.down) {
                ctx.beginPath();
                ctx.moveTo(this.brush.startPosition.x, this.brush.startPosition.y);
                ctx.lineTo(this.brush.currentPosition.x, this.brush.currentPosition.y);
                ctx.closePath();
                ctx.strokeStyle = this.options.colors.transparentBlue;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        },
        
        /**
         * @method loop - calls itself when the browser is ready to update the screen
         */
        loop: function () {
            this.update();
            this.draw();
            window.requestAnimationFrame(this.loop.bind(this));
        },
        
        /**
         * @method events - creates event listeners to trigger actions
         */
        events: function () {
            
            var me = this;
            
            this.canvas.addEventListener('mousedown', this.mouseDown.bind(this), false);
            this.canvas.addEventListener('mouseup', this.mouseUp.bind(this), false);
            this.canvas.addEventListener('mousemove', this.mouseMove.bind(this), false);
            
            document.getElementById(this.options.clearID).addEventListener('click', function () {
                me.data = {
                    lines: [],
                    points: []
                };
                //me.draw();
            }, false);
            
            document.getElementById(this.options.sendID).addEventListener('click', function () {

                var lines = me.data.lines,
                    linesLen = lines.length,
                    points = me.data.points,
                    pointsLen = points.length,
                    i,
                    linesStr = '',
                    pointsStr = '',
                    videoSeek = false;
                
                for (i = 0; i < linesLen; i += 1) {
                    if (i !== 0) {
                        linesStr += '|';
                    }
                    
                    linesStr += lines[i].join(',');
                }
                
                for (i = 0; i < pointsLen; i += 1) {
                    if (i !== 0) {
                        pointsStr += '|';
                    }
                    
                    pointsStr += points[i].join(',');
                }
                
                videoSeek = me.player.getCurrentTime();
                
                gapi.hangout.data.submitDelta({
                    lines: linesStr,
                    points: pointsStr,
                    videoSeek: videoSeek.toString()
                });

            }, false);
            
            // listen out for when the shared object changes
            gapi.hangout.data.onStateChanged.add(function () {
                var state, linesArray, len, pointsArray, i, j, lines, points, items, itemsLen;
                
                state = gapi.hangout.data.getState();
                
                if (state.lines && state.points) {
                
                    linesArray = state.lines.split('|');
                    len = linesArray.length;
                    pointsArray = state.points.split('|');
                    lines = [];
                    points = [];
                    
                    for (i = 0; i < len; i += 1) {
                        items = linesArray[i].split(',');
                        itemsLen = items.length;
                        for (j = 0; j < itemsLen; j += 1) {
                            items[j] = parseInt(items[j], 10);
                        }
                        lines.push(items);
                    }
                    
                    len = pointsArray.length;
                    for (i = 0; i < len; i += 1) {
                        items = pointsArray[i].split(',');
                        itemsLen = items.length;
                        for (j = 0; j < itemsLen; j += 1) {
                            items[j] = parseInt(items[j], 10);
                        }
                        points.push(items);
                    }
                    
                    me.data = {
                        lines: lines,
                        points: points
                    };
                    
                    alert(state.videoSeek);
                    me.videoSeek(parseInt(state.videoSeek, 10));
                    
                }
            });
            
        }
        
    };
    
    /**
     * Kicks off the hangout when ready
     */
    gapi.hangout.onApiReady.add(function (eventObj) {
        if (eventObj.isApiReady) {
            app.init();
        }
    });
    
    
}(window.document));