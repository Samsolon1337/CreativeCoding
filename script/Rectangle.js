export class rect{
    constructor(_x,_y,_w,_h){
        this.x = _x;
        this.y = _y;
        this.w = _w;
        this.h = _h;
    }
    
    intersects(range) {//Check for two overlapping rectangles
        return (range.x > this.x||
            range.x + range.w < this.x + this.w ||
            range.y > this.y ||
            range.y + range.h < this.y + this.h);

    }

    contains(coord){// check if point is contained in rectangle
        return (coord.x <= this.x + this.w && coord.x >= this.x && coord.y <= this.y + this.h && coord.y >= this.y);
    }
}