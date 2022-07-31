import { rect } from "./Rectangle.js";
import { vec2 } from "./Vector2.js";
export class quadTree{
    /**
     * 
     * @param {rect} _boundary - A rectangle
     */
// ____________________________________________________________________________________ Constructor
    constructor(_boundary,_cap){

        this.boundary = _boundary;
        this.cap = _cap;
        this.elementArray = [];
        this.divided = false;
    }
// ____________________________________________________________________________________ Methodes

    insert(element,coord) {

        if(!this.boundary.contains(coord)){
            return;
        }
        if(this.elementArray.length<this.cap){ // check if elements exceeds capacity per Quadtree cell
            this.elementArray.push(element);
        } 
        else{
            if(!this.divided){  // If not subdivided yet subdivide id nessesaey
                this.subdivide();
            }
            //  else insert in one of the smaller Quadtrees
            this.topLeft.insert(element,coord);
            this.topRight.insert(element,coord);
            this.bottomLeft.insert(element,coord);
            this.bottomRight.insert(element,coord);
        }
    }

    subdivide(){
        // -------------------------------------------------------------- For More Readablility
        let newBound = new vec2(this.boundary.w/2,this.boundary.h/2);
        let Right = this.boundary.x + (this.boundary.w/2);
        let Top = this.boundary.y;
        let Bottom = this.boundary.y + (this.boundary.h/2);
        let Left = this.boundary.x;  
        // -------------------------------------------------------------- End of More Readibility
        // -------------------------------------------------------------- Subdivied Quatree into 4 smaller Quadtrees
        this.topLeft = new quadTree(new rect(Left,Top, newBound.x, newBound.y), this.cap);
        this.topRight = new quadTree(new rect(Right,Top, newBound.x, newBound.y), this.cap);
        this.bottomLeft = new quadTree(new rect(Left,Bottom, newBound.x, newBound.y), this.cap);
        this.bottomRight = new quadTree(new rect(Right,Bottom, newBound.x, newBound.y), this.cap);
        // -------------------------------------------------------------- End of subdivied Quatree into 4 smaller Quadtrees
        this.divided = true;    // Do not subdivide if this.divided = true
    }

    search(range, found){
        // -------------------------------------------------------------- if Found Empty create a new one
        if(!found){
            found = new Array();
        }
        // -------------------------------------------------------------- end of if Found Empty create a new one
        if(!this.boundary.intersects(range)){
            return;
        }
        // -------------------------------------------------------------- See if object is inside a given range
        else{
            for(let obj of this.elementArray){
                if(range.contains(obj[0].origin)){
                    found.push(obj);
                }
                // else{
                //     console.log(obj);
                // }
            }
            // -------------------------------------------------------------- End of see if object is inside a given range
            // -------------------------------------------------------------- If the Quadtree was divided before, also search the smaller versions
            if(this.divided){
                this.topLeft.search(range, found);
                this.topRight.search(range, found);
                this.bottomLeft.search(range, found);
                this.bottomRight.search(range, found);
            }
            // -------------------------------------------------------------- End of if the Quadtree was divided before, also search the smaller versions
            return found; // return results
        }
    }
}