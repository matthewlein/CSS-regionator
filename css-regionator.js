
//var Orbular = (function(){

    // --------------------------------------------------------------------- //
    // Setup
    // --------------------------------------------------------------------- //

    var canvas = document.getElementById('regions');
    var ctx = canvas.getContext('2d');
    var supportsTouch = ('createTouch' in document);

    var cWidth = 500;
    var cHeight = 200;

    canvas.width = cWidth;
    canvas.height = cHeight;
    
    
    var regions = [];
    

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
        this.color = "#222222";
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
            
            var mouseX = event.pageX - helpers.getOffSet(event.target).left;
            var mouseY = event.pageY - helpers.getOffSet(event.target).top;

            return {
                x: mouseX,
                y: mouseY
            };
        },
        
        getPagePos : function(){
            return {
                x: event.pageX,
                y: event.pageY
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
        },
        
        checkForPoints : function(){
            
            for (var i=0; i < regions.length; i++) {
                
                for (var j=0; j < regions[i].points.length; j++) {
                    var point = regions[i].points[j];
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
                            return point;
                    }

                }
            }
            
            return false;
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
            
            selectedPoint = helpers.checkForPoints(pos);
            
            if ( selectedPoint ) {
                //over the current handle
                //console.log('over')
                //drag = true;
                selectedPoint = point;

                // set move cursor
                document.body.style.cursor = canvas.style.cursor = 'move';

            } else {
                // new Point( pos.x,pos.y );
            }
            
            document.addEventListener('mouseup', handlers.onRelease, false);
            //document.addEventListener('touchend', touchEnd, false);
            
            canvas.removeEventListener('mousemove', handlers.onMove);
            document.addEventListener('mousemove', handlers.onPointMove, false);
            //document.addEventListener('touchmove', touchMove, false);
            
            
        },
        
        onMove : function(event) {
            
            var cursorEvent = supportsTouch ? event.touches[0] : event;

            var pos = helpers.getPos(event);
            
            console.log(pos.x, pos.y)
            
            //updateDrawing();
            
        },
        
        onPointMove : function(event) {
            
            var pos = helpers.getPagePos(event);
            console.log(pos.x, pos.y);
            
            if ( selectedPoint ) {
                
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
                
                selectedPoint.x = pos.x;
                selectedPoint.y = pos.y;
                
            }
            
        },
        
        onRelease : function() {
            selectedPoint = null;
            
            document.removeEventListener('mousemove', handlers.onPointMove);
            canvas.addEventListener('mousemove', handlers.onMove, false);
            
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
        
        var region = new Region();
        
        canvas.addEventListener( 'mousedown', handlers.onPress, false );
        canvas.addEventListener( 'mousemove', handlers.onMove, false );
    
    }

    init();

//})();