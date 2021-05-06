export default class educatAPI{
    constructor(){
        this.url ="";
    }

    getImageData(){

    }

    getStickerData(callback,dataarray){
    	
    	const text = dataarray[0];
    	const bookSeq = dataarray[1];
    	const illustDiv = dataarray[2]; 
    	
        let formdata = new FormData();
        formdata.enctype='multipart/form-data';
        formdata.method='post';
        formdata.append('text',text);
        formdata.append('bookSeq',bookSeq);
        formdata.append('illustDiv',illustDiv);
        const xhr = new XMLHttpRequest();

		xhr.open("post", "/main/data/selectWordIllustList.do", true);

		xhr.onreadystatechange = function() { //폴백

			if (xhr.readyState == 4) {

				if (xhr.status == 200) { //200은 잘넘어왔단 것이다.
					
					callback(JSON.parse(xhr.response),text);
					

				} else {

					alert("요청오류 : " + xhr.status);

				}

			}

		}
		//post방식은 xhr객체에 데이터를 붙여서 전송
		xhr.send(formdata); 


    }
    completeImage(imagebase64,action,callback){
    	document.getElementById("imageBase64").value = imagebase64;
    	document.pageinfo.action = action;
    	document.pageinfo.submit();
    	
    }
    
    /*
    imageTransition(imagebase64,action,callback){
    	
    	let formdata = new FormData();
        formdata.enctype='multipart/form-data';
        formdata.method='post';
        formdata.append('imageBase64',imagebase64);
        formdata.append('bookSeq',"1");
        formdata.append('inputSeq',"1");
        formdata.append('inputPage',"1");
        const xhr = new XMLHttpRequest();

		xhr.open("post", "/main/data/saveInputDataToImage.do", true);

		xhr.onreadystatechange = function() { //폴백

			if (xhr.readyState == 4) {

				if (xhr.status == 200) { //200은 잘넘어왔단 것이다.
					
					//callback(JSON.parse(xhr.response),text);
					if(true){
						
					}else{
						
					}
					
				} else {

					alert("요청오류 : " + xhr.status);

				}

			}

		}


		//post방식은 xhr객체에 데이터를 붙여서 전송

     
		xhr.send(formdata); 
    }*/
    
    /*
    materialtran(){
    	const originalimage = this.canvas.toDataURL('image/png');
    	 
    	this.animateflag = false;
    	
    	const newImage = new Image();
    	this.ctx.clearRect(0,0,this.stageWidth,this.stageHeight);
    	newImage.onload = function(){
    		
    		this.ctx.drawImage(newImage,0,0,this.canvas.width,this.canvas.height);
    		
    		this.ctx.beginPath();
    	    this.ctx.globalCompositeOperation = "multiply"; 
    	    this.ctx.drawImage(this.imagematerial,0,0,this.canvas.width,this.canvas.height);
    	        	
    	    this.ctx.closePath();
    	    
    	    
    	    const imageBase64 = this.canvas.toDataURL('image/png');
    	    this.educataAPI.completeImage(imageBase64,action,function(){});
    	    document.querySelector('.logo').style.display='none';
    	    
    	}.bind(this)
    	
    	newImage.src = originalimage;
    }
    */
}
    