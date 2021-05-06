class Flip{
	constructor()
	{	
		this.bookblock = document.querySelector('.bb-bookblock');
		this.getUrlImage(this.loadImage.bind(this))
		
		
		document.querySelector('.writing').addEventListener('click',this.setMenuDiv.bind(this))
		document.querySelector('.bt__writepage').addEventListener('click',this.renderWritingPage.bind(this),false);

	}
	
	resize(){
		
	}
	
	renderWritingPage(){

		document.form1.submit();
	}

	getUrlImage(callback){
		 let textdata ={
		            "bookSeq":BOOKSEQ,
		        }
		        const xhr = new XMLHttpRequest();

				xhr.open("post", "/main/data/selectBookDetailList.do", true);

				xhr.onreadystatechange = function() { //폴백

					if (xhr.readyState == 4) {

						if (xhr.status == 200) { //200은 잘넘어왔단 것이다.
							const dataurls = JSON.parse(xhr.response).resultBookPageUrl
							callback(dataurls);

						} else {

							alert("요청오류 : " + xhr.status);

						}

					}

				}


				//post방식은 xhr객체에 데이터를 붙여서 전송

		        xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.send(JSON.stringify(textdata)); 

			
	}

	loadImage(urlArray){
		let loadcount = urlArray.length;
		let _this = this
		for (let i=0;i<urlArray.length+1;i++){
			let bbitem = document.createElement('div');
			bbitem.className = 'bb-item'
			let taga = document.createElement('a');
			
			let img = new Image();
			taga.appendChild(img);
			bbitem.appendChild(taga);
			this.bookblock.appendChild(bbitem);
			
			
			
			img.onload = function(){

				--loadcount;
				if(loadcount<0){
					
					
					document.querySelector('.logo').style.display = 'none';
					
					var Page = this.setFlipPage();
					
					Page.init();
					
				}
			}.bind(this)
			
			if(i===urlArray.length){
				img.src = '/output/assets/image/paper.png';
			}else{
				img.src = urlArray[i];
			}
			
			
		}
	}
	
	setMenuDiv(){
		document.querySelector('.bb-bookmenu').style.display='none';
		document.getElementById('bb-nav-first').click();
		document.querySelector('.bb-nav-menu').style.display='block';
	}
	
	setFlipPage(){
		var config = {
				$bookBlock : $( '#bb-bookblock' ),
				$navNext : $( '#bb-nav-next' ),
				$navPrev : $( '#bb-nav-prev' ),
				$navFirst : $( '#bb-nav-first' ),
				$navLast : $( '#bb-nav-last' )
			},
			init = function() {
				config.$bookBlock.bookblock( {
					speed : 800,
					shadowSides : 0.8,
					shadowFlip : 0.7,
					onEndFlip : function(old,page,isLimit){

						if(page!=0&&isLimit){
							document.querySelector('.bb-bookmenu').style.display='flex';
							document.querySelector('.bb-nav-menu').style.display='none';

						}
					},
					onBeforeFlip: function( old,page,isLimit ) { 
					}
				} );
				initEvents();
			},
			initEvents = function() {
				
				var $slides = config.$bookBlock.children();

				// add navigation events
				config.$navNext.on( 'click touchstart', function() {
					config.$bookBlock.bookblock( 'next' );
					return false;
				} );

				config.$navPrev.on( 'click touchstart', function() {
					config.$bookBlock.bookblock( 'prev' );
					return false;
				} );

				config.$navFirst.on( 'click touchstart', function() {
					config.$bookBlock.bookblock( 'first' );
					return false;
				} );

				config.$navLast.on( 'click touchstart', function() {
					config.$bookBlock.bookblock( 'last' );
					return false;
				} );
				
				// add swipe events
				$slides.on( {
					'swipeleft' : function( event ) {
						config.$bookBlock.bookblock( 'next' );
						return false;
					},
					'swiperight' : function( event ) {
						config.$bookBlock.bookblock( 'prev' );
						return false;
					}
				} );

				// add keyboard events
				$( document ).keydown( function(e) {
					var keyCode = e.keyCode || e.which,
						arrow = {
							left : 37,
							up : 38,
							right : 39,
							down : 40
						};

					switch (keyCode) {
						case arrow.left:
							config.$bookBlock.bookblock( 'prev' );
							break;
						case arrow.right:
							config.$bookBlock.bookblock( 'next' );
							break;
					}
				} );
			};

			return { init : init };
	}
}

window.onload = () =>{
	new Flip();
}