
//var Orbular = (function(){

    // --------------------------------------------------------------------- //
    // Setup
    // --------------------------------------------------------------------- //

    var canvas = document.getElementById('regions');
    var ctx = canvas.getContext('2d');
    var supportsTouch = ('createTouch' in document);

    var cWidth = 900;
    var cHeight = 600;

    canvas.width = cWidth;
    canvas.height = cHeight;

    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                  window.setTimeout(callback, 1000 / fps);
              };
    })();

    // --------------------------------------------------------------------- //
    // Objects
    // --------------------------------------------------------------------- //

    var Point = function(x,y) {
        this.x;
        this.y;
        this.width = 12;
        this.height = 12;
        this.color = "#222222"
    };

    Point.prototype = {
    
        getEdges : function() {
            this.left = this.x - (this.width / 2);
            this.right = this.left + this.width;
            this.top = this.y - (this.height / 2);
            this.bottom = this.top + this.height;
        },
    
        // on move update
        update : function() {
            this.getEdges();
        },

        draw : function() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.left, this.top, this.width, this.height);
        }
    
    };

    // collection of points
    var Region = function(){
        this.points = [];
    };

    Region.prototype = {
    
    
    
    };

    // --------------------------------------------------------------------- //
    // Helpers
    // --------------------------------------------------------------------- //

    var helpers = {
    
        // get the x and y pos, normalized by getOffset
        getPos : function (event) {
            var mouseX = event.pageX - helpers.getOffSet(event.target).left,
                mouseY = event.pageY - helpers.getOffSet(event.target).top;

            return {
                x: mouseX,
                y: mouseY
            };
        },
    
        //from quirksmode.org. Modified slightly to return obj
        getOffSet : function(obj) {
            var pointLeft = pointTop = 0;
            if (obj.offsetParent) {
                do {
                    pointLeft += obj.offsetLeft;
                    pointTop += obj.offsetTop;
                } 
                while (obj = obj.offsetParent);

                return { 
                    left: pointLeft,
                    top: pointTop
                };
            }
        }
    
    };

    // --------------------------------------------------------------------- //
    // Event Handlers
    // --------------------------------------------------------------------- //
    
    var drag = false;
    
    // store a reference 
    var selectedPoint;
    
    var handlers = {
        
        onPress : function(event){
            
            // to get rid of text cursor
            event.preventDefault(); 
            
            var cursorEvent = supportsTouch ? event.touches[0] : event;
            
            // get mouse pos
            var pos = helpers.getPos(cursorEvent);
            
            
            //check to see if over any handles
            for (var i=0; i < handles.length; i++) {
                var point = handles[i];
                var pointLeft = point.left;
                var pointRight = point.right;
                var pointTop = point.top;
                var pointBottom = point.bottom;

                //20 px padding for chubby fingers
                if ( supportsTouch ) {
                    pointLeft -= 20;
                    pointRight += 20;
                    pointTop -= 20;
                    pointBottom += 20;
                }

                //console.log('point.x:',point.x, 'point.y:',point.y)
                if (x >= pointLeft &&
                    x <= pointRight &&
                    y >= pointTop &&
                    y <= pointBottom
                    ) {
                        //over the current handle
                        //console.log('over')
                        //drag = true;
                        selectedPoint = point;

                        document.addEventListener('mouseup', onRelease, false);
                        document.addEventListener('touchend', touchEnd, false);

                        document.addEventListener('mousemove', onMove, false);
                        document.addEventListener('touchmove', touchMove, false);


                        // set move cursor
                        document.body.style.cursor = canvas.style.cursor = 'move';

                }
            
            }
            // if over point, move point
            if ( true ) {
                
            } else {
                // otherwise, new point
                // new Point(pos.x, pos.y)
            }
            
            
        },
        
        onMove : function(event){
            
            var cursorEvent = supportsTouch ? event.touches[0] : event;

            var x = cursorEvent.pageX - getOffSet(canvas).left;
            var y = cursorEvent.pageY - getOffSet(canvas).top;

            if (x > canvas.width) {
                x = canvas.width;
            }
            if (x < 0) {
                x = 0;
            }
            if (y > canvas.height) {
                y = canvas.height;
            }
            if (y < 0) {
                y = 0;
            }

            selectedPoint.x = x;
            selectedPoint.y = y;
            
            
            updateDrawing();
            
        }
        
    }

    // --------------------------------------------------------------------- //
    // Init
    // --------------------------------------------------------------------- //

    var init = function(){
        
        // only update on move?
        /* 
        var animate = function() {
            // request first
            requestAnimFrame( animate );
            // then do the work
            // doWork()
        }
        
        
        animate();
        */
    
    }

    init();

//})();