//TODO: Convert segments into squares
//      Overlap them
//      Give them color
//      convert movement on y and y also to z 

//      My classes
class vec2{
    constructor(_x=0,_y=0){
        this.x = _x;
        this.y = _y;
        this.isnormalized 
    }
    length(){
        return Math.sqrt((this.x*this.x)+(this.y*this.y));// Satz des Petagruas
    }

    normalize(){
        let scale = this.length();
        this.x /= scale;
        this.y /= scale;
        this.isnormalized = true;
    }
    get is_normalized(){
        return this.isnormalized;
    }
    // Add
    add(_newvec = 0, _newvec2 = 0){
        return new vec2((this.x + _newvec),(this.y + _newvec2));

    }
    add(_newvec){
        if(_newvec instanceof vec2){
            return new vec2((this.x + _newvec.x),(this.y + _newvec.y));
        }
        if(typeof(_newvec) === "number"){
            return new vec2((this.x + _newvec),(this.y + _newvec));
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
        if(typeof(_newvec) === "number"){
            return new vec2((this.x - _newvec),(this.y - _newvec));
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
        if(typeof(_newvec) === "number"){
            return new vec2((this.x * _newvec),(this.y * _newvec));
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
        if(typeof(_newvec) === "number"){
            return new vec2((this.x / _newvec),(this.y / _newvec));
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
            this.a = this.parent.b;
            this.angle = (Math.PI / 180)*_angle + this.parent.angle; // Converts the angle to degrees
            this.len = _len;

               
        }
        else {//First Segment
            this.name = 0;
            this.a = _a;
            //initialize origin
            this.origin = this.a;

            this.angle = -(Math.PI / 180)*_angle; // Converts the angle to degrees
            this.len = _len;
            this.parent = _parent;
        }
        this.calc_b();
        console.log(this);


    }
    //      Methods
    calc_b(){

        this.angChange.x = this.len* Math.cos(this.angle);
        this.angChange.y = this.len* Math.sin(this.angle);
        this.b = this.a.add(this.angChange);
        
    }

    rotate(){
        if(this.angle>45)this.angle += Math.sin(this.angle) * 1.4;
        if(this.angle<135)this.angle += Math.sin(Math.PI*700) * 1.4;
        this.calc_b();
    }

    update(){
        if(this.parent != null){
            this.parent.calc_b();
            this.a = this.parent.b;
            this.angle = this.parent.angle * this.angle;

        }
        this.calc_b();
    }

    
    drawline(ctx){ 
        this.calc_b();
        //ctx.strokeStyle = `rgba(${this.angle*100},${this.angle*100},${this.angle*100},1)`;
        ctx.beginPath();
        ctx.moveTo(this.a.x,this.a.y);
        ctx.lineTo(this.b.x,this.b.y);
        ctx.stroke();

    }

    react_to_mouse(ctx){
        ctx.fillRect(this.origin.x,this.origin.y,5,5);
        if(this.parent == null){
            let dir, placeholder = new vec2(), limit = 60;

            dir = this.a.sub(mouse);//substract multiple vectors to create directional vector
            
            if(this.a.x > mouse.x - limit && this.a.x < mouse.x + limit &&
            this.a.y > mouse.y - limit && this.a.y < mouse.y + limit){
                ctx.strokeStyle = "red";
                dir.normalize();
               // console.log(`B:${this.a.y}, B:${this.a.x}, C:${this.origin.x} B:${this.origin.y}`);
                //i = this.calcDistance(this.a.x,this.a.y,this.origin.x,this.origin.y);
                //if( i <= limit){
        
                console.log(this.a.length()-this.origin.length());

                if(this.origin.length()-this.a.length() <= limit){
                    this.a.x = this.a.x + (limit*dir.x);//move point along circle using directional vetor
                    this.a.y = this.a.y + (limit*dir.y);

                }
                // FIX: IS NEVER CALLED!!!!!
                   this.a.x = 600;
                   this.a.y = 600;
                
                
            }
            // IDEA: USE DIR AS ANGLE FOR FIRST SEGMENT; TO CHECK FOWARD KINEMATIC
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth= 3;
            ctx.arc(mouse.x, mouse.y, limit, 0,  2 * Math.PI);
            ctx.moveTo(this.a.x,this.a.y);
            ctx.lineTo(this.a.x+dir.x,this.a.y+dir.y);
            ctx.stroke();
            ctx.restore();
        }
    }   
}

//       Event Listenrer
addEventListener("load", setup);
addEventListener("resize", update_box);
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
var amount = 3;
var segments = createSegments();
// Mouse Position
var mouse = new vec2(), prev = new vec2();





// My Functions

function createSegments(){
    let vec = new vec2();
    vec = docSize.div(2);
    let segs = [];
    let size = 100;
    let angle = 31.415;
    for(let i = 0; i< amount; i++){
        segs.push(new Segment(vec,angle,size,segs[i-1]));
    }
    return segs;
}

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

function draw(){

    let ctx = setup();
    ctx.clearRect(0,0, docSize.x,docSize.y);
    ctx.strokeStyle = "#3f9f3f";
    ctx.lineWidth = 10;



    for(let i = 0; i < amount; i++){
    segments[i].drawline(ctx);
    segments[i].update();
    segments[i].react_to_mouse(ctx);
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


function update_box(){
    cRect = canvas.getBoundingClientRect(); 
}

