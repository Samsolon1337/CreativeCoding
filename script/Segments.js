import {vec2} from "./Vector2.js";

export class segment{
        mouseEnter;// if Mouse hovers over enable
        /** 
        @param {vec2} _a - the vector2
        */
    constructor(_a, _angle = 90, _len = 100, _size, _parent){
        // -------------------------------------------------------------- Child/Parent Managment
        if (_parent instanceof segment){ // Copying nessecary parent data
            this.id = _parent.id +1;
            this.a = _parent.c;
            this.origin = _parent.origin; 
            this.parent = _parent;     
            this.angle = (Math.PI / 180)*_angle + _parent.angle; // Converts the angle from radians to degrees
            this.len = _len;  
            this.size = _size;
        }
        // -------------------------------------------------------------- End of Child/Parent Managment
        // -------------------------------------------------------------- First Segment
        else {
            this.id = 1;
            this.a = _a;
            this.origin = _a;
            this.parent = null;
            this.angle = -(Math.PI / 180)*_angle; // Converts the angle from radians to degrees
            this.len = _len;
            this.size = _size;
        }
        this.calc_C();//Always use this after chaning the angle
        // -------------------------------------------------------------- First Segment
    }
    
// ____________________________________________________________________________________ Methodes
   
    calc_C(){
        this.c = new vec2();
        let ang = new vec2();
        // -------------------------------------------------------------- Calculate B using the length and angle
        ang.x = this.len* Math.cos(this.angle);
        ang.y = this.len* Math.sin(this.angle);
        this.b = this.a.add(ang);
        // -------------------------------------------------------------- End of Calculate B
        // -------------------------------------------------------------- Calculate C by calculating the arc length
        let r = ang.mag();
        this.c.x = this.a.x+(ang.x/360)*(2*Math.cos(r*this.angle));
        this.c.y = this.a.y+(ang.y/360)*(2*Math.sin(r*this.angle));
        // -------------------------------------------------------------- End of Calculate C
    }

    update(){
        // -------------------------------------------------------------- Linking childrens origin point to parents end point
        if(this.parent){
           // let dir = this.a.sub(this.c);
            this.parent.calc_C();
            this.a = this.parent.c;//.add(dir);
            this.angle = this.parent.angle;
        }
        this.calc_C();
    }

        
    

}