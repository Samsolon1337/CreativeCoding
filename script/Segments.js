import {vec2} from "./Vector2.js";

export class segment{
        mouseEnter;
        /** 
        @param {vec2} _a - the vector2
        */
    constructor(_a, _angle = 90, _len = 100, _parent){
       // console.log(_parent instanceof segment);
        if (_parent instanceof segment){ //Following Segments, that will also be linked to the Main one, 
                                        // Thats the reason it mostly stores the parents data
            this.id = _parent.id +1;
            this.a = _parent.c;
            this.origin = _parent.origin; 
            this.parent = _parent;     
            this.angle = (Math.PI / 180)*_angle + _parent.angle; // Converts the angle to degrees
            this.len = _len;  

        }
        else {//First Segment ---- Main one
            this.id = 1;
            this.a = _a;
            this.origin = _a;
            this.parent = null;
            this.angle = -(Math.PI / 180)*_angle; // Converts the angle to degrees
            this.len = _len;
        }
        this.calc_C();//Always use this after chaning the angle



    }
    //Methods

    calc_B(){//uses angle and length to determine B
        let ang = new vec2();
        ang.x = this.len* Math.cos(this.angle);
        ang.y = this.len* Math.sin(this.angle);
        let dir = this.a.sub(ang);
        this.b = this.a.add(ang);


    }
    
    calc_C(){
        this.c = new vec2();
        let ang = new vec2();

        //this.c =  this.a.add((ang.div(360).multi(Math.PI*r/2)));

            ang.x = this.len* Math.cos(this.angle);
            ang.y = this.len* Math.sin(this.angle);
            this.b = this.a.add(ang);
            //seg.origin.add(dir.multi(limit/3));
            let r = ang.mag();
            this.c.x = this.a.x+(ang.x/360)*(2*Math.cos(r*this.angle));
            this.c.y = this.a.y+(ang.y/360)*(2*Math.sin(r*this.angle));
            //console.log(this.c.sub(this.a))
    
    }

    update(){//Keep the children linked to their Parents

        if(this.parent){
           // let dir = this.a.sub(this.c);
            this.parent.calc_C();
            this.a = this.parent.c;//.add(dir);
            this.angle = this.parent.angle;
        }
        this.calc_C();
    }

        
    

}