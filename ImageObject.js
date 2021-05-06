import Point from './point.js'

const FOLLOW_SPEED = 0.5;

export default class ImageObject{
    constructor(x,y,target,background,textimage){
        this.image = new Image();
        this.image.crossOrigin = "anonymous";
        this.image.onload = ()=>{
            this.imageload =true;
            this.drawBackground =true;
            this.calRatio();

        }
        
        this.image.src = target.src;
        
        
        
        //this.image.src = URL.createObjectURL(target.src);

        this.pos = new Point(x,y);
        this.target = new Point(x,y);
        this.prevPos = new Point();
        this.downPos = new Point();
        this.mousePos =new Point();
        this.centerPos = new Point();
        this.origin = new Point();
        
        this.radius = 0;
        
        this.imagewidth =target.width;
        this.imageheight =target.height;
        this.width = this.imagewidth;
        this.height =this.imageheight;

  
        this.isDown = false;
        this.isMove = false;
        //임시 크리트
        this.isCreateMenu =false;
        this.isRotateDown = false;
        
        //크기 및 회전 flag
        this.isTransition = true;
        //background Image는 최적화를 위해 1번만 draw위한 flag
        this.drawBackground = false;
        
        
        //canvas image load전에 캔버스에 그리지말아라
        this.imageload = false;
        this.updateflag = false;
        this.deleteflag =false;
        //이미지가 배경인지 아닌지 확인
        this.isBackground = background;
        this.isTextImage = textimage;
        //scale rangebutton 및 delete버튼 담는 div
        this.container = null;
        this.range = document.createElement("input")
        this.deletebutton = document.createElement("button");
        this.sizebutton = document.createElement("button");
        this.rotatebutton = document.createElement("button");
        this.canvas = document.querySelector('#main-layer');
        
       

        //this.createmenu();

    }
    
    calRatio(){
    	let hRatio = this.width/ this.canvas.width     ;
        let vRatio = this.height /this.canvas.height  ;
        this.ratio  = Math.min ( hRatio, vRatio );
    }

    resize(stageWidth,stageHeight,scaleX,scaleY){
        this.pos.x = (stageWidth -this.width);
        this.pos.y = stageHeight - this.height;

        this.target = this.pos.clone();
        this.prevPos = this.pos.clone();
    }


    draw(ctx){
        const move = this.target.clone().subtract(this.pos).reduce(FOLLOW_SPEED);
        this.pos.add(move);
        ctx.beginPath();
        if(this.imageload &&!this.isBackground &&!this.isTextImage){
        	ctx.save();
          ctx.translate(this.pos.x+(this.width/2),this.pos.y+(this.height/2))
          //ctx.drawImage(this.image,this.pos.x,this.pos.y,this.width ,this.height);
            ctx.rotate(this.radius*180/Math.PI);
          ctx.translate((this.pos.x-(this.width/2)),(this.pos.y-(this.height/2)))
          ctx.drawImage(this.image,-this.pos.x,-this.pos.y,this.width,this.height);
          ctx.closePath();
          ctx.restore();
        
        }else if( this.imageload && this.isBackground&&!this.isTextImage){
        	
        	ctx.drawImage(this.image,0,0,this.image.width,this.image.height,0,0,this.canvas.width,this.canvas.height);
        	this.drawBackground = false;
        	
        }else if(this.isTextImage && this.imageload){
        	ctx.drawImage(this.image,this.pos.x,this.pos.y,this.width,this.height);
        }
        
        if(this.isDown){
        ctx.beginPath();
        ctx.setLineDash([5]);
        ctx.strokeStyle = "red";
        ctx.rect(this.pos.x,this.pos.y,this.width,this.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.strokeStyle = "black";

        }
    }

    down(point){
        
        if(point.collide(this.pos,this.width,this.height)&&!this.isDown){
            this.isDown = true;
            if(this.container===null){
            	this.container =document.createElement("div")
            	this.createmenu();
            }
            
            
            this.container.style.display= "flex"
            
            

            return this;
        }else if(point.collide(this.pos,this.width,this.height)&&this.isDown){
            this.startPos = this.pos.clone();
            this.downPos = point.clone();
            this.mousePos = point.clone().subtract(this.pos);
            

            
            this.isMove = true;
            return this;
        }else{
            this.isDown = false;
            if(this.container){
            this.container.style.display = "none"
            }
            return null;
        }
    }

    //이미지를 따라 다니는 MENU 생성
    createmenu(){
            let rect = this.canvas.getBoundingClientRect();

            let scaleX = this.canvas.width/rect.width;
            let scaleY = this.canvas.height/rect.height;
            this.container.style.width=this.imagewidth;
            this.container.style.height=this.imageheight;
            this.container.style.display="none";
            this.container.style.position="absolute";
            this.container.style.flexDirection="column";
            this.container.style.left=String((this.pos.x+rect.left)/scaleX)+"px";
            this.container.style.top=String((this.pos.y+rect.top-40)/scaleY)+"px";
            document.body.appendChild(this.container);
            
            this.container__rowOne = document.createElement('div');
            this.container__rowTwo = document.createElement('div');
            this.container__rowTwo.style.display="flex";
            this.container__rowTwo.className="container__rowTwo";
            
            
            this.range.type = "range"
            this.range.id="volume"
            this.range.min="1"
            this.range.max="3"
            this.range.value=1;
            this.range.step="0.01"
            
            this.deletebutton.innerText="삭제";
            this.deletebutton.style.width ="100%";
            this.deletebutton.id = "option__delete"
            this.deletebutton.className = "option__button";
            
            this.sizebutton.innerText="크기";
            this.sizebutton.style.width ="100%";
            this.sizebutton.id = "option__size";
            
            this.sizebutton.className = "option__button active";
            
            this.rotatebutton.innerText="회전";
            this.rotatebutton.style.width ="100%";
            this.rotatebutton.id = "option__rotate";
            this.rotatebutton.className = "option__button"	
            	
  
            
            this.container__rowOne.appendChild(this.range);
            this.container__rowTwo.appendChild(this.sizebutton);
            this.container__rowTwo.appendChild(this.rotatebutton);
            this.container__rowTwo.appendChild(this.deletebutton);
            
            this.container.appendChild(this.container__rowOne);
            this.container.appendChild(this.container__rowTwo);
            //this.container.appendChild(this.rotaterange);
            this.range.addEventListener("input",this.handleSize.bind(this),false);
            
            this.container__rowTwo.addEventListener("click",this.handleButtonClick.bind(this),false);
            this.deletebutton.addEventListener("click",this.containerdelete.bind(this),false);

            this.isCreateMenu=true;
    }
    
    
    
    containerdelete(){
        this.container.remove();
        this.deleteflag=true;
       
        
    }
    handleButtonClick(e){
    	let type = e.target.id
    	for(let i=0;i<e.currentTarget.childElementCount;i++){
    		e.currentTarget.children[i].classList.remove('active');
    	}
    	switch(type){
    		case "option__size":
    			this.isTransition=true;
    			this.range.value = this.sizevalue || 1;
    			e.target.classList.add('active')
    			break;
    		case "option__rotate":
    			this.isTransition=false;
    			this.range.value = this.rotatevalue || 1;
    			e.target.classList.add('active')
    			break;
    			
    	}
    
    }
    handleSize(e){
    	
        let rangevalue = parseFloat(e.target.value)
        if(this.isTransition){
        	  this.sizevalue = rangevalue;
        	  this.width = this.imagewidth*rangevalue;
              this.height = this.imageheight*rangevalue;
        }else{
        	this.rotatevalue = rangevalue;
        	this.radius = rangevalue*0.1
        }
      
    }

    //이미지 이동에 따른 container 좌표 변경
    move(point){

        if(this.isMove){
        	if(true){
        		
        	}
            let rect = this.canvas.getBoundingClientRect();
            let bodyrect = document.body.getBoundingClientRect();

            let offset_top = rect.top - bodyrect.top;
            let offset_left = rect.left - bodyrect.left;

            let offset_bottom = rect.bottom;
            let offset_right = rect.right;
            
            
            let scaleX = this.canvas.width/rect.width;
            let scaleY = this.canvas.height/rect.height;

            this.container.style.left=String((this.pos.x+rect.left)/scaleX)+"px";
            this.container.style.top=String((this.pos.y+rect.top-40)/scaleY)+"px";
            
            if((offset_top<(this.pos.y+offset_top))
                    && (offset_right>(this.pos.x+this.imagewidth+offset_left)) 
                    && (offset_bottom>(this.pos.y+this.imageheight+offset_top))
                    && (offset_left<this.pos.x+offset_left)){
            	this.target = this.startPos.clone().add(point).subtract(this.downPos);
                
            }else{
            	//캔버스 범위를 벗어났을경우
            	if(offset_top>(this.pos.y+offset_top)){
            		this.target.y += 10;
            	}
            	if((offset_right<(this.pos.x+this.imagewidth+offset_left))){
            		this.target.x -= 10+this.imagewidth;
            	}
            	
            	if(offset_bottom<(this.pos.y+this.imageheight+offset_top)){
            		this.target.y -= 10+this.imageheight;
            	}
            	
            	if(offset_left>this.pos.x+offset_left){
            		this.target.x += 10;
            	}
            }
            
            //this.target = this.startPos.clone().add(point).subtract(this.downPos);
        
        }
    }

    up(){

        this.isMove=false;
    }
}