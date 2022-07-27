import {segment} from "./Segments.js";
import {vec2} from "./Vector2.js";




//TODO: Convert segments into squares
//      Overlap them
//      Give them color
//      convert movement on y and y also to z 

//      My classes





// My constants
const canvas = document.getElementById('canvas'); // canvas
const docSize  = new vec2(canvas.width, canvas.height);
var ctx = canvas.getContext("2d");

//easier Access to width and height of the canvas

// My variables
var cRect = canvas.getBoundingClientRect();
var mouse = new vec2()// Mouse Position
//Segment Setup
var amount = 25, segamount = 1; // amount of Segments, Length of Segments

var tiles = createSegments();


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
    let len = 65; // length of the segments, so far not decreaseing with each itearation
    let angle;

    for(let x = 0; x < amount; x++){// Loop for x axis
        segs[x] = Array(amount);  // Make array 2 Diemsional to store the grid 
        angle = Math.random()*(140-40)+40; // Random Angle
        for(let y = 0; y < amount; y++){// Loop for y Axis
            for(let i = 0; i < segamount; i++){ //Loop for interation , TECHNIALLY Z AXIS
                segs[x][y] = Array(segamount); // Make array 3 Dimensional, to store the Segment Arrays
                if(i == 0){segs[x][y][i] = new segment(new vec2(vecsteps.x *(x+1),vecsteps.y *(y+1)+len/2),angle,len,null)}
                if(i+1 == segamount){segs[x][y][i] = new segment(new vec2(vecsteps.x *(x),vecsteps.y *(y)+len/2),angle,len,segs[x][y][(i-1)]);}  
                segs[x][y][i] = new segment(new vec2(vecsteps.x *(x+1),vecsteps.y *(y+1)+len/2),angle,len,(segs[x][y][(i-1)])); // Still a bug with the parent entity, for some reason always null

                //console.table(segs[x][y][i]);
            }   
        }
    } //console.log(segs) // FUCKING DEBUGGING  
    return segs;
}


function draw(){


    ctx.clearRect(0,0, docSize.x,docSize.y);
    ctx.strokeStyle = "#3f9f3f";
    ctx.lineWidth = 10;
    /*
    for(let posx = 0; posx < amount; posx++){
        for(let posy = 0; posy < amount; posy++){
            for(let i = 0; i < segamount; i++){

               // tiles[posx][posy][i].rotate();

            }
        }
    }
    */
        //tiles[a][i].react_To_Mouse(ctx);
        //tiles[a][i].drawline(ctx);
        //tiles[a][i].update();
        //tiles[a][i].rotate();
    
   // console.log(segments);

}