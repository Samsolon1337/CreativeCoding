    
//      My classes

class vec2{
    constructor(x=0,y=0){
        this.x = x;
        this.y = y;
    }
    length(){
        return Math.sqrt((this.x*this.x)+(this.y*this.y));// Satz des Petagruas
    }
    normalize(){
        let scale = this.length();
        this.x /= scale;
        this.y /= scale;
    }
    // Add
    add(newvec = 0, newvec2 = 0){
        return new vec2((this.x + newvec),(this.y + newvec2));

    }
    add(newvec){
        if(newvec instanceof vec2){
            return new vec2((this.x + newvec.x),(this.y + newvec.y));
        }
    }
    // Subtract
    sub(newvec = 0, newvec2 = 0){
        return new vec2((this.x - newvec),(this.y - newvec2));
    
    }
    sub(newvec){
        if(newvec instanceof vec2){
            return new vec2((this.x - newvec.x),(this.y - newvec.y));
        }
    }
    // Multiply
    dot(newvec = 0, newvec2 = 0){
        return new vec2((this.x * newvec),(this.y * newvec2));
    
    }
    dot(newvec){
        if(newvec instanceof vec2){
            return new vec2((this.x * newvec.x),(this.y * newvec.y));
        }
    }
    // Divide
    div(newvec = 0, newvec2 = 0){
        return new vec2((this.x / newvec),(this.y / newvec2));
    
    }
    div(newvec){
        if(newvec instanceof vec2){
            return new vec2((this.x / newvec.x),(this.y / newvec.y));
        }
    }
    
}

class Segment{
    	start = new vec2();
        angChange = new vec2();
        /** 
        @param {vec2} a
        */
    constructor(a, angle = 90, len = 100, parent){

        if (parent instanceof Segment){ //Following Segments
            this.a.x = parent.bx;
            this.a.y = parent.by;
            this.angle = -(Math.PI / 180)*angle+parent.angle; // Converts the angle to degrees
            this.len = len;
            this.parent = parent;     
               
        }
        else {//First Segment
            this.a = a;

            this.startX = this.ax; //start Position
            this.startY = this.ay

            this.angle = -(Math.PI / 180)*angle; // Converts the angle to degrees
            this.len = len;
            this.parent = parent;
        }
        this.calcBfromAngle();


    }
    //      Methods
    calcBfromAngle(){

        let dx = this.len* Math.cos(this.angle);
        let dy = this.len* Math.sin(this.angle);
        this.bx = this.ax+dx;
        this.by = this.ay+dy;
    }

    rotate(){
        this.angle -= Math.sin(-(Math.PI / 180)*this.angle) * 1;
        this.calcBfromAngle();
    }
    update(){
        if(this.parent != null){
            this.parent.calcBfromAngle();
            this.ax = this.parent.bx;
            this.ay = this.parent.by;
            //this.angle += this.parent.angle;

        }
        this.calcBfromAngle();
    }
    calcDistance(v1x,v1y,v2x,v2y){

        let a = (v2y+1)-v1y;
        let b = (v2x+1)-v1x;
        let c = Math.sqrt(Math.pow(a,2)) + Math.sqrt(Math.pow(b,2));

        console.log(`A:${a}, B:${b}, C:${c}`);

        return c;

    }
    drawline(ctx){ 
        this.calcBfromAngle();
        ctx.beginPath();
        ctx.moveTo(this.ax,this.ay);
        ctx.lineTo(this.bx,this.by);
        ctx.stroke();

    }

    reactToMouse(ctx){
        /*ctx.fillRect(this.startX,this.startY,5,5);
        if(this.parent == null){
            let vecX, vecY, limit = 60,i, scale;
            vecX = this.ax-mouse.x;
            vecY= this.ay-mouse.y;
            
            if(this.ax > mouse.x - limit && this.ax < mouse.x + limit &&
            this.ay > mouse.y - limit && this.ay < mouse.y + limit){
                ctx.strokeStyle = "red";
                console.log(`B:${this.ay}, B:${this.ax}, C:${this.startX} B:${this.startY}`);
                i = this.calcDistance(this.ax,this.ay,this.startX,this.startY);
                //if( i <= limit){
                    scale = i/limit;
                    this.ax = this.startX - (limit +vecX.normalize);
                    this.ay = this.startY + (limit +vecY);
                    console.log(this.ax, this.ay);
                //}
                //if(this.calcDistance(this.ax,this.ay,this.startX,this.startY) > limit){
              //     this.ax = this.startX;
               //     this.ay = this.startY;
                //}
                
            }
            */

            let a = new vec2(2,3);
            let b = new vec2(2,1);
            //let c = a.add(b);
            console.log(a.add(b),a.dot(b),a.sub(b),a.div(b));

            ctx.beginPath();
            //ctx.arc(mouse.x, mouse.y, limit, 0,  2 * Math.PI);
            //ctx.moveTo(this.ax,this.ay);
            //ctx.lineTo(this.ax+vecX,this.ay+vecY);
            ctx.stroke();
        
    }
    
    //      Setter 
    set ang(angle){
        this.angle = (-(Math.PI / 180)*angle); // Converts the angle to degrees
    } 
    set aX(ax){
        this.ax = ax;
    } 
    set aY(ay){
        this.ay = ay;
    }
    set length(len){
        this.len = len;
    } 
}


//       Event Listenrer

addEventListener("load", setup);
addEventListener("resize", updateBox);
document.onmousemove = function(e){ // mouse movement

    mouse.x = e.clientX-cRect.left;
    mouse.y = e.clientY-cRect.top;

}


setInterval(draw,20);



// My constants
const canvas = document.getElementById('canvas'); // canvas
const docSize  = new vec2(canvas.width, canvas.height);//easier Access to width and height of the canvas

// My variables
let cRect = canvas.getBoundingClientRect();

//Segment Setup
let amount = 8;
let segments = createSegments();
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
    //let a = new Vector2(1,2);
    //let b = new Vector2(3,3);
    //console.log(a);

    let ctx = canvas.getContext('2d');
    return ctx ;

}

function createSegments(){
    let vec = docSize;
    let segs = [];
    let size = 100;
    let angle = 10;
    for(let i = 0; i<= amount; i++){
        
        segs.push(new Segment(vec.x,vec.y,angle,(size),segs[i-1]));

    }
    return segs;
}

function draw(){

    let ctx = setup();
    ctx.clearRect(0,0, docSize.x,docSize.y);
    ctx.strokeStyle = "#3f9f3f";
    ctx.lineWidth = 10;



    for(let i = 0; i<= amount; i++){
    //segments[i].drawline(ctx);
    segments[i].update();
    segments[0].reactToMouse(ctx);
    //segments[i].rotate();
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

