const rearrangingDuration = 350;

class App {
    constructor() {

        //북데이터 리스트
        this.bookList= null;
        
        
        this.selectedIndex=null;
        //삭제한 수
        this.deleteCount = 0;
       
        this.init(this.createElemArray.bind(this),this.initHandler.bind(this),this.reSortArray.bind(this));
    }
  init(createElemArray,handler,reSortArray){


	  	let formdata = new FormData();
        formdata.enctype='multipart/form-data';
        formdata.method='post';
        formdata.append('bookSeq',bookSeq);
        formdata.append('inputSeq',inputSeq);
         const xhr = new XMLHttpRequest();

 		xhr.open("post", "/draw/data/selectInfoBookData.do", true);

 		xhr.onreadystatechange = function() { // 폴백

 			if (xhr.readyState == 4) {

 				if (xhr.status == 200) { // 200은 잘넘어왔단 것이다.
 					let bookInfo = JSON.parse(xhr.response);
 					//book 데이터 array
 					this.bookList = bookInfo.myBookList;
 					this.maxInputPage = bookInfo.lastInputPage;
 					createElemArray();
 					handler();
 					reSortArray();
 					
 				} else {

 					alert("요청오류 : " + xhr.status);

 				}

 			}

 		}.bind(this)
 		// post방식은 xhr객체에 데이터를 붙여서 전송
 		xhr.send(formdata); 

    }
    createElemArray(){
    	const gridElem = document.querySelector('.updateStory__grid');
    	for(let i=0;i<this.bookList.length;i++){
    		let userPageDiv = document.createElement('div');
    		userPageDiv.className = 'updateStory__userPageInfo';
    		let userImageElem = document.createElement('img');
    		userImageElem.src = this.bookList[i].inputImage;
    		let userSpanElem = document.createElement('span');
    		userSpanElem.innerText = "페이지번호: "+ this.bookList[i].inputPage;
    		gridElem.appendChild(userPageDiv);
    		userPageDiv.appendChild(userImageElem);
    		userPageDiv.appendChild(userSpanElem);
    		
    	}
    }
  	
    initHandler(){
    	  this.draggableElArr = document.querySelectorAll('.updateStory__userPageInfo');
    	  
    	  for(let i=0;i<document.querySelector('.updateStory__grid').children.length;i++){
    	        document.querySelector('.updateStory__grid').children[i].addEventListener('mousedown', this.handleDragStart.bind(this), false);
    	       }
    	       
    	        document.getElementById('bt_addPage').addEventListener('click',this.addPage.bind(this),false);

    	        document.getElementById('bt_prev').addEventListener('click',this.handlePrevMove.bind(this),false);
    	        document.getElementById('bt_next').addEventListener('click',this.handleNextMove.bind(this),false);
    	        document.getElementById('bt_delete').addEventListener('click',this.handleDelete.bind(this),false);
    	        document.getElementById('bt__completePage').addEventListener('click',this.completePage.bind(this),false);
    	      
    	        
    }
    
    completePage(){

    	  let formdata = new FormData();
          formdata.enctype='multipart/form-data';
          formdata.method='post';
          formdata.append('data',JSON.stringify(this.bookList));
          formdata.append('deleteCount',this.deleteCount);
          formdata.append('bookSeq',bookSeq);
          formdata.append('inputSeq',inputSeq);
          const xhr = new XMLHttpRequest();

  		xhr.open("post", "/draw/data/updateInfoBookData.do", true);

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
    
    addPage(){
    	let action = '/main/data/addStoryWrite.do';
    	
    	document.pageinfo.bookSeq.value = bookSeq;
    	document.pageinfo.inputSeq.value = inputSeq;
    	document.pageinfo.inputPage.value = parseInt(this.maxInputPage);
    	
    	document.pageinfo.action = action;
    	document.pageinfo.submit();
    	
    	
    }
  
    reSortArray(){
        const elems = document.querySelectorAll('.updateStory__userPageInfo');
        for(let i=0;i<elems.length;i++){
            elems[i].dataset.index=i;
        }
    }
    handleDelete(e){
    	
		 const elem = document.querySelectorAll('.updateStory__userPageInfo');
		 if(this.selectedIndex ===null){ return; } this.deleteCount++
		 this.bookList.splice(this.selectedIndex,1);
		 elem[this.selectedIndex].remove();
		 console.log(this.bookList);
		 
        
    }
    handlePrevMove(e){
     
        const elem = document.querySelectorAll('.updateStory__userPageInfo');
        if(this.selectedIndex<1){
            return;
         }
        const parent = elem[this.selectedIndex].parentNode;

        parent.insertBefore(elem[this.selectedIndex],parent.children[this.selectedIndex-1])
        let data = this.bookList.splice(this.selectedIndex,1);
        this.bookList.splice(this.selectedIndex-1,0,data[0]);
        console.log(this.bookList);
       
        this.selectedIndex--;
        
    }

    handleNextMove(e){
      
        const elem = document.querySelectorAll('.updateStory__userPageInfo');
       
        if(this.selectedIndex>=elem.length-1){
            return;
         }
        const parent = elem[this.selectedIndex].parentNode;

        parent.insertBefore(elem[this.selectedIndex],parent.children[this.selectedIndex+2])
        let data = this.bookList.splice(this.selectedIndex,1);
        this.bookList.splice(this.selectedIndex+1,0,data[0]);
        console.log(this.bookList);
        
        this.selectedIndex++;
        
    }

    handleDragStart(e) {
        const elem = document.querySelectorAll('.updateStory__userPageInfo');
        for (let i = 0; i < elem.length; i++) {
            elem[i].style.border = "";
            if(elem[i].dataset.index===e.currentTarget.dataset.index){
                this.selectedIndex = i;

            }
        }

        if(e.currentTarget.className==="updateStory__grid"){
            this.selectedIndex = null;
            return;
        }
       

        let sortedArr = [];
        for (let i = 0; i < this.draggableElArr.length; i++) {
            let elIndex = this.draggableElArr[i].dataset.index;
            sortedArr[elIndex] = this.draggableElArr[i];
        }


        e.currentTarget.style.border = '0.5rem solid red';
        e.currentTarget.style.transition = 'all 100ms ease';
    }

  
 
}

window.onload = () => {
    new App();
}