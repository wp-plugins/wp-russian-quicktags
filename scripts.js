var edButtons = new Array();
var edLinks = new Array();
var edOpenTags = new Array();

function edButton(id, display, tagStart, tagEnd, access, open) {
	this.id = id;				// used to name the toolbar button
	this.display = display;		// label on button
	this.tagStart = tagStart; 	// open tag
	this.tagEnd = tagEnd;		// close tag
	this.access = access;		// access key
	this.open = open;			// set to -1 if tag does not need to be closed
}

function zeroise(number, threshold) {
	// FIXME: or we could use an implementation of printf in js here
	var str = number.toString();
	if (number < 0) { str = str.substr(1, str.length) }
	while (str.length < threshold) { str = "0" + str }
	if (number < 0) { str = '-' + str }
	return str;
}

var now = new Date();
var datetime = now.getFullYear() + '-' + 
				zeroise(now.getMonth() + 1, 2) + '-' +
				zeroise(now.getDate(), 2) + 'T' + 
				zeroise(now.getHours(), 2) + ':' + 
				zeroise(now.getMinutes(), 2) + ':' + 
				zeroise(now.getSeconds() ,2) +
				// FIXME: we could try handling timezones like +05:30 and the like
				zeroise((now.getTimezoneOffset()/60), 2) + ':' + '00';

// edit the buttons here -> Template button below
/*
new edButton('button_id',		// used to name the toolbar button
'button_label',					// label on button
'button_open_tag',				// open tag
'button_close_tag',				// close tag
'button_keyboard_shortcut',		// access key
'does_not_need_close_tag'		// set to -1 if tag does not need to be closed -> generally, you can just omit this last 
								// one but if you do, REMOVE the ',' from the previous line!
);
*/
edButtons[edButtons.length] = 
new edButton('ed_strong',
'Жирный',
'<strong>',
'</strong>',
'b'
);

edButtons[edButtons.length] = 
new edButton('ed_em',
'Курсив',
'<em>',
'</em>',
'i'
);

edButtons[edButtons.length] =
new edButton('ed_pre',
'Код',
'<code>',
'</code>',
'c'
);

edButtons[edButtons.length] = 
new edButton('ed_block',
'Цитата',
'<blockquote>',
'</blockquote>',
'q'
);

edButtons[edButtons.length] = 
new edButton('ed_link',
'Ссылка',
'',
'</a>',
'a'
); // special case

function edLink() {
	this.display = '';
	this.URL = '';
	this.newWin = 0;
}

function edShowButton(button, i) {
	if (button.id == 'ed_img') {
		document.write('<button class="btn btn-small" type="button" id="' + button.id + '" accesskey="' + button.access + '" class="ed_button" onclick="edInsertImage(edCanvas);" value="' + button.display + '">' + button.display + '</button>');
	}
	else if (button.id == 'ed_link') {
		document.write('<button class="btn btn-small" type="button" id="' + button.id + '" accesskey="' + button.access + '" class="ed_button" onclick="edInsertLink(edCanvas, ' + i + ');" value="' + button.display + '">' + button.display + '</button>');
	}
	else {
		document.write('<button class="btn btn-small" type="button" id="' + button.id + '" accesskey="' + button.access + '" class="ed_button" onclick="edInsertTag(edCanvas, ' + i + ');" value="' + button.display + '">' + button.display + '</button>');
	}
}

function edAddTag(button) {
	if (edButtons[button].tagEnd != '') {
		edOpenTags[edOpenTags.length] = button;
		document.getElementById(edButtons[button].id).value = '/' + document.getElementById(edButtons[button].id).value;
		document.getElementById(edButtons[button].id).innerHTML = '/' + document.getElementById(edButtons[button].id).innerHTML;
	}
}

function edRemoveTag(button) {
	for (i = 0; i < edOpenTags.length; i++) {
		if (edOpenTags[i] == button) {
			edOpenTags.splice(i, 1);
			document.getElementById(edButtons[button].id).value = 		document.getElementById(edButtons[button].id).value.replace('/', '');
			document.getElementById(edButtons[button].id).innerHTML = 		document.getElementById(edButtons[button].id).innerHTML.replace('/', '');
		}
	}
}

function edCheckOpenTags(button) {
	var tag = 0;
	for (i = 0; i < edOpenTags.length; i++) {
		if (edOpenTags[i] == button) {
			tag++;
		}
	}
	if (tag > 0) {
		return true; // tag found
	}
	else {
		return false; // tag not found
	}
}	

function edCloseAllTags() {
	var count = edOpenTags.length;
	for (o = 0; o < count; o++) {
		edInsertTag(edCanvas, edOpenTags[edOpenTags.length - 1]);
	}
}

function edToolbar() {
	document.write('<div id="ed_comment_toolbar">');
	for (i = 0; i < edButtons.length; i++) {
		edShowButton(edButtons[i], i);
	}
	document.write('<button class="btn btn-small" type="button" id="ed_close" class="ed_button" onclick="edCloseAllTags();" title="Закрыть все теги" value="Закрыть теги" />Закрыть теги</button>');
	document.write('</div>');
}

// insertion code

function edInsertTag(myField, i) {
	//IE support
	if (document.selection) {
		myField.focus();
	    sel = document.selection.createRange();
		if (sel.text.length > 0) {
			sel.text = edButtons[i].tagStart + sel.text + edButtons[i].tagEnd;
		}
		else {
			if (!edCheckOpenTags(i) || edButtons[i].tagEnd == '') {
				sel.text = edButtons[i].tagStart;
				edAddTag(i);
			}
			else {
				sel.text = edButtons[i].tagEnd;
				edRemoveTag(i);
			}
		}
		myField.focus();
	}
	//MOZILLA/NETSCAPE support
	else if (myField.selectionStart || myField.selectionStart == '0') {
		var startPos = myField.selectionStart;
		var endPos = myField.selectionEnd;
		var cursorPos = endPos;
		var scrollTop = myField.scrollTop;

		if (startPos != endPos) {
			myField.value = myField.value.substring(0, startPos)
			              + edButtons[i].tagStart
			              + myField.value.substring(startPos, endPos) 
			              + edButtons[i].tagEnd
			              + myField.value.substring(endPos, myField.value.length);
			cursorPos += edButtons[i].tagStart.length + edButtons[i].tagEnd.length;
		}
		else {
			if (!edCheckOpenTags(i) || edButtons[i].tagEnd == '') {
				myField.value = myField.value.substring(0, startPos) 
				              + edButtons[i].tagStart
				              + myField.value.substring(endPos, myField.value.length);
				edAddTag(i);
				cursorPos = startPos + edButtons[i].tagStart.length;
			}
			else {
				myField.value = myField.value.substring(0, startPos) 
				              + edButtons[i].tagEnd
				              + myField.value.substring(endPos, myField.value.length);
				edRemoveTag(i);
				cursorPos = startPos + edButtons[i].tagEnd.length;
			}
		}
		myField.focus();
		myField.selectionStart = cursorPos;
		myField.selectionEnd = cursorPos;
		myField.scrollTop = scrollTop;
	}
	else {
		if (!edCheckOpenTags(i) || edButtons[i].tagEnd == '') {
			myField.value += edButtons[i].tagStart;
			edAddTag(i);
		}
		else {
			myField.value += edButtons[i].tagEnd;
			edRemoveTag(i);
		}
		myField.focus();
	}
}

function edInsertContent(myField, myValue) {
	//IE support
	if (document.selection) {
		myField.focus();
		sel = document.selection.createRange();
		sel.text = myValue;
		myField.focus();
	}
	//MOZILLA/NETSCAPE support
	else if (myField.selectionStart || myField.selectionStart == '0') {
		var startPos = myField.selectionStart;
		var endPos = myField.selectionEnd;
		myField.value = myField.value.substring(0, startPos)
		              + myValue 
                      + myField.value.substring(endPos, myField.value.length);
		myField.focus();
		myField.selectionStart = startPos + myValue.length;
		myField.selectionEnd = startPos + myValue.length;
	} else {
		myField.value += myValue;
		myField.focus();
	}
}

function edInsertLink(myField, i, defaultValue) {
	if (!defaultValue) {
		defaultValue = 'http://';
	}
	if (!edCheckOpenTags(i)) {
		var URL = prompt('Введите URL' ,defaultValue);
		if (URL) {
			edButtons[i].tagStart = '<a href="' + URL + '">';
			edInsertTag(myField, i);
		}
	}
	else {
		edInsertTag(myField, i);
	}
}

function commentQuote(commentid,commenttext,commentarea) {
	var quote = '<blockquote>'+commenttext+'</blockquote>\n';
	var comment = document.getElementById(commentarea);
	addQuote(comment,quote);
	return false;
}

function postQuote(postid,commentarea,alertmsg) {
	var posttext = '';
	if (window.getSelection){
		posttext = window.getSelection();
	}
	else if (document.getSelection){
		posttext = document.getSelection();
	}
	else if (document.selection){
		posttext = document.selection.createRange().text;
	}
	else {
		return true;
	}
	if (posttext==''){
		alert(alertmsg);
		return true;
	} else {
		var quote='<blockquote>'+posttext+'</blockquote>\n';
		var comment=document.getElementById(commentarea);
		addQuote(comment,quote);
	}
	return false;
}

function addQuote(comment,quote){
	// Derived from Alex King's JS Quicktags code (http://www.alexking.org/)
	// Released under LGPL license
	// IE support
	if (document.selection) {
		comment.focus();
		sel = document.selection.createRange();
		sel.text = quote;
		comment.focus();
	}
	// MOZILLA/NETSCAPE support
	else if (comment.selectionStart || comment.selectionStart == '0') {
		var startPos = comment.selectionStart;
		var endPos = comment.selectionEnd;
		var cursorPos = endPos;
		var scrollTop = comment.scrollTop;
		if (startPos != endPos) {
			comment.value = comment.value.substring(0, startPos)
			              + quote
			              + comment.value.substring(endPos, comment.value.length);
			cursorPos = startPos + quote.length
		}
		else {
			comment.value = comment.value.substring(0, startPos) 
				              + quote
				              + comment.value.substring(endPos, comment.value.length);
			cursorPos = startPos + quote.length;
		}
		comment.focus();
		comment.selectionStart = cursorPos;
		comment.selectionEnd = cursorPos;
		comment.scrollTop = scrollTop;
	}
	else {
		comment.value += quote;
	}
}