import {vec2} from "./Vector2.js";

export class segment{
    #active = false;//For Mouse React
        /** 
        @param {vec2} _a - the vector2
        */
    constructor(_a, _angle = 90, _len = 100, _parent){
        console.log(_parent instanceof segment);
        if (_parent instanceof segment){ //Following Segments, that will also be linked to the Main one, 
                                        // Thats the reason it mostly stores the parents data            this.a = _parent.b;
            
            this.id = _parent.id +1;
            this.a = _parent.b;
            this.origin = _parent.origin; 
            this.parent = _parent;     
            this.angle = (Math.PI / 180)*_angle + _parent.angle; // Converts the angle to degrees
            this.len = _len;  

        }
        else {//First Segment ---- Main one
            this.id = 0;
            this.a = _a;
            this.origin = _a;
            this.parent = _parent;
            this.angle = -(Math.PI / 180)*_angle; // Converts the angle to degrees
            this.len = _len;
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
    /*
    rotate(){//NO IDEA
        this.angle += Math.sin(Math.PI /(this.a.x)*10);
        this.calc_b();
    }
    */
    update(){//Keep the children linked to their Parents

        if(this.parent){
            this.parent.calc_b();
            this.a = this.parent.b;
            this.angle = this.parent.angle;
        }

        this.calc_b();
    }
    drawline(){ // visualizes everything at some point these will be rendered as rectangles
        
        this.calc_b();
        //ctx.fillRect(this.origin.x,this.origin.y,10,10);
        ctx.beginPath();//  very important before drawing a line
        ctx.moveTo(this.a.x,this.a.y);//                      :
        ctx.lineTo(this.b.x,this.b.y);//                      :
        ctx.stroke();//      very important after drawing a line
    }
    
    /*
    spring(){//for a smoother response ;; ITS STILL MISSING THE BOUNCYNESS
        let k = .05, vel = new vec2(0,0), f;

        f = this.a.sub(this.origin);
        let x = f.mag();
        f.normalize();
        f = f.multi(-1*k*x);
        vel = vel.add(f);
        this.a = this.a.add(vel.multi(5));

    }


    react_To_Mouse(){
        if(this.parent == null){//only work on the base Segment AKA the Main one
            let limit = 200, dir = this.a.sub(mouse);//LIMIT: raduis for the collisiondetection; DIR: substract multiple vectors to create a directional vector
            
            if(this.origin.x > mouse.x - limit && this.origin.x < mouse.x + limit &&
            this.origin.y < mouse.y + limit && this.origin.y > mouse.y - limit){//check if a given object is in a given space,, MAYBE ADD ARRAY Coordinates * docsize/amount, to reduze number of calls?
                this.calc_b();
                //ctx.strokeStyle = "red"; // when in ounding box turn red
                dir.normalize();
                
                this.a = this.origin.add(dir.multi(limit/3)); // segment evading the mouse+radius
               
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
*/
}