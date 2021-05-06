$(document).ready(function(){
	console.log('튜토리얼 시작')
	$('input:radio[id=close]').prop("checked", true)
	
	$('input:radio[name=curtain]').change(function () {
		console.log('on/off check')
		if($(this).val() == "open") {
			const maskHeight = $(document).height();
			const maskWidth = $(window).width();
			let typedOption = {
				strings: ['원하는 글씨를', '순서대로', '출력해 줍니다.'],
				typeSpeed: 100,
				backSpeed: 100,
				fadeOut: true,
				smartBackspace: true,
				cursorChar: '_',
//				loop: true
			}
			
			$('.tutorialCurtain').css({'width':maskWidth, 'height':maskHeight});
			$('.tutorialCurtain').fadeTo("slow", 0.8);
			
			setTimeout(function() {
				$('.tutorialHelpin').css({'position': 'relative', 'z-index': 10, 'background-color': '#FFF', 'display': 'block' });
				$('.tutorialPoint').css({'top':'20%','left':'20%'});
				$('#tutorialPointClick').css({'display': 'block'});
				typedOption['strings'] = ['안녕하세요', '반갑습니다.'];
				const typed = new Typed('#typed', typedOption);
			}, 2000);
			
			setTimeout(function() {
				$('#textEditor').css({'position': 'relative','z-index': 10, 'background-color': '#FFF' });
				typedOption['strings'] = ['콩쥐가 항아리를 받는데 항아리에 구멍이 나서 물이새어 나가고 있었어'];
				const typed = new Typed('#typed2', typedOption);
			}, 5000);
			
			setTimeout(function() {
				$('.tutorialPoint').css({'top':'5%','left':'40%'});
				$('.textCheck').css({'position': 'relative','z-index': 10, 'background-color': '#FFF' });
				typedOption['strings'] = ['이렇게 사용하면 됩니다.'];
				const typed = new Typed('#typed', typedOption);
			}, 13000);
			
			setTimeout(function() {
				$('.textCheck').trigger("click");
				$('#textInput').css({'position': 'relative','z-index': 10, 'background-color': '#FFF' });
				$('#divResult').css({'position': 'relative','z-index': 10, 'background-color': '#FFF' });
			}, 15000);
			
			setTimeout(function() {
				$('#textDelete').trigger("click");
				$('.tutorialHelpin').css({'display': 'none' });
				$('.tutorialCurtain').css({'width':0, 'height':0});
				$('.tutorialCurtain').fadeOut();
				$('input:radio[id=close]').prop("checked", true)
				$('#tutorialPointClick').css({'display': 'none'});
			}, 17000);
			
		} else if ($(this).val() == "close") {
			$('.tutorialCurtain').css({'width':0, 'height':0});
			$('.tutorialCurtain').fadeOut();
		}
	})
})