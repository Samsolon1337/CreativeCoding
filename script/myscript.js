//TODO: Convert segments into squares
//      Overlap them
//      Give them color
//      convert movement on y and y also to z 

//      My classes
class vec2{
    constructor(_x=0,_y=0){//Creates Homemade 2D Vector
        this.x = _x;
        this.y = _y;
        this.isnormalized 
    }
    mag(){// returns the Length of an object
        return Math.sqrt((this.x*this.x)+(this.y*this.y));// Satz des Petagruas
    }
    srq_Mag(){//Faster but only for comparisions
        return (this.x*this.x)+(this.y*this.y);
    }
    normalize(){ // returns the length with a value between 0 and 1
        let scale = this.mag();
        this.x /= scale;
        this.y /= scale;
        this.isnormalized = true;
    }
    get is_normalized(){ // returns if the Vector has been normalized yet TECHNICALLY STILL UNSTABLE
        return this.isnormalized;
    }
    // Add
    add(_newvec = 0, _newvec2 = 0){//Adding two vectors
        return new vec2((this.x + _newvec),(this.y + _newvec2));

    }
    add(_newvec){//Adding two vectors
        if(_newvec instanceof vec2){
            return new vec2((this.x + _newvec.x),(this.y + _newvec.y));
        }
        if(typeof(_newvec) === "number"){
            return new vec2((this.x + _newvec),(this.y + _newvec));
         }
    }
    // Subtract
    sub(_newvec = 0, _newvec2 = 0){//substracting two vectors
        return new vec2((this.x - _newvec),(this.y - _newvec2));
    
    }
    sub(_newvec){//substracting two vectors
        if(_newvec instanceof vec2){
            return new vec2((this.x - _newvec.x),(this.y - _newvec.y));
        }
        if(typeof(_newvec) === "number"){
            return new vec2((this.x - _newvec),(this.y - _newvec));
         }
    }
    // Multiply
    multi(_newvec = 0, _newvec2 = 0){//multiplying two vectors
        return new vec2((this.x * _newvec),(this.y * _newvec2));
    
    }
    multi(_newvec){//multiplying two vectors
        if(_newvec instanceof vec2){
            return new vec2((this.x * _newvec.x),(this.y * _newvec.y));
        }
        if(typeof(_newvec) === "number"){
            return new vec2((this.x * _newvec),(this.y * _newvec));
         }
    }
    // Divide
    div(_newvec = 0, _newvec2 = 0){//dividing two vectors
        return new vec2((this.x / _newvec),(this.y / _newvec2));
    }
    div(_newvec){//dividing two vectors
        if(_newvec instanceof vec2){
            return new vec2((this.x / _newvec.x),(this.y / _newvec.y));
        }
        if(typeof(_newvec) === "number"){
            return new vec2((this.x / _newvec),(this.y / _newvec));
         }
    }
    //getter
    get vec(){
        return new vec2(this.x,this.y);
    }
}

class Segment{
    #active = false;//For Mouse React
        /** 
        @param {vec2} _a - the vector2
        */
    constructor(_a, _angle = 90, _len = 100, _parent){
        console.log(_parent instanceof Segment);
        if (_parent instanceof Segment){ //Following Segments, that will also be linked to the Main one, 
                                        // Thats the reason it mostly stores the parents data
            this.parent = _parent;     
            this.name = this.parent.name +1;
            this.a = this.parent.b;
            this.angle = (Math.PI / 180)*_angle + this.parent.angle; // Converts the angle to degrees
            this.len = _len;  
            this.origin = this.parent.origin; 
        }
        else {//First Segment ---- Main one
            this.name = 0;
            this.origin = _a;
            this.a = _a;
            this.angle = -(Math.PI / 180)*_angle; // Converts the angle to degrees
            this.len = _len;
            this.parent = _parent;
        }
        this.calc_b();//Always use this after chaning the angle



    }
    //Methods

    calc_b(){//uses angle and length to determine B
        let ang = new vec2();
        ang.x = this.len* Math.cos(this.angle);
        ang.y = this.len* Math.sin(this.angle);
        this.b = this.a.add(ang);
        
    }

    rotate(){//NO IDEA
        this.selfangle = -Math.sin(Math.PI / 20);
        this.calc_b();
    }

    update(){//Keep the children linked to their Parents

        if(this.parent){
            this.parent.calc_b();
            this.a = this.parent.b;
            this.angle = this.parent.angle;
        }

        this.calc_b();
    }

    spring(){//for a smoother response ;; ITS STILL MISSING THE BOUNCYNESS
        let k = .05, vel = new vec2(0,0), f;

        f = this.a.sub(this.origin);
        let x = f.mag();
        f.normalize();
        f = f.multi(-1*k*x);
        vel = vel.add(f);
        this.a = this.a.add(vel.multi(1));

    }
    drawline(){ // visualizes everything at some point these will be rendered as rectangles
        
        this.calc_b();
        ctx.fillRect(this.origin.x,this.origin.y,10,10);
        ctx.beginPath();//  very important before drawing a line
        ctx.moveTo(this.a.x,this.a.y);//                      :
        ctx.lineTo(this.b.x,this.b.y);//                      :
        ctx.stroke();//      very important after drawing a line

    }

    react_To_Mouse(){
        if(this.parent == null){//only work on the base Segment AKA the Main one
            let limit = 50, dir = this.a.sub(mouse);//LIMIT: raduis for the collisiondetection; DIR: substract multiple vectors to create a directional vector
            
            if(this.origin.x > mouse.x - limit && this.origin.x < mouse.x + limit &&
            this.origin.y > mouse.y - limit && this.origin.y < mouse.y + limit){//check if a given object is in a given space,, MAYBE ADD ARRAY Coordinates * docsize/amount, to reduze number of calls?
                this.calc_b();
                ctx.strokeStyle = "red"; // when in ounding box turn red
                dir.normalize();
                
                this.a = this.origin.add(dir.multi(limit-10)); // segment evading the mouse+radius
               
                this.#active = true;//This is used to give the spring some downtime, to come back ,, MAYBE use spring() internal loop
            }

            if(this.#active == true){
                if(this.a == this.origin)
                {
                    this.#active = false;
                }
                this.spring();
            }

            //          Some drawings for my human eye, to see the impact of my changes in the code
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth= 3;
            ctx.arc(mouse.x, mouse.y, limit, 0,  2 * Math.PI);
            ctx.stroke();
            ctx.restore();

        }          
    }   

}



// My constants
const canvas = document.getElementById('canvas'); // canvas
const docSize  = new vec2(canvas.width, canvas.height);
var ctx = canvas.getContext("2d");

//easier Access to width and height of the canvas

// My variables
var cRect = canvas.getBoundingClientRect();
var mouse = new vec2(), prev = new vec2();
//Segment Setup
var amount = 3, segamount = 1; // amount of Segments, Length of Segments

var tiles = createSegments();
// Mouse Position

//       Event Listenrer

document.onload = function(e){ // When the page is finished loading, call this function
    if (!canvas.getContext) {
        return;
    }
    canvas.style.width = docSize.x; // sync the javascript h/w with the css h/w
    canvas.style.height = docSize.y;
    // get the context
}

document.onmousemove = function(e){ // get and update mouse position
    mouse.x = e.clientX-cRect.left;
    mouse.y = e.clientY-cRect.top;
}

window.onresize = function(e){//When the user Resizes the Browserwindow, fetch the bounding box again
    cRect = canvas.getBoundingClientRect(); 
}

// Loop
setInterval(draw,20);

// My Functions

function createSegments(){

    let vecsteps = docSize.div(amount+1);//Important for gridbased positional data
    let segs = [amount];// Array that stores all the information
    let len = 100; // length of the segments, so far not decreaseing with each itearation
    let angle;

    for(let x = 0; x < amount; x++){// Loop for x axis
        segs[x] = Array(amount);  // Make array 2 Diemsional to store the grid 
        angle = Math.random()*(100-80)+80; // Random Angle
        for(let y = 0; y < amount; y++){// Loop for y Axis
            for(let i = 0; i < segamount; i++){ //Loop for interation , TECHNIALLY Z AXIS
                segs[x][y] = Array(segamount); // Make array 3 Dimensional, to store the Segment Arrays
                segs[x][y][i] = new Segment(new vec2(vecsteps.x *(x+1),vecsteps.y *(y+1)),angle,len,segs[x][y][i-1]); // Still a bug with the parent entity, for some reason always null
                if(i+1 == segamount){segs[x][y][i] = new Segment(new vec2(vecsteps.x *(x),vecsteps.y *(y)),angle,len,segs[x][y][(i-1)]);}  
            }   
        }

    }
        console.table(segs); // FUCKING DEBUGGING
        
    return segs;
}


function draw(){


    //ctx.clearRect(0,0, docSize.x,docSize.y);
    ctx.strokeStyle = "#3f9f3f";
    ctx.lineWidth = 10;
   
    for(let posx = 0; posx < amount; posx++){
        for(let posy = 0; posy < amount; posy++){
            for(let i = 0; i < segamount; i++){
                tiles[posx][posy][0].react_To_Mouse();
                   // tiles[posx][posy][i].drawline();

            }
        }
    }
        //tiles[a][i].react_To_Mouse(ctx);
        //tiles[a][i].drawline(ctx);
        //tiles[a][i].update();
        //tiles[a][i].rotate();
    
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
