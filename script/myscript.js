//      My classes
class vec2{
    constructor(_x=0,_y=0){
        this.x = _x;
        this.y = _y;
    }
    length(){
        return Math.sqrt((this.x*this.x)+(this.y*this.y));// Satz des Petagruas
    }
    lengths(_v){
        let a =_v;
        return Math.sqrt(((a.x*a.x)-(this.x*this.x))+((a.y*a.y)-(this.y*this.y)));// Satz des Petagruas
    }
    normalize(){
        let scale = this.length();
        this.x /= scale;
        this.y /= scale;
    }
    // Add
    add(_newvec = 0, _newvec2 = 0){
        return new vec2((this.x + _newvec),(this.y + _newvec2));

    }
    add(_newvec){
        if(_newvec instanceof vec2){
            return new vec2((this.x + _newvec.x),(this.y + _newvec.y));
        }
    }
    // Subtract
    sub(_newvec = 0, _newvec2 = 0){
        return new vec2((this.x - _newvec),(this.y - _newvec2));
    
    }
    sub(_newvec){
        if(_newvec instanceof vec2){
            return new vec2((this.x - _newvec.x),(this.y - _newvec.y));
        }
    }
    // Multiply
    dot(_newvec = 0, _newvec2 = 0){
        return new vec2((this.x * _newvec),(this.y * _newvec2));
    
    }
    dot(_newvec){
        if(_newvec instanceof vec2){
            return new vec2((this.x * _newvec.x),(this.y * _newvec.y));
        }
    }
    // Divide
    div(_newvec = 0, _newvec2 = 0){
        return new vec2((this.x / _newvec),(this.y / _newvec2));
    }
    div(_newvec){
        if(_newvec instanceof vec2){
            return new vec2((this.x / _newvec.x),(this.y / _newvec.y));
        }
    }
    
}

class Segment{
    	origin = new vec2();
        angChange = new vec2();
        b = new vec2();
        a = new vec2(0,0);
        
        /** 
        @param {vec2} _a - the vector
        */
    constructor(_a = new vec2(0,0), _angle = 90, _len = 100, _parent = null){

        if (_parent instanceof Segment){ //Following Segments
            this.parent = _parent;     
            this.name = this.parent.name +1;
            this.a.x = this.parent.b.x;
            this.a.y = this.parent.b.y;
            this.angle = -(Math.PI / 180)*_angle + this.parent.angle; // Converts the angle to degrees
            this.len = _len;

               
        }
        else {//First Segment
            this.name = 0;
            this.a.x = _a.x;
            this.a.y = _a.y;
            //initialize origin
            this.origin = this.a;

            this.angle = -(Math.PI / 180)*_angle; // Converts the angle to degrees
            this.len = _len;
            this.parent = _parent;
        }
        this.calcBfromAngle();


    }
    //      Methods
    calcBfromAngle(){

        this.angChange.x = this.len* Math.cos(this.angle);
        this.angChange.y = this.len* Math.sin(this.angle);
        this.b.x = this.a.x + this.angChange.x;
        this.b.y = this.a.y + this.angChange.y;

    }

    rotate(){
        this.angle += Math.sin(this.angle) * 1;
        this.calcBfromAngle();
    }

    update(){
        if(this.parent != null){
            this.parent.calcBfromAngle();
            this.a.x = this.parent.b.x;
            this.a.y = this.parent.b.y;
            //this.angle = this.parent.angle;

        }
        this.calcBfromAngle();
    }

    
    drawline(ctx){ 
        this.calcBfromAngle();
        ctx.beginPath();
        ctx.moveTo(this.a.x,this.a.y);
        ctx.lineTo(this.b.x,this.b.y);
        ctx.stroke();

    }

    reactToMouse(ctx){
        ctx.fillRect(this.origin.x,this.origin.y,5,5);
        if(this.parent == null){
            let vec = new vec2(), placeholder, limit = 60;

            vec.x = this.a.x-mouse.x;
            vec.y= this.a.y-mouse.y;
            
            if(this.a.x > mouse.x - limit && this.a.x < mouse.x + limit &&
            this.a.y > mouse.y - limit && this.a.y < mouse.y + limit){
                ctx.strokeStyle = "red";
                vec.normalize();
               // console.log(`B:${this.a.y}, B:${this.a.x}, C:${this.origin.x} B:${this.origin.y}`);
                //i = this.calcDistance(this.a.x,this.a.y,this.origin.x,this.origin.y);
                //if( i <= limit){
                placeholder = this.origin;

                if(this.a.lengths(placeholder) < limit){


                
                    this.a.x = placeholder.x + (limit *vec.x);
                    this.a.y = placeholder.y + (limit *vec.y);
                }

                else{
                   this.a.x = this.origin.x;
                   this.a.y = this.origin.y;
                }
                
            }
            
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, limit, 0,  2 * Math.PI);
            ctx.moveTo(this.a.x,this.a.y);
            ctx.lineTo(this.a.x+vec.x,this.a.y+vec.y);
            ctx.stroke();
    
        }
    }   
    
    //      Setter 
    set Angle(_angle){
        this.angle = (-(Math.PI / 180)*_angle); // Converts the angle to degrees
    } 
    set A(_a){
        this.a = _a;
    } 
    set Length(_len){
        this.len = _len;
    } 
}

//       Event Listenrer
addEventListener("load", setup);
addEventListener("resize", updateBox);
document.onmousemove = function(e){ // get mouse position
    mouse.x = e.clientX-cRect.left;
    mouse.y = e.clientY-cRect.top;
}

// Loop
setInterval(draw,20);


// My constants
const canvas = document.getElementById('canvas'); // canvas
const docSize  = new vec2(canvas.width, canvas.height);//easier Access to width and height of the canvas

// My variables
let cRect = canvas.getBoundingClientRect();

//Segment Setup
var amount = 8;
var segments = createSegments();
// Mouse Position
var mouse = new vec2(), prev = new vec2();





// My Functions

function setup() {
    if (!canvas.getContext) {
        return;
    }
    canvas.style.width = docSize.x;
    canvas.style.height = docSize.y;
    // get the context

    let ctx = canvas.getContext('2d');
    return ctx ;

}

function createSegments(){
    let vec = new vec2();
    vec = docSize.div(new vec2(2,2));

    let segs = [];
    let size = 100;
    let angle = 10;
    for(let i = 0; i<= amount; i++){
        segs.push(new Segment(vec,angle,(size),segs[i-1]));
    }
    return segs;
}

function draw(){

    let ctx = setup();
    ctx.clearRect(0,0, docSize.x,docSize.y);
    ctx.strokeStyle = "#3f9f3f";
    ctx.lineWidth = 10;



    for(let i = 0; i<= amount; i++){
    segments[i].drawline(ctx);
    segments[i].update();
    segments[0].reactToMouse(ctx);
    segments[i].rotate();
    }
   // console.log(segments);
    /*//DRAWING ON THE CANVAS
    ctx.save();
    ctx.strokeStyle = "#346723";
    ctx.strokeWidth = 5;

    ctx.beginPath();
    ctx.moveTo(prevX,prevY);
    ctx.lineTo(mouse.x,mouse.y);
    ctx.stroke();
    prevX = mouse.x;
    prevY = mouse.y  
    ctx.restore();
    */
}


function updateBox(){
    cRect = canvas.getBoundingClientRect(); 
}

