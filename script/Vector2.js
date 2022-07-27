export class vec2{
    
    constructor(_x=0,_y=0){//Creates Homemade 2D Vector
        this.x = _x;
        this.y = _y;
        this.isnormalized 
    }
    mag(){// returns the Length of an object
        return Math.sqrt((this.x*this.x)+(this.y*this.y));// Satz des Petagruas
    }
    srq_Mag(){//Faster but only for comparisions
        return (this.x*this.x)+(this.y*this.y);
    }
    normalize(){ // returns the length with a value between 0 and 1
        let scale = this.mag();
        this.x /= scale;
        this.y /= scale;
        this.isnormalized = true;
    }
    get is_normalized(){ // returns if the Vector has been normalized yet TECHNICALLY STILL UNSTABLE
        return this.isnormalized;
    }
    // Add
    add(_newvec = 0, _newvec2 = 0){//Adding two vectors
        return new vec2((this.x + _newvec),(this.y + _newvec2));

    }
    add(_newvec){//Adding two vectors
        if(_newvec instanceof vec2){
            return new vec2((this.x + _newvec.x),(this.y + _newvec.y));
        }
        if(typeof(_newvec) === "number"){
            return new vec2((this.x + _newvec),(this.y + _newvec));
         }
    }
    // Subtract
    sub(_newvec = 0, _newvec2 = 0){//substracting two vectors
        return new vec2((this.x - _newvec),(this.y - _newvec2));
    
    }
    sub(_newvec){//substracting two vectors
        if(_newvec instanceof vec2){
            return new vec2((this.x - _newvec.x),(this.y - _newvec.y));
        }
        if(typeof(_newvec) === "number"){
            return new vec2((this.x - _newvec),(this.y - _newvec));
         }
    }
    // Multiply
    multi(_newvec = 0, _newvec2 = 0){//multiplying two vectors
        return new vec2((this.x * _newvec),(this.y * _newvec2));
    
    }
    multi(_newvec){//multiplying two vectors
        if(_newvec instanceof vec2){
            return new vec2((this.x * _newvec.x),(this.y * _newvec.y));
        }
        if(typeof(_newvec) === "number"){
            return new vec2((this.x * _newvec),(this.y * _newvec));
         }
    }
    // Divide
    div(_newvec = 0, _newvec2 = 0){//dividing two vectors
        return new vec2((this.x / _newvec),(this.y / _newvec2));
    }
    div(_newvec){//dividing two vectors
        if(_newvec instanceof vec2){
            return new vec2((this.x / _newvec.x),(this.y / _newvec.y));
        }
        if(typeof(_newvec) === "number"){
            return new vec2((this.x / _newvec),(this.y / _newvec));
         }
    }
    //getter
    get vec(){
        return new vec2(this.x,this.y);
    }
}