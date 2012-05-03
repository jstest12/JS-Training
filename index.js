window.onload = function(){
	sendRequest('latest.json');
	
	if(document.getElementsByClassName == undefined) { 
   document.getElementsByClassName = function(cl) { 
      var retnode = []; 
      var myclass = new RegExp('\\b'+cl+'\\b'); 
      var elem = this.getElementsByTagName('*'); 
      for (var i = 0; i < elem.length; i++) { 
         var classes = elem[i].className; 
         if (myclass.test(classes)) { 
            retnode.push(elem[i]); 
         } 
      } 
      return retnode; 
   } 
}; 
}

function getXmlHttp(){
	var xmlhttp
	try {
		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
		try {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		} catch (e1) {
      			xmlhttp = false;
		}
	}
	
	if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
		xmlhttp = new XMLHttpRequest();
	}

	return xmlhttp;
}

function sendRequest(option) {
	var req = getXmlHttp()
	req.open('GET', 'http://openexchangerates.org/' + option, true)
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			if(req.status == 200) {
				jsonResp(req.responseText);
			}
		}
	}
	req.send(null) 
}

function jsonResp(json){
	var jsonP = eval('('+json+')');
	//console.log(jsonP);
	var myDate = new Date(jsonP.timestamp * 1000);
	var dateStr = myDate.toLocaleDateString() + ' ' + myDate.toLocaleTimeString();
	//var dateString = document.getElementById('dateStr');
	//dateString.innerHTML = 'Last update: ' + dateStr;
	for(f in jsonP.rates) {
//		addItem(f,jsonP.rates[f],document.form1.combo1);
//		addItem(f,jsonP.rates[f],document.form1.combo2);
//	console.log(f + ' ' + jsonP.rates[f]);
//		addItem3(f, jsonP.rates[f].toFixed(3));
		
		
		

		if (f == 'USD' ) addItem3(f, jsonP.rates[f].toFixed(3));
		if (f == 'BYR' ) addItem3(f, jsonP.rates[f].toFixed(3));
		if (f == 'EUR' ) addItem3(f, jsonP.rates[f].toFixed(3));
		if (f == 'RUB' ) addItem3(f, jsonP.rates[f].toFixed(3));
	}
}

function addItem3(text,value) {
	var divItem = document.createElement('div');
	divItem.className = 'item';
	var divLeft = document.createElement('div');
	divLeft.className = 'left';
	var divStar = document.createElement('div');
	divStar.className = 'star';
	var divFlag = document.createElement('div');
	divFlag.className = 'flag';
	var flagIcon = text.substr(0,2).toLowerCase();
	//if (text == 'EUR') flagIcon = '_EuropeanUnion';
	if (text == 'XAF') flagIcon = 'CF';
	divFlag.style.cssText = 'background: url(flag-icons/flags_iso/64/'+flagIcon+'.png) no-repeat scroll 50% 50%;'
	var divFlagName = document.createElement('div');
	divFlagName.className = 'flag-name';
	//divFlagName.innerHTML = text;
	var divFlagnameText = document.createElement('span');
	divFlagnameText.className = 'flag-nameText';
	divFlagnameText.innerHTML = text;
	divFlagName.appendChild(divFlagnameText);
	
	
	divLeft.appendChild(divStar);
	divLeft.appendChild(divFlag);
	divLeft.appendChild(divFlagName);
	
	divItem.appendChild(divLeft);
	
	var divRight = document.createElement('div');
	divRight.className = 'right';
	
	divItem.appendChild(divRight);
	
	var divCenter = document.createElement('div');
	divCenter.className = 'center';
	var divCenterTop = document.createElement('div');
	divCenterTop.className = 'center-top';
	var divCurrValue = document.createElement('span');
	divCurrValue.className = 'currValue';
	var divCurrValueText = document.createElement('input');
	divCurrValueText.type = 'text';
	divCurrValueText.name = 'currValueText';
	divCurrValueText.className = 'currValueText';
	divCurrValueText.value = value;
	divCurrValueText.id = text;
	divCurrValueText.rate = value;
	//divCurrValueText.addEventListener('onchange',myConvert(value),false);
	divCurrValueText.onchange = myConvert;
	divCurrValue.appendChild(divCurrValueText);
	divCenterTop.appendChild(divCurrValue);
	
	
	//divCenterTop.innerHTML = value;
	var divCenterBottom = document.createElement('div');
	divCenterBottom.className = 'center-bottom';
	
	divCenter.appendChild(divCenterTop);
	divCenter.appendChild(divCenterTop);
	divCenter.appendChild(divCenterBottom);
	divItem.appendChild(divCenter);
	
	var container = document.getElementById('container');
	container.appendChild(divItem);
}

function myConvert(){
	//console.log(this);
	var curr = document.getElementsByClassName('currValueText');
	for (f in curr) {
		if (curr[f].id == this.id) continue;
		curr[f].value = convert(this.rate,curr[f].rate,this.value);
	}
}

function convert(from,to,startValue){
	var res = (to * (1 / from) * (startValue || 1)).toFixed(3);	
	return res;
}

function addItem2(text, value, into) {
	var newDiv = document.createElement('div');
	newDiv.className = 'item';
	newDiv.innerHTML = text + '\t' + value;
	var container = document.getElementById('container');
	container.appendChild(newDiv);
}

function addItem(Text,Value,into){
	var newOpt = document.createElement('option');
	newOpt.text = Text;
	newOpt.value = Value;
	into.add(newOpt);
}

function updateRate1() {
	var from = document.form1.combo1.value;
	var to = document.form1.combo2.value;
	var startValue = document.form1.from1.value;
	var res = convert(from,to,startValue);
	document.form1.to1.value=res;
}

function updateRate2() {
	var from = document.form1.combo2.value;
	var to = document.form1.combo1.value;
	var startValue = document.form1.to1.value;
	var res = convert(from,to,startValue);
	document.form1.from1.value=res;
}
