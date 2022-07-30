import {quadTree} from "./Quadtree.js";
import { rect } from "./Rectangle.js";
import {segment} from "./Segments.js";
import {vec2} from "./Vector2.js";

//TODO: Convert segments into squares
//      Overlap them
//      Give them color
//      convert movement on y and y also to z 

// My constants
const canvas = document.getElementById('canvas'); // canvas
const docSize  = (window.innerWidth<canvas.width && window.innerHeight < canvas.height)?new vec2(window.innerWidth,window.innerHeight): new vec2(canvas.width, canvas.height);
canvas.width = docSize.x;
canvas.height = docSize.y;

var ctx = canvas.getContext("2d");

//easier Access to width and height of the canvas

// My variables
var cRect = canvas.getBoundingClientRect();
var mouse = new vec2(-1,-1) , prev = new vec2();// Mouse Position
//Segment Setup
var amount = 8, segamount = 2; // amount of Segments, Length of Segments



let segLen = docSize.x/(amount+1);
let segDecline = .7;
let segAngle = 90;
//var tiles = createSegments();
var seg = createSegments();
let quadTest = createQuadSegments();

// let quadTest = createQuadSegments();
// drawQuad(quadTest);
// console.table(quadTest);
 // NO quadtree yet, becasuse its missing the four elemnent maximum
// let test = [0,0,quad[0].length*segLen,quad[0].length*segLen];
// let test2 = [0 ,(quad[1].length)*segLen,quad[1][0][0].length*segLen,quad[1][0][0].length*segLen];
// let test3 = [quad[2].length*segLen ,quad[2].length*segLen,quad[2].length*segLen,quad[2].length*segLen];
// let test4 = [quad[3].length*segLen ,0,quad[3].length*segLen,quad[3].length*segLen];



//       Event Listenrer

document.onload = function(e){ // When the page is finished loading, call this function
    if (!canvas.getContext) {
        return;
    }
    canvas.style.width = docSize.x; // sync the javascript h/w with the css h/w
    canvas.style.height = docSize.y;
    // get the context
}

document.onmousemove = function(e){ // get and update Mouse position --- Desktop Devices

    mouse.x = e.clientX-cRect.left;
    mouse.y = e.clientY-cRect.top;
    
}
canvas.ontouchstart = function(e){  // get and update Touch position --- Mobile Devices
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

window.onresize = function(e){//When the user Resizes the Browserwindow, fetch the bounding box again
    cRect = canvas.getBoundingClientRect(); 
}

// Loop
setInterval(draw,20);



// My Functions

/*
function create_A_Segments(){
    let segs= [amount];
    let len = 200, decline = .5, angle;
    for(let i = 0; i < amount; i++){

        segs[i] = new segment(new vec2(600,600),90,len,segs[i-1]);
        len *= decline ;
    }
    return segs

}*/
function spring(seg){//for a smoother response ;; ITS STILL MISSING THE BOUNCYNESS
    let k = .05, vel = new vec2(0,0), f;

    f = seg.a.sub(seg.origin);
    let x = f.mag();
    f.normalize();
    f = f.multi(-1*k*x);
    vel = vel.add(f);
    seg.a = seg.a.add(vel.multi(5));

}


function react_To_Mouse(seg){

        if(!seg.parent){//only work on the base Segment AKA the Main one
            let limit = 90, direction = seg.a.sub(mouse);//LIMIT: raduis for the collisiondetection; DIR: substract multiple vectors to create a directional vector
            
            if(seg.origin.x > mouse.x - limit && seg.origin.x < mouse.x + limit &&
            seg.origin.y < mouse.y + limit && seg.origin.y > mouse.y - limit){//check if a given object is in a given space,, MAYBE ADD ARRAY Coordinates * docsize/amount, to reduze number of calls?
                //seg.calc_C();
                ctx.strokeStyle = "red"; // when in ounding box turn red
                direction.normalize();
                
                seg.a = seg.origin.add(direction.multi(limit)); // segment evading the mouse+radius
            
                seg.mouseEnter = true;//This is used to give the spring some downtime, to come back ,, MAYBE use spring() internal loop

            }
        }
        if(seg.mouseEnter == true){
            ctx.save();
            ctx.strokeStyle = "yellow";
            if(seg.a == seg.origin){
                seg.mouseEnter = false;
            }
            spring(seg)
            ctx.restore();
        }
    //spring(seg);
}
function draw_Segment(seg){ // visualizes everything at some point these will be rendered as rectangles
    
    
    //console.log(seg.c)
    ctx.fillRect(seg.origin.x,seg.origin.y,10,10);
    //ctx.strokeRect(seg.c.x,seg.c.y,seg.len,seg.len);
    ctx.strokeRect(seg.c.x-(seg.len/2),seg.c.y-(seg.len/2),seg.len,seg.len);
    /*ctx.strokeRect(seg.a.x,seg.a.y,10,10);
    ctx.save();
    ctx.fillStyle = "red";
    ctx.fillRect(seg.c.x,seg.c.y,10,10);
    ctx.restore();
    */
}

function draw(){
    ctx.clearRect(0,0, docSize.x,docSize.y);// resets canvas
    let size = 400
    ctx.strokeRect(mouse.x-size/2,mouse.y-size/2,size,size);
    
    let found = quadTest.search(new rect(mouse.x-size/2,mouse.y-size/2,size,size),null);
    console.log(found[0]);

    ctx.strokeStyle = "#3f9f3f";

    // drawQuad(quadTest);
     
    for(let i = 0; i< found.length;i++){
        for(let j = 0; j < segamount;j++){
        draw_Segment(found[i]);
        react_To_Mouse(found[i]);
        }

    }
        // for(let posx = 0; posx < amount;posx++){  
    //     for(let posy = 0; posy < amount;posy++){
    //         for(let i = 0; i < segamount; i++){
    //             seg[posx][posy][i].update();
    //             //console.log(seg[2].id,seg[2].parent.id);
    //             draw_Segment(seg[posx][posy][i]);
    //             //react_To_Mouse(seg[posx][posy][i]);



    //         }
    //     } 
    // }         
            //console.log(`A: ${seg[1].c.x} / ${seg[1].c.y}, B: ${seg[2].c.x} / ${seg[2].c.y}`);
            //}
    //}
    
        //tiles[a][i].react_To_Mouse(ctx);
        //tiles[a][i].drawline(ctx);
        //tiles[a][i].update();
        //tiles[a][i].rotate();
    
   // console.log(segments);

}
// let quad = new quadTree(docSize.div(2),docSize.div(2),4);
// function drawPoints(){
    
//     ctx.fillRect(mouse.x,mouse.y,10,10);
//     quad.insert(new vec2(mouse.x,mouse.y),mouse);
//     return quad;
// }
function createQuadSegments(){
    let vecSteps = docSize.div(amount+1);//Important for gridbased positional data
    let segs;// Array that stores all the information
    let len, decline = segDecline; // length of the segments, so far not decreaseing with each itearation
    let quad = new quadTree(new rect(0,0,docSize.x,docSize.y),4);

    let angle = segAngle;

    for(let x = 0; x < amount; x++){// Loop for x axis

        for(let y = 0; y < amount; y++){// Loop for y Axis
            len = segLen;
            segs = new Array();
            for(let i = 0; i < segamount; i++){ //Loop for interation , TECHNIALLY Z AXIS
                
                 segs[i] = (new segment(new vec2(vecSteps.x *(x+1),vecSteps.y *(y+1)),angle,len,segs[i-1])); // Still a bug with the parent entity, for some reason always null
                len *= decline;
                //console.table(segs[x][y][i]);
            }   
            console.log(segs);
            quad.insert(segs,segs.a);
        }
    } //console.log(`Number of elements ${segs.length}, Splits ${segs.length / 4}`) // FUCKING DEBUGGING  
    return quad;
}

function createSegments(){
    let vecSteps = docSize.div(amount+1);//Important for gridbased positional data
    let segs = [amount];// Array that stores all the information
    let len, decline = segDecline; // length of the segments, so far not decreaseing with each itearation
    let angle = segAngle;

    for(let x = 0; x < amount; x++){// Loop for x axis
        segs[x] = Array(amount);  // Make array 2 Diemsional to store the grid 
        angle = Math.random()*(140-40)+40; // Random Angle
        for(let y = 0; y < amount; y++){// Loop for y Axis
            segs[x][y] = Array(segamount); 
            len = segLen;
            for(let i = 0; i < segamount; i++){ //Loop for interation , TECHNIALLY Z AXIS
                // Make array 3 Dimensional, to store the Segment Arrays
                
                segs[x][y][i] = new segment(new vec2(vecSteps.x *(x+1),vecSteps.y *(y+1)),angle,len,(segs[x][y][(i-1)])); // Still a bug with the parent entity, for some reason always null
                len *= decline;
                //console.table(segs[x][y][i]);
            }   
        }
    } //console.log(`Number of elements ${segs.length}, Splits ${segs.length / 4}`) // FUCKING DEBUGGING  
    return segs;
}
// function quadTree(quad0){

//     let quadTopLeft,quadBottomLeft,quadBottomRight,quadTopRight;
//     let quad0Max = quad0.length;
//     quadTopLeft = quad0.slice(0, quad0Max/2).map(a => a.slice(0, quad0Max/2)); // cut out the upper left part of the Array
//     quadTopRight = quad0.slice(0, quad0Max/2).map(a => a.slice(quad0Max/2));
//     quadBottomRight = quad0.slice(quad0Max/2).map(a => a.slice(quad0Max/2));
//     quadBottomLeft = quad0.slice(quad0Max/2).map(a => a.slice(0,quad0Max/2));



//         // console.table(quad0);
//         // console.log("TopLeft");
//         // console.table(quadTopLeft);
//         // console.log("BottomLeft");
//         // console.table(quadBottomLeft);
//         // console.log("BotttomRight");
//         // console.table(quadBottomRight);
//         // console.log("TopRight");
//         // console.table(quadTopRight);
//     return [quadTopLeft,quadBottomLeft,quadBottomRight,quadTopRight];
// }

function drawQuad(quad){
    // for(let i = 0; i<seg.length; i++){
    //     ctx.clearRect(0,0,1800,1800);
    //     setTimeout(() => { console.log("Hi"); }, 5000);
    //     for(let j = 0; j<seg.length; j++){
            if(quad.boundary.contains(mouse)){
                
                ctx.save();
                ctx.lineWidth= 8;
                ctx.strokeRect(quad.boundary.x, quad.boundary.y, quad.boundary.w, quad.boundary.w);
                ctx.restore();
            }
                ctx.lineWidth= 2;
                ctx.beginPath();
                ctx.strokeRect(quad.boundary.x, quad.boundary.y, quad.boundary.w, quad.boundary.h);



    if(quad.divided == true){
        drawQuad(quad.topLeft);
        drawQuad(quad.topRight);
        drawQuad(quad.bottomLeft);
        drawQuad(quad.bottomRight); 
    }




}