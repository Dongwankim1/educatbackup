import ImageMover from './ImageMover.js'
import educataAPI from './educatAPI.js'
import ImageObject from './ImageObject.js'
import Point from './point.js'
import Particle from './particle.js'
import Paint from './paint.js'

const CANVASWIDTH = document.querySelector('.canvas__wrap').clientWidth;
const CANVASHEIGHT = document.querySelector('.canvas__wrap').clientHeight;

class App{
    constructor(){
        this.canvas = document.querySelector('#main-layer');
        this.ctx = this.canvas.getContext('2d');
        this.backgroundCanvas = document.querySelector('#background-layer');
        this.backgroundCtx = this.backgroundCanvas.getContext('2d');
        this.image = "";
        this.isDrawing = false;
        this.mousePos = new Point();
        this.curItem = null;
        //이미지 배열
        this.items = [];
        var color = tinycolor("red");
        
        //setTimeout object
        this.setImageClone = null;
        
        
        //click effect particle 배열
        this.particleArray = [];
        this.targetsrc = null;
        
        this.background =null ;
       
        //background 확인
        this.isBackground = false;
        this.isAnimating = true;
        this.isPaintFlag = false;
        
        
        this.backload=true;
        
        //캔버스 이미지 클릭 Flag
        this.selectedImage = null;
        
        
        this.pixelRatio = window.devicePixelRatio > 1?2:1;
        this.educataAPI = new educataAPI();
        this.imagemover = new ImageMover();
        this.paint = new Paint();
        
        window.addEventListener('resize',this.resize.bind(this));
        this.resize();
        
        this.clickCreateEffect = new Audio("/output/assets/sound/imagecreateeffect.mp3");
        
        window.addEventListener('mousedown',this.dropdown.bind(this),false);
        window.addEventListener('mousemove',this.dropmove.bind(this),false);
        window.addEventListener('mouseup',this.dropup.bind(this),false);
        window.addEventListener('touchstart',this.dropdown.bind(this),{passive: false});
        window.addEventListener('touchmove',this.dropmove.bind(this),{passive: false});
        window.addEventListener('touchend',this.dropup.bind(this),{passive: false});
   
        
        
        
        document.querySelector('.image__wordlist').addEventListener('click',this.getAnlysisImage.bind(this),false);
        document.querySelector('.bt__complete').addEventListener('click',this.handleTransfer.bind(this),false);
        document.querySelector('.bt__temporaryStorage').addEventListener('click',this.sendObjectDataPoint.bind(this),false);
        
        
        document.querySelectorAll('.menu__itemwrap').forEach(elem=>{
        	elem.addEventListener('click',this.handleMenu.bind(this));
        })
        
        /* 이미지 재질
        this.imagematerial = new Image();
        this.imagematerialflag =false;
        this.imagematerial.onload = function(){
        	this.imagematerialflag=true;
        }.bind(this)
        
        this.imagematerial.src = "/output/assets/image/1.jpg";
        */
        
        this.createTextImage();
        this.animate();
        
        

    }
    //임시저장을 위한 데이터 저장
    sendObjectDataPoint(){
    	let jsonItemArray = new Array();
    	for(let i=0;i<this.items.length;i++){
    		let objectItem = new Object();
    		objectItem.imageUrl = this.items[i].image.currentSrc;
    		objectItem.posX = this.items[i].pos.x;
    		objectItem.posY = this.items[i].pos.y;
    		objectItem.width = this.items[i].width;
    		objectItem.height = this.items[i].height;
    		objectItem.radius = this.items[i].radius;
    		objectItem.isTextImage = this.items[i].isTextImage ? "1" : "0" ;
    		objectItem.isBackground = this.items[i].isBackground ? "1" : "0" ;
    		objectItem.canvasWidth = this.canvas.width;
    		objectItem.canvasHeight = this.canvas.height;
    		jsonItemArray.push(objectItem);
    		
    		
    	}
    	if(this.background!==null){
    		let objectItem = new Object();
    		objectItem.imageUrl = this.background.image.currentSrc;
    		objectItem.posX = this.background.pos.x;
    		objectItem.posY = this.background.pos.y;
    		objectItem.width = this.background.width;
    		objectItem.height = this.background.height;
    		objectItem.radius = this.background.radius;
    		objectItem.isTextImage = this.background.isTextImage ? "1" : "0" ;
    		objectItem.isBackground = this.background.isBackground ? "1" : "0" ;
    		objectItem.canvasWidth = this.canvas.width;
    		objectItem.canvasHeight = this.canvas.height;
    		jsonItemArray.push(objectItem);
    	}
    	
    	let formdata = new FormData();
        formdata.enctype='multipart/form-data';
        formdata.method='post';
        formdata.append('objectItem',JSON.stringify(jsonItemArray));
        formdata.append('bookSeq',bookSeq);
        formdata.append('inputSeq',inputSeq);
        const xhr = new XMLHttpRequest();

		xhr.open("post", "/draw/data/temporaryStorageInfoBookData.do", true);

		xhr.onreadystatechange = function() { //폴백

			if (xhr.readyState == 4) {

				if (xhr.status == 200) { //200은 잘넘어왔단 것이다.
					this.deleteCount= 0;
					//callback(JSON.parse(xhr.response),text);
					

				} else {
					
					alert("요청오류 : " + xhr.status);

				}

			}

		}
		//post방식은 xhr객체에 데이터를 붙여서 전송
		xhr.send(formdata); 
    	
    	
    }
    
    
    getAnlysisImage(e,backgroundflag){
    	if(e.target.className){
    		
    		let dataarray = new Array(3);
    		
    		
    		
    		if(backgroundflag){
    			dataarray[0]= "배경"
    			dataarray[1] = bookSeq;
    			dataarray[2] = "B"
        		this.isBackground = true;
        	}else{
        		dataarray[0] = e.target.innerText;
        		dataarray[1] = "";
        		dataarray[2] = "I"
        		this.isBackground = false;
        	}
    		
    		this.educataAPI.getStickerData(this.setStickerImage,dataarray);
    	}
    	
    }
    
    setStickerImage(data,text){
    	
    	const resultIllustUrl = data.resultIllustUrl;
    	
    	document.querySelectorAll('.item').forEach((data)=>{data.remove()})
    	
    	for(let i =0;i<resultIllustUrl.length;i++){
    		let imageli = document.createElement('li');
    
    		imageli.className = "item";
    		
            
    		let img = new Image();
    		img.className = "image__item";
    		
            img.onload = function(){
                //image 배율로 줄이기
                const m = img.width/90;
                img.width = 90;
                img.height = img.height/m;
                imageli.appendChild(img)
                document.querySelector('.items').appendChild(imageli);
            }

    		img.src = resultIllustUrl[i];
    		
    	}
        
    }
    


    resize(e){
        let pixelRatio = window.devicePixelRatio > 1?2:1; 
        this.stageWidth = CANVASWIDTH;
        this.stageHeight = CANVASHEIGHT;
        this.canvas.width = this.stageWidth;
        this.canvas.height = this.stageHeight;
        this.backgroundCanvas.width = this.stageWidth;
        this.backgroundCanvas.height = this.stageHeight;
       

        let rect = this.canvas.getBoundingClientRect();
        let scaleX = this.canvas.width/rect.width;
        let scaleY = this.canvas.height/rect.height;

        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 3;
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = `rgba(0,0,0,0.1)`;
        this.ctx.lineWidth = 2;
        
        for(let i=0;i<this.items.length;i++){
            this.items[i].resize(this.stageWidth,this.stageHeight,scaleX,scaleY)
        }
        
    	 
        const wraprect = document.querySelector('.canvas__wrap');
        
        this.canvas.style.top = wraprect.offsetTop;
        this.backgroundCanvas.style.top = wraprect.offsetTop;
        
    }

    animate(){
    	if(this.isAnimating){
    	try{
    		
        
	        this.ctx.clearRect(0,0,this.stageWidth,this.stageHeight);
	        

	     
	        	if(this.background!==null){
	        		if(this.background.drawBackground){
	        		this.background.draw(this.backgroundCtx);
	        		}
	        	}
	        	
	        
	      
	     
	        if(this.particleArray.length>0){
	        	this.handleParticles();
	        }
	        
	        for (let i = 0;i<this.items.length;i++){
	            if(!this.items[i].isBackground){
	            	 this.items[i].draw(this.ctx);
	 	            if(this.items[i].deleteflag){
	 	                this.items.splice(i,1)
	 	                break
	 	            }
	            }
	           
	        }
	        
    	window.requestAnimationFrame(this.animate.bind(this));
    	}catch(err){
    		console.log(err);
    	}
    	}
    }
    
    //다시쓰기 및 완료 버튼 litener
    handleTransfer(e){
    	let action;
    	if(e.currentTarget.className==="bt__complete"){
    		action ='/draw/data/saveInputDataToImage.do'
    	}else if(e.currentTarget.className==="bt__addpage"){
    		action ='/main/data/addStoryWrite.do'
    	}
    	this.isAnimating = false;
    	
    	document.querySelector('.logo').style.display='block';
    	
    	const originalimage = this.canvas.toDataURL('image/png');
    	this.educataAPI.completeImage(originalimage,action,function(){});
    	
    
    	
    }

   

    dropdown(e){
    	
        if(e.target.id==="volume" || e.target.id==="delete" || e.target.className==="option__button active" || e.target.className==="option__button"){
            return;
           
        }else{
     
        	
        this.mousePointUpdate(e);
        
        
        
        for (let i =this.items.length - 1;i>=0;i--){
            const item = this.items[i].down(this.mousePos.clone(),e)

            if(item){
                this.curItem = item;
                const index = this.items.indexOf(item);
                this.items.push(this.items.splice(index,1)[0])

                break;
            }
        }
        
        	  if(e.target.tagName ==="IMG" && e.target.parentNode.className==="item"){
        		  this.setImageClone = setTimeout(function(){
                  this.imagemover.clone(e);
                  this.imagemover.createStopImage(e);
                  this.targetsrc = e.target.src;
                  this.isDrawing = true;
        		  }.bind(this), 1500);
              }
		
        

    }
    }

    dropmove(e){
    	this.mousePointUpdate(e);

        
        for (let i=0;i<this.items.length;i++){
         
            this.items[i].move(this.mousePos.clone())
        }
        
        if(this.imagemover !== "" && this.isDrawing){
        	e.preventDefault();
            this.imagemover.move(e);
        }
    }

    dropup(e){
    	
   
    	
    	//this.mousePointUpdate(e);
        this.curItem = null;
        
        for (let i=0;i<this.items.length;i++){
            this.items[i].up();
        }

        if(this.isDrawing){
          
            this.imagemover.cloneDelete();
            this.isDrawing = false;
        }
        window.clearTimeout(this.setImageClone);
        if(this.targetsrc
        	&&((this.mousePos.x>0&&this.mousePos.x<this.canvas.width)
        	&&(this.mousePos.y>0&&this.mousePos.y<this.canvas.height)) ){
        	this.onSoundEffect();
            if(this.isBackground && (e.target.id==="image_clone" || e.target.className==="image__item")){
            	this.background = new ImageObject(0,0,e.target,true,false);
            	
            	
            }else if(e.target.id==="image_clone" || e.target.className==="image__item"){
            	this.createParticle()
               
            	this.items.push(new ImageObject(this.mousePos.x-50,this.mousePos.y-50,e.target,false,false));
            	this.targetsrc=null;
            }
            
        }

    }
    
    mousePointUpdate(e){
    	 let clientX,clientY;
         
         if(e.type==="touchend" || e.type==="touchmove" || e.type==="touchstart"){
         	clientX = e.changedTouches[0].pageX ||0;
         	clientY = e.changedTouches[0].pageY ||0;
         }else{
         	clientX = e.clientX;
         	clientY = e.clientY
         }
    	
    	let rect = this.canvas.getBoundingClientRect();

        let scaleX = this.canvas.width/rect.width;
        let scaleY = this.canvas.height/rect.height;

        //resize된 캔버스 마우스 pos 재정렬
        this.mousePos.x = (clientX - rect.left)*scaleX
        this.mousePos.y = (clientY - rect.top)*scaleY
        
        //this.mousePos.x = clientX;
        //this.mousePos.y = clientY;
    }
    
    onSoundEffect(){
    	this.clickCreateEffect.play();
  
    }
   
    
    createParticle(){
        for (let i=0;i<100;i++){
            this.particleArray.push(new Particle(this.mousePos.x,this.mousePos.y,i*400))
        }
    }
    
    createTextImage(){
    	const canvas =document.createElement('canvas');
    	const conversentece =SENTENCE.split('@');
    	const PIXEL = 24;
    	const linebrake =50;
    	
    	
    	const rect= this.canvas.getBoundingClientRect()
    	
    	const left = rect.left+((rect.right-rect.left)/3)
    	const top = rect.top+((rect.bottom-rect.top)/6);
    	
    	let max = 0;
    	conversentece.forEach((word)=>{
    		if(max<word.length){
    			max = word.length;
    		}
    	})
    	
    	
    	canvas.width=max*PIXEL-10;
    	canvas.height=45*conversentece.length;
    	 const x = 50;
         let y = 40;
    	const ctx = canvas.getContext('2d');
    	
    	var f = new FontFace('BinggraeSamanco-Bold', 'url(/output/assets/fonts/BinggraeSamanco-Bold.ttf)');
    	f.load().then((font)=>{
    		document.fonts.add(font);
    		
            
            conversentece.forEach((word)=>{
    	
            	ctx.font  = `${PIXEL}px BinggraeSamanco-Bold`;
                ctx.fillStyle = 'black';
                ctx.fillText(word,x,y);
                y+=linebrake;
               
            	
            })
       
        
            const imageurl = canvas.toDataURL('image/png');
            const dummyimage = new Image();
            dummyimage.className="text__image"
            dummyimage.style.zIndex="150";
            dummyimage.style.position="absolute";
            dummyimage.style.left = left;
            dummyimage.onload = ()=>{
            	this.items.push(new ImageObject(left,top,dummyimage,false,true));
            	
            }
            dummyimage.src=imageurl
      
    	})
    	
    }

    
    handleParticles(){
        for(let i=0;i<this.particleArray.length;i++){
            this.particleArray[i].update();
            this.particleArray[i].draw(this.ctx);
            if(this.particleArray[i].size<=0.3){
                this.particleArray.splice(i,1);
                i--;
            }
        }
    }
    
    handleMenu(e){
    	let type = e.currentTarget.id;
    	
    	document.querySelectorAll('.menu__itemwrap').forEach(elem=>{
        	elem.classList.remove('active');
        })
    	this.handleInitMenu();
    	
    	e.currentTarget.classList.add('active');
    	
    	
    	//메뉴별 타입
    	if(type==="paint"){
    		
    		this.paint.drawStart();
    	}
    	else if(type==="searchword"){
    		document.querySelector('.image__wordItemList').style.display="block";
    	}else if(type==="background"){
    		this.getAnlysisImage(e,true);
    	}

    	
    }
    
    handleInitMenu(){
    	this.paint.drawStop();
    	
    	document.querySelector('.image__wordItemList').style.display="none";
    }
    
    
    
    
    
}


window.onload = ()=>{
    new App();
}