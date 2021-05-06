let originText, theText, resultText, data;
const xhr = new XMLHttpRequest();
const btnTextCheck = document.querySelector('.textCheck');
const btnTextUpdate = document.querySelector('.textUpdate');
const btnTextDelete = document.querySelector('.textDelete');
const btnTextComplete = document.querySelector('.textComplete');

function mouseOver(index) {
	document.getElementsByClassName('highlight')[index].style.textDecoration = "underline";
}

function mouseOut(index) {
	document.getElementsByClassName('highlight')[index].style = "";
}

// 틀린글자 클릭시 팝업알림
function onLayerPopup(index, token, suggestions, type) {
	var mX = event.clientX + document.body.scrollLeft;
	var mY = event.clientY + document.body.scrollTop;

	$('#layer').css({'left':mX, 'top':mY});

	var output = '<table>';
	output += `<tr><th>틀린 단어</th><td>${token}</td></tr>`;
	output += `<tr><th>대체어</th><td>${suggestions}</td></tr>`;
	output += '</table>';
	document.getElementById('text_area').innerHTML = output;

	output = '<p>도움말</p>';
	output += `<p>${type}</p>`;
	document.getElementById("help_area").innerHTML = output;

	$('#layer_popup').css({'display': 'block'});
}

function closeLayerPopup() {
	$('#layer_popup').css({'display': 'none'});
}

// 틀린글자 색입히기
function textHighlight(index, token, suggestions, type) {
	let highlight;
	// 타입체크
	if (type == 'space') {
		highlight = `<a href="#" class='highlight' id="highlight_red" onClick="onLayerPopup('${index}', '${token}', '${suggestions}', '${type}')">${token}</a>`;
	} else if (type == 'spell') {
		highlight = `<a href="#" class='highlight' id="highlight_green" onClick="onLayerPopup('${index}', '${token}', '${suggestions}', '${type}')">${token}</a>`;
	} else if (type == 'space_spell') {
		highlight = `<a href="#" class='highlight' id="highlight_purple" onClick="onLayerPopup('${index}', '${token}', '${suggestions}', '${type}')">${token}</a>`;
	} else {
		highlight = `<a href="#" class='highlight' id="highlight_pink" onClick="onLayerPopup('${index}', '${token}', '${suggestions}', '${type}')">${token}</a>`;
	} 
	
	this.theText = this.theText.replace(token, highlight);

	document.getElementById('textInput').innerHTML = this.theText;
}

// 틀린글자 업데이트된 색변경하기
function textHighlightUpdate(index, token, suggestions, type) {
	let origin_highlight;
	// 타입체크
	if (type == 'space') {
		origin_highlight = `<a href="#" class='highlight' id="highlight_red" onClick="onLayerPopup('${index}', '${token}', '${suggestions}', '${type}')">${token}</a>`;
	} else if (type == 'spell') {
		origin_highlight = `<a href="#" class='highlight' id="highlight_green" onClick="onLayerPopup('${index}', '${token}', '${suggestions}', '${type}')">${token}</a>`;
	} else if (type == 'space_spell') {
		origin_highlight = `<a href="#" class='highlight' id="highlight_purple" onClick="onLayerPopup('${index}', '${token}', '${suggestions}', '${type}')">${token}</a>`;
	} else {
		origin_highlight = `<a href="#" class='highlight' id="highlight_pink" onClick="onLayerPopup('${index}', '${token}', '${suggestions}', '${type}')">${token}</a>`;
	} 
	
	const highlight = `<a href="#" class='highlight' id="highlight_blue" onClick="onLayerPopup('${index}', '${token}', '${suggestions}', '${type}')">${suggestions}</a>`;
	this.theText = this.theText.replace(origin_highlight, highlight);

	document.getElementById('textInput').innerHTML = this.theText;
	document.getElementById('textEditor').innerText = document.getElementById('textInput').innerText
}

function insertSpellCheck(data) {
	let formdata = new FormData();
	formdata.enctype = 'multipart/form-data';
	formdata.method = 'post';
	
	formdata.append('bookSeq', document.grammarform.bookSeq.value);
	formdata.append('inputSeq', document.grammarform.inputSeq.value);
	formdata.append('inputPage', document.grammarform.inputPage.value);
	formdata.append('oriText', this.originText);
	formdata.append('incorrCnt', data.length);
	formdata.append('incorrText', JSON.stringify(data));
	
	xhr.open("post", "/main/data/insertSpellCheck.do", true);
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				return true;
			} else {
				alert("요청오류 : " + xhr.status);
			}
		}
	}
	
	xhr.send(formdata);
}

// 편집하기
btnTextUpdate.addEventListener('click', () => {
	// textEditor null 체크
	if (document.getElementById('textEditor').innerText == '') {
		alert('글을 작성하시고 수정해주세요');
		return false;
	}
//	document.getElementById('textEditor').innerText = document.getElementById('textInput').innerText
	
	document.getElementById('textInput').innerHTML = null;
	document.getElementById('textResult').innerHTML = null;
	document.getElementById('textError').innerHTML = null;
	
	$('#textEditor').css({'display': 'block'});
	$('#textInput').css({'display': 'none'});
	$('#divResult').css({'display': 'none'});
	$('#textError').css({'display': 'none'});
	
	$('.btn_start').css({'display': 'block'});
	$('.btn_end').css({'display': 'none'});
	
	$('#layer_popup').css({'display': 'none'});
});

// 초기화하기
btnTextDelete.addEventListener('click', () => {
	// textEditor null 체크
	if (document.getElementById('textEditor').innerText == '') {
		alert('이미 초기화된 상태입니다');
		return false;
	}
	this.originText = null;
	this.theText = null;

	document.getElementById('textEditor').innerHTML = null;
	document.getElementById('textInput').innerHTML = null;
	document.getElementById('textResult').innerHTML = null;
	document.getElementById('textError').innerHTML = null;
	
	$('#textEditor').css({'display': 'block'});
	$('#textInput').css({'display': 'none'});
	$('#divResult').css({'display': 'none'});
	$('#textError').css({'display': 'none'});
	
	$('.btn_start').css({'display': 'block'});
	$('.btn_end').css({'display': 'none'});
	
	$('#layer_popup').css({'display': 'none'});
});

// 검사 완료하기
btnTextComplete.addEventListener('click', () => {
	// textEditor null 체크
	if (document.getElementById('textEditor').innerText == '') {
		alert('글을 작성하시고 완료해주세요');
		return false;
	}
	this.resultText = document.getElementById('textInput').innerText
//	console.log(this.originText);
//	console.log(this.resultText);

	let formdata = new FormData();
	formdata.enctype = 'multipart/form-data';
	formdata.method = 'post';
	
	formdata.append('bookSeq', document.grammarform.bookSeq.value);
	formdata.append('inputSeq', document.grammarform.inputSeq.value);
	formdata.append('inputPage', document.grammarform.inputPage.value);
	formdata.append('oriText', this.originText);
	formdata.append('grammarText', this.resultText);
	
	xhr.open("post", "/main/data/insetGrammarInfo.do", true);
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				document.grammarform.action = "/main/mainWriteStory.do";
				document.grammarform.submit();
			} else {
				alert("요청오류 : " + xhr.status);
			}
		}
	}
	xhr.send(formdata);
});

// 맞춤법 검사하기
btnTextCheck.addEventListener('click', () => {
	// textEditor null 체크
	if (document.getElementById('textEditor').innerText == '') {
		alert('글을 작성하시고 검사해주세요');
		return false;
	} else if (this.originText == null) {
		this.originText = document.getElementById('textEditor').innerText;
//		console.log(this.originText)
	}
//	console.log(this.originText.split(' ').length)
	
	this.theText = document.getElementById('textEditor').innerText;
	document.getElementById('textInput').innerText = this.theText;
	
	$('#layer_popup').css({'display': 'none'});
	$('#textEditor').css({'display': 'none'});
	$('#textInput').css({'display': 'block'});
	$('#divResult').css({'display': 'block'});
	$('#textLoading').css({'display': 'block'});
	
	let formdata = new FormData();
	formdata.enctype = 'multipart/form-data';
	formdata.method = 'post';
	
	formdata.append('sentence', this.theText);
	
	xhr.open("post", "/main/data/api/grammarCheck.do", true);

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				this.data = JSON.parse(xhr.response).data;
				console.log(this.data);
				let output = '<table>'
				for (let i = 0; i < this.data.length; i++) {
					output += '<tr><td width="40%">'+this.data[i].token+'</td>'
					output += '<td width="5%">→</td>'
					output += '<td width="55%">'
					textHighlight(i, this.data[i].token,
							this.data[i].suggestions, this.data[i].type);
					for (let j = 0; j < this.data[i].suggestions.length; j++) {
						if (j > 0) {
							output += '&nbsp;';
						}
						output += `<button id="btUpdate" onmouseover="mouseOver('${i}')" onmouseout="mouseOut('${i}')" onclick="textHighlightUpdate('${i}', '${this.data[i].token}', '${this.data[i].suggestions[j]}', '${this.data[i].type}')">`
						output += this.data[i].suggestions[j]
						output += `</button>`
					}
					output += `</td></tr>`
				}
				output += `</table>`

				document.getElementById('textError').innerHTML = `맞춤법 오류 <span style='color: palevioletred'>${this.data.length}</span> 개`
				document.getElementById('textResult').innerHTML = output;
				
				insertSpellCheck(this.data);
				
				$('#textLoading').css({'display': 'none'});
				$('.btn_start').css({'display': 'none'});
				$('.btn_end').css({'display': 'block'});
				$('#textError').css({'display': 'block'});
			} else {
				alert("요청오류 : " + xhr.status);
			}
		}
	}
	xhr.send(formdata);
});