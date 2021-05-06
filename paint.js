let colour;
const strokeWidth = 35;
const varyBrightness = 5;
const BUTTON = 0b01;
const mouseButtonIsDown = (buttons) => (BUTTON & buttons) === BUTTON;
const rotatePoint = (distance, angle, origin) => [
    origin[0] + distance * Math.cos(angle),
    origin[1] + distance * Math.sin(angle)
  ];

class Paint{
	constructor()
	{
		
		this.canvas = document.querySelector('#paint-layer');
        this.ctx = this.canvas.getContext("2d");


        this.currentBrush = this.makeBrush(strokeWidth);

        this.drawing = false;
        this.isDrawingFlag = false;
        
        this.currentAngle;
        this.latestPoint;
        
		this.resize();
		
		
		this.canvas.addEventListener("touchstart", this.touchStart.bind(this), false);
        this.canvas.addEventListener("touchend", this.touchEnd.bind(this), false);
		this.canvas.addEventListener("touchcancel", this.touchEnd.bind(this), false);
		this.canvas.addEventListener("touchmove", this.touchMove.bind(this), false);

		this.canvas.addEventListener("mousedown", this.mouseDown.bind(this), false);
		this.canvas.addEventListener("mouseup", this.endStroke.bind(this), false);
		this.canvas.addEventListener("mouseout", this.endStroke.bind(this), false);
		this.canvas.addEventListener("mouseenter", this.mouseEnter.bind(this), false);
	}


	
	resize(){
		const wraprect = document.querySelector('.canvas__wrap');
		
		this.canvas.style.top = wraprect.offsetTop;
		
		this.canvas.width = document.querySelector('.canvas__wrap').clientWidth;
		this.canvas.height = document.querySelector('.canvas__wrap').clientHeight;
	}
    drawStop(){
    	this.isDrawingFlag = false;	
		document.querySelector('#colourInput').style.display='none';
    }

    drawStart(){
    	
		this.isDrawingFlag =true;
		document.querySelector('#colourInput').style.display='block';
    }

    varyColour(sourceColour){
        const amount = Math.round(Math.random() * 2 * varyBrightness);
        const c = tinycolor(sourceColour);
        const varied =
          amount > varyBrightness
            ? c.brighten(amount - varyBrightness)
            : c.darken(amount);
        return varied.toHexString();
      };


    makeBrush(size){
        const brush = [];
        let bristleCount = Math.round(size / 3);
        const gap = strokeWidth / bristleCount;
        for (let i = 0; i < bristleCount; i++) {
          const distance =
            i === 0 ? 0 : gap * i + (Math.random() * gap) / 2 - gap / 2;
          brush.push({
            distance,
            thickness: Math.random() * 2 + 2,
            colour: this.varyColour(colour)
          });
        }
        return brush;
      };

      


      


      getNewAngle(origin, destination, oldAngle){
        const getBearing = (origin, destination) =>
        (Math.atan2(destination[1] - origin[1], destination[0] - origin[0]) -
            Math.PI / 2) %
        (Math.PI * 2);

        const bearing = getBearing(origin, destination);

        const angleDiff = (angleA, angleB) => {
            const twoPi = Math.PI * 2;
            const diff =
              ((angleA - (angleB > 0 ? angleB : angleB + twoPi) + Math.PI) % twoPi) -
              Math.PI;
            return diff < -Math.PI ? diff + twoPi : diff;
          };

        if (typeof oldAngle === "undefined") {
          console.log(bearing);
      
          return bearing;
        }
        return oldAngle - angleDiff(oldAngle, bearing);
      };


      


      strokeBristle(origin, destination, bristle, controlPoint){
        this.ctx.beginPath();
        this.ctx.moveTo(origin[0], origin[1]);
        this.ctx.strokeStyle = bristle.colour;
        this.ctx.lineWidth = bristle.thickness;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.shadowColor = bristle.colour;
        this.ctx.shadowBlur = bristle.thickness / 2;
        this.ctx.quadraticCurveTo(
          controlPoint[0],
          controlPoint[1],
          destination[0],
          destination[1]
        );
        this.ctx.lineTo(destination[0], destination[1]);
        this.ctx.stroke();
      };


      drawStroke(bristles, origin, destination, oldAngle, newAngle){
        bristles.forEach((bristle) => {
          this.ctx.beginPath();
          const bristleOrigin = rotatePoint(
            bristle.distance - strokeWidth / 2,
            oldAngle,
            origin
          );
      
          const bristleDestination = rotatePoint(
            bristle.distance - strokeWidth / 2,
            newAngle,
            destination
          );
          const controlPoint = rotatePoint(
            bristle.distance - strokeWidth / 2,
            newAngle,
            origin
          );
      
          this.strokeBristle(bristleOrigin, bristleDestination, bristle, controlPoint);
        });
      };


      continueStroke(newPoint)  {
        const newAngle = this.getNewAngle(this.latestPoint, newPoint, this.currentAngle);
        this.drawStroke(this.currentBrush, this.latestPoint, newPoint, this.currentAngle, newAngle);
        this.currentAngle = newAngle % (Math.PI * 2);
        this.latestPoint = newPoint;
      };

      startStroke(point){
        colour = document.getElementById("colourInput").value;
        this.currentAngle = undefined;
        this.currentBrush = this.makeBrush(strokeWidth);
        this.drawing = true;
        this.latestPoint = point;
      };


      getTouchPoint(evt) {
        if (!evt.currentTarget) {
          return [0, 0];
        }
        const rect = evt.currentTarget.getBoundingClientRect();
        const touch = evt.targetTouches[0];
        return [touch.clientX - rect.left, touch.clientY - rect.top];
      };

      mouseMove(evt) {
        if (!this.drawing ) {
          return;
        }
        this.continueStroke([evt.offsetX, evt.offsetY]);
      };

      mouseDown(evt){
        if (this.drawing || !this.isDrawingFlag ) {
          return;
        }
        evt.preventDefault();
        this.canvas.addEventListener("mousemove", this.mouseMove.bind(this), false);
        this.startStroke([evt.offsetX, evt.offsetY]);
      };

      mouseEnter(evt){
        if (!mouseButtonIsDown(evt.buttons) || this.drawing ) {
          return;
        }
        this.mouseDown(evt);
      };

      endStroke(evt){
        if (!this.drawing ) {
          return;
        }
        this.drawing = false;
        evt.currentTarget.removeEventListener("mousemove", this.mouseMove.bind(this), false);
      };

      touchStart(evt){
        if (this.drawing  || !this.isDrawingFlag) {
          return;
        }
        evt.preventDefault();
        this.startStroke(this.getTouchPoint(evt));
      };

      touchMove(evt){
        if (!this.drawing ) {
          return;
        }
        this.continueStroke(this.getTouchPoint(evt));
      };

      touchEnd(evt){
    	  this.drawing = false;
      };
      
}


export default Paint;