import { vec2 } from "./Vector2.js";

export class quadTree{
    constructor(_bPos,_bSize,_cap){
        this.bPos = _bPos;
        this.bSize = _bSize;
        this.cap = _cap;
        this.elementArray = [];
        this.divided = false;
    }

    insert(element,coord) {
        if(!this.contains(coord)){
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
        // For more readability
        let newBSize = new vec2(this.bSize.x/2,this.bSize.y/2);
        let Right = this.bPos.x + (this.bSize.x/2);
        let Top = this.bPos.y - (this.bSize.y/2);
        let Bottom = this.bPos.y + (this.bSize.y/2);
        let Left = this.bPos.x - (this.bSize.x/2);  

        this.topLeft = new quadTree(new vec2(Left,Top), newBSize, this.cap);
        this.topRight = new quadTree(new vec2(Right,Top), newBSize, this.cap);
        this.bottomLeft = new quadTree(new vec2(Left,Bottom), newBSize, this.cap);
        this.bottomRight = new quadTree(new vec2(Right,Bottom), newBSize, this.cap);
        
        this.divided = true;
    }

    contains(coord){
        return (coord.x <= this.bPos.x + this.bSize.x && coord.x >= this.bPos.x - this.bSize.x && coord.y <= this.bPos.y + this.bSize.y && coord.y >= this.bPos.y - this.bSize.y);


    }
}