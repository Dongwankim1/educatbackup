const MAXIMAGEWIDTH = 100;
const MAXIMAGEHEIGHT = 100;



export default class ImageMover{
    constructor(){
        this.image = new Image();
        this.image_clone = null;
        this.stop_image = null;

    }



    clone(e){
        this.image_clone = this.image.cloneNode();
        this.image_clone.src = e.target.src;
        const max = e.target.naturalHeight>e.target.naturalWidth ? true : false;
        let ratio
        let customwidth,customheight;
        if(max){
        	ratio =e.target.naturalHeight/100;
        	customheight = MAXIMAGEHEIGHT;
        	customwidth = e.target.naturalWidth/ratio;
        }else{
        	ratio =e.target.naturalWidth/100;
        	customwidth = MAXIMAGEWIDTH;
        	customheight = e.target.naturalHeight/ratio;
        }
        
        this.image_clone.width = customwidth;
        this.image_clone.height =customheight;
        
        this.image_clone.style.left = e.clientX-(customwidth/2);
        this.image_clone.style.top =  e.clientY-(customheight/2);
        this.image_clone.style.zIndex = 3;
        this.image_clone.style.position = "absolute";
        this.image_clone.style.opacity =0.5;
        this.image_clone.id ="image_clone";
        document.body.appendChild(this.image_clone);
    }

    createStopImage(e){
        this.stop_image = new Image();
        this.stop_image.src = "/output/assets/image/stop.png";
        this.stop_image.width=MAXIMAGEWIDTH;
        this.stop_image.height=MAXIMAGEHEIGHT;
        this.stop_image.style.position="absolute";
        this.stop_image.id="stop_image";
        this.stop_image.style.display="block";
        this.stop_image.style.opacity =0.5;
        this.stop_image.style.zIndex = 2;
 

        this.stop_image.style.left = e.clientX-(MAXIMAGEWIDTH/2);
        this.stop_image.style.top = e.clientY-(MAXIMAGEHEIGHT/2);

        document.body.appendChild(this.stop_image)
    }

    clear(){

    }
    updateMousePoint(e){
        

        let clientX,clientY;
        
        if(e.type==="touchmove"){
        	clientX = e.touches[0].clientX;
        	clientY = e.touches[0].clientY;
        }else{
        	clientX = e.clientX;
        	clientY = e.clientY
        }
        
        let mouse_pos_x = String(clientX-(this.image_clone.width/2))+"px";
        let mouse_pos_y = String(clientY-(this.image_clone.height/2))+"px";

        return [clientX,clientY];
    }
    move(e){
        
        const canvas = document.querySelector('#main-layer');

        let rect = canvas.getBoundingClientRect();
        let bodyrect = document.body.getBoundingClientRect();

        let offset_top = rect.top - bodyrect.top;
        let offset_left = rect.left - bodyrect.left;

        let offset_bottom = rect.bottom;
        let offset_right = rect.right;
        
        let mousePos = this.updateMousePoint(e);



        if((offset_top>mousePos[1]-(this.image_clone.height/4)) 
        || (offset_right<mousePos[0]+(this.image_clone.width/2)) 
        || (offset_bottom<mousePos[1]+(this.image_clone.height)/4)
        || (offset_left>mousePos[0]-(this.image_clone.width/2))){
            this.image_clone.style.opacity =0.5;
            this.stop_image.style.left = mousePos[0]-(MAXIMAGEWIDTH/2);
            this.stop_image.style.top = mousePos[1]-(MAXIMAGEHEIGHT/2);
            this.stop_image.style.display="block"
            	
        }else{
            this.image_clone.style.opacity = 1;
            this.stop_image.style.display="none"
        }
        

        this.image_clone.style.left=mousePos[0]-(this.image_clone.width/2);
        this.image_clone.style.top=mousePos[1]-(this.image_clone.height/2);
    

    }
    cloneDelete(e,ctx){
           
            document.querySelector('#stop_image').remove();
            document.querySelector('#image_clone').remove()
    }


}