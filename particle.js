import Point from './point.js'

class Particle{
    constructor(x,y,hue){
        this.pos = new Point(x,y)
        this.size = Math.random() *15 +1;
        this.speedX = Math.random()*12 -6;
        this.speedY = Math.random()*12 -6;
        this.color = 'hsla('+hue+',100%,50%)'
    }

    update(){
        this.pos.x += this.speedX;
        this.pos.y += this.speedY;
        if(this.size>0.2) this.size -=0.3;
    }

    draw(ctx){
        ctx.fillStyle = this.color;
      
        ctx.beginPath();
        ctx.arc(this.pos.x,this.pos.y,this.size,0,Math.PI*2);
        ctx.fill();
    }
}

export default Particle;