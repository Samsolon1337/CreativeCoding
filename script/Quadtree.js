import { rect } from "./Rectangle.js";
import { vec2 } from "./Vector2.js";
export class quadTree{
    /**
     * 
     * @param {rect} _boundary - A rectangle
     */
    constructor(_boundary,_cap){
        this.boundary = _boundary;
        this.cap = _cap;
        this.elementArray = [];
        this.divided = false;
    }
    insert(element,coord) {
        if(!this.boundary.contains(coord)){
            return;
        }
        if(this.elementArray.length<this.cap){
            this.elementArray.push(element);
        } 
        else{
            if(!this.divided){
                this.subdivide();
            }
            this.topLeft.insert(element,coord);
            this.topRight.insert(element,coord);
            this.bottomLeft.insert(element,coord);
            this.bottomRight.insert(element,coord);
        }
    }

    subdivide(){
        //
        // For more readability
        let newBound = new vec2(this.boundary.w/2,this.boundary.h/2);
        let Right = this.boundary.x + (this.boundary.w/2);
        let Top = this.boundary.y;
        let Bottom = this.boundary.y + (this.boundary.h/2);
        let Left = this.boundary.x;  

        this.topLeft = new quadTree(new rect(Left,Top, newBound.x, newBound.y), this.cap);
        this.topRight = new quadTree(new rect(Right,Top, newBound.x, newBound.y), this.cap);
        this.bottomLeft = new quadTree(new rect(Left,Bottom, newBound.x, newBound.y), this.cap);
        this.bottomRight = new quadTree(new rect(Right,Bottom, newBound.x, newBound.y), this.cap);
        
        this.divided = true;
    }

    search(range, found){
        if(!found){
            found = new Array();
        }
        if(!this.boundary.intersects(range)){
            return;
        }
        else{
            for(let obj of this.elementArray){
                if(range.contains(obj[0].origin)){
                    found.push(obj);
                }
                else{
                    console.log(obj);
                }
            }
            
            if(this.divided){
                this.topLeft.search(range, found);
                this.topRight.search(range, found);
                this.bottomLeft.search(range, found);
                this.bottomRight.search(range, found);
            }
            return found;
        }
    }
}