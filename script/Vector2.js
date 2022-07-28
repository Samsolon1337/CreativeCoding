export class vec2{
    #sub=false;
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
    add(newVecX = 0, newVecY = 0){//Adding two vectors
        return new vec2((this.x + newVecX),(this.y + newVecY));

    }

    add(newVec){//Adding two vectors
        if(newVec instanceof vec2){
            return new vec2((this.x + newVec.x),(this.y + newVec.y));
        }
        if(typeof(newVec) === "number"){
            return new vec2((this.x + newVec),(this.y + newVec));
         }
    }
    // Subtract
    sub(newVecX = 0, newVecY = 0){//substracting two vectors
        return this.add(-newVecX,-newVecY);
    
    }
    sub(newVec){//substracting two vectors
        if(newVec instanceof vec2){
        return this.add(newVec.multi(-1));
        }
        if(typeof(newVec) === "number"){
            return this.add(-newVec);
         }
    }
    // Multiply
    multi(newVecX = 0, newVecY = 0){//multiplying two vectors
        return new vec2((this.x * newVecX),(this.y * newVecY));
    
    }
    multi(newVec){//multiplying two vectors
        if(newVec instanceof vec2){
            return new vec2((this.x * newVec.x),(this.y * newVec.y));
        }
        if(typeof(newVec) === "number"){
            return new vec2((this.x * newVec),(this.y * newVec));
         }
    }
    // Divide
    div(newVecX = 0, newVecY = 0){//dividing two vectors
        return new vec2((this.x / newVecX),(this.y / newVecY));
    }
    div(newVec){//dividing two vectors
        if(newVec instanceof vec2){
            return new vec2((this.x / newVec.x),(this.y / newVec.y));
        }
        if(typeof(newVec) === "number"){
            return new vec2((this.x / newVec),(this.y / newVec));
         }
    }
    //getter
    get vec(){
        return new vec2(this.x,this.y);
    }
}