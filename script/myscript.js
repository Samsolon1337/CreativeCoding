import {segment} from "./Segments.js";  //Import Segments for Foward Kinematis
import {vec2} from "./Vector2.js";      //Import Custom Vector Class

// ____________________________________________________________________________________ Global Variables
const checkBoxFill = document.getElementById("fillrect");
const pre1 = document.getElementById("one");
const pre2 = document.getElementById("two");
const pre3 = document.getElementById("three");
// -------------------------------------------------------------- initialize Sliders
// const amountSlider = document.getElementById('Amount'); // Get Amount
// const segmentSlider = document.getElementById('SegmentAmount'); // Get segAmount
// const limitSlider = document.getElementById('Limit'); // Get length
// const angleSlider = document.getElementById('Angle'); // Get Angle
// const SliderValue = document.getElementById("Slidervalue");
// -------------------------------------------------------------- End of Sliders
// -------------------------------------------------------------- initialize Canvas
const canvas = document.getElementById('canvas'); // Get Canvas
const docSize  = (window.innerWidth<canvas.width && window.innerHeight < canvas.height)?new vec2(window.innerWidth,window.innerHeight): new vec2(canvas.width, canvas.height); // Roughly setting responsive design

canvas.width = docSize.x; // Set canvas Size equal to DocSize
canvas.height = docSize.y;

let ctx = canvas.getContext("2d");// Context required for drawing
ctx.lineWidth = 1.5;
// -------------------------------------------------------------- End of Canvas
// -------------------------------------------------------------- Setup Segments
let amount = 40;     // Amount of Objects in one Row
let segAmount = 4;  // Amount of Segments

let segStepSize = docSize.div(amount+1);
let segLen = 100;  // Global Segment length
let segDecline = .6;              // Global Segment Length Decline

let segAngle = 90;                  // Global initial Segment Angle
let seg = createSegments();         // Holds the 2d Array containing all the Segments
// -------------------------------------------------------------- End of Setup Segments

// -------------------------------------------------------------- Variables for Mouse
let mouse = new vec2(-100,-100);            // Mouse Position
let cRect = canvas.getBoundingClientRect(); // Canvas Position for Mouse Tracking
let mouseLimit = 60;
// -------------------------------------------------------------- End of Variables for Mouse 
// -------------------------------------------------------------- Variables Colors

let colorPreset = ["#53B327","#6B74FF","#89FF52","#FF7538","#B35830"]; // Define Segment Colors
let colorPreset1 = ["#3B3A70","#5D5BB0","#7E7DF0","#8583FC","#716FD6"];
let colorPreset2 = ["#2A9C4D","#2DA630","#4C8F2E","#7DA62D","#9C9B2A"];
// -------------------------------------------------------------- End of Colors

// ____________________________________________________________________________________ End of Global Variables

// -------------------------------------------------------------- Event Listener
document.onload = function(e){ // When page finished loading, call this function
    if (!canvas.getContext) {// If there is no context Stop script
        console.error("Something went wrong, maybe try updating your browser");
        return;
    }

}
document.onmousemove = function(e){ // get and update Mouse position --- Desktop Devices Mouse Tracking
    mouse.x = e.clientX-cRect.left;
    mouse.y = e.clientY-cRect.top;
    
}

canvas.ontouchstart = function(e){  // get and update Touch position --- Mobile Devices Mouse Tracking
    canvas.ontouchmove = function(e){
        e.preventDefault();
        mouse.x = e.touches[0].clientX-cRect.left;
        mouse.y = e.touches[0].clientY-cRect.top;    
    }

    canvas.ontouchend = function(e){
        mouse.x = -100;
        mouse.y = -100;  
}

    canvas.ontouchcancel = function(e){
        mouse.x = -100;
        mouse.y = -100;    
    }
}

window.onresize = function(e){  // When the User Resizes the Browser Window, fetch the new bounding box for Mouse Tracking
    cRect = canvas.getBoundingClientRect(); 
}


// amountSlider.onchange = function() {
//     amount = this.value;
//     segStepSize = docSize.div(amount+1);
//     seg = createSegments();  
//   } 
// segmentSlider.onchange = function() {
//     SliderValue.innerHTML = this.value;
// }
// angleSlider.onchange = function() {
//     SliderValue.innerHTML = this.value;
// } 
// limitSlider.onchange = function() {
//     mouseLimit = this.value;
// } 


  
// -------------------------------------------------------------- End of Event Listener

// Setting the Main Loop
setInterval(mainLoop,20);

// My Functions

// function create_A_Segments(){
//     let segArray= [amount];
//     let len = 200, decline = .5, angle;
//     for(let i = 0; i < amount; i++){

//         segArray[i] = new segment(new vec2(600,600),90,len,segArray[i-1]);
//         len *= decline ;
//     }
//     return segArray
// }
//  
// ____________________________________________________________________________________ Functions

// -------------------------------------------------------------- Main Loop
function mainLoop(){
    let a = amount;
    ctx.clearRect(0,0, docSize.x,docSize.y);    // Reset canvas
    for(let posx = 0; posx < a;posx++){  
        for(let posy = 0; posy < a;posy++){
            for(let i = 0; i < segAmount; i++){

                seg[posx][posy][i].update();

                draw_Segment(seg[posx][posy][i]);
                
                reactToMouse(seg[posx][posy][i]);
            }   
        } 
    }         

    
}
// -------------------------------------------------------------- End of Main Loop
// -------------------------------------------------------------- Push and Pull on Elements
function reactToMouse(seg){   //Opposite to Spring = Push the Segments Away
    if(!seg.parent){//only work on the base Segment AKA the Main one
        let limit = mouseLimit, direction = seg.a.sub(mouse);//LIMIT: raduis for the collisiondetection; DIR: substract multiple vectors to create a directional vector
        
        if(seg.origin.x > mouse.x - limit && seg.origin.x < mouse.x + limit &&
        seg.origin.y < mouse.y + limit && seg.origin.y > mouse.y - limit){//check if a given object is in a given space,, MAYBE ADD ARRAY Coordinates * docsize/amount, to reduze number of calls?
            //seg.calc_C();
            ctx.save();
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(seg.c.x-(seg.size/2),seg.c.y-(seg.size/2),seg.size,seg.size);
            ctx.restore();
            draw_Segment(seg);
            direction.normalize();
            seg.a = seg.origin.add(direction.multi(limit)); // segment evading the mouse+radius
        
            seg.mouseEnter = true;//This is used to give the spring some downtime, to come back ,, MAYBE use spring() internal loop

        }
    }
    if(seg.mouseEnter == true){
        ctx.save();
        if(seg.a == seg.origin){
            seg.mouseEnter = false;
        }
        spring(seg)
        ctx.restore();
    }

}

function spring(seg){   //Opposite to reactToMouse = Pulls the Segments Towards their Center 
    let k = .05, vel = new vec2(0,0), f;

    f = seg.a.sub(seg.origin);
    let x = f.mag();
    f.normalize();
    f = f.multi(-1*k*x);
    vel = vel.add(f);
    seg.a = seg.a.add(vel.multi(5));
}
// -------------------------------------------------------------- End of Push and Pull on Elements
// -------------------------------------------------------------- Creating and drawing the Segments
function createSegments(){ // Create the 2d Array containing all the Segments
    let vecSteps = segStepSize;//Important for gridbased positional data
    let segArray = [amount];// Array that stores all the information
    let len, decline = segDecline; // length of the segments, so far not decreaseing with each itearation
    let angle = segAngle;

    let size;
    for(let x = 0; x < amount; x++){// Loop for x axis
        segArray[x] = Array(amount);  // Make array 2 Diemsional to store the grid 
        angle = Math.random()*(140-40)+40; // Random Angle
        for(let y = 0; y < amount; y++){// Loop for y Axis
            segArray[x][y] = Array(segAmount); 
            size = segStepSize.x;
            len = segLen;
            for(let i = 0; i < segAmount; i++){ //Loop for interation , TECHNIALLY Z AXIS
                // Make array 3 Dimensional, to store the Segment Arrays
                
                segArray[x][y][i] = new segment(new vec2(vecSteps.x *(x+1),vecSteps.y *(y+1)),angle,len,size,(segArray[x][y][(i-1)])); // Still a bug with the parent entity, for some reason always null
                size *= decline; // visual related entity but the same as len
                len *= decline; // Physic related entity but the same as size
                //console.table(segArray[x][y][i]);
            }   
        }
    } //console.log(`Number of elements ${segArray.length}, Splits ${segArray.length / 4}`) // FUCKING DEBUGGING  
    return segArray;
}

function draw_Segment(seg){ // visualizes everything at some point these will be rendered as rectangles

    if (pre1.checked){
        ctx.strokeStyle = colorPreset[seg.id-1];
        ctx.fillStyle = colorPreset[seg.id-1];
    }
    if (pre2.checked){
        ctx.strokeStyle = colorPreset1[seg.id-1];
        ctx.fillStyle = colorPreset1[seg.id-1];
    }
    if (pre3.checked){
        ctx.strokeStyle = colorPreset2[seg.id-1];
        ctx.fillStyle = colorPreset2[seg.id-1];
    }

    if(checkBoxFill.checked){
        ctx.fillRect(seg.c.x-(seg.size/2),seg.c.y-(seg.size/2),seg.size,seg.size);  
    }
    else{
    // ctx.fillRect(seg.origin.x,seg.origin.y,10,10);
        ctx.strokeRect(seg.c.x-(seg.size/2),seg.c.y-(seg.size/2),seg.size,seg.size);
    }
}
// -------------------------------------------------------------- End of Creating and drawing the Segments

// ____________________________________________________________________________________ End of Functions