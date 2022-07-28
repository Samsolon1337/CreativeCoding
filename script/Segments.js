import {vec2} from "./Vector2.js";

export class segment{
        /** 
        @param {vec2} _a - the vector2
        */
    constructor(_a, _angle = 90, _len = 100, _parent){
        console.log(_parent instanceof segment);
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
            this.id = 0;
            this.a = _a;
            this.origin = _a;
            this.parent = _parent;
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
        ang.x = this.len* Math.cos(this.angle);
        ang.y = this.len* Math.sin(this.angle);
        this.b = this.a.add(ang);
        //seg.origin.add(dir.multi(limit/3));
        let r = this.b.mag();
        //this.c =  this.a.add((ang.div(360).multi(Math.PI*r/2)));
        this.c.x = this.a.x+(ang.x/360)*Math.cos(r/2);
        this.c.y = this.a.y+(ang.y/360)*Math.sin(r/2);
    }
        /*       console.log(this.c);
        this.calc_B();
        let newa = new vec2(this.origin.x, this.b.y); 
        console.log(this.a,this.b,newa);
      //  let alen = this.origin.sub(newa);
        //newa = newa.sub(alen);
        let newb = newa.sub(this.b);
        let blen = newa.sub(newb);
        //console.log(this.b,this.a);
        let ang = new vec2();
        ang.x = blen* Math.cos(this.angle);
        ang.y = blen* Math.sin(this.angle);
        this.c = this.b.add(blen);
    }
    */
    /*
    rotate(){//NO IDEA
        this.angle += Math.sin(Math.PI /(this.a.x)*10);
        this.calc_B();
    }
    */
    update(){//Keep the children linked to their Parents

        if(this.parent){
            this.parent.calc_C();
            this.a = this.parent.c;
            this.angle = this.parent.angle;
        }

        this.calc_C();
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
                this.calc_B();
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