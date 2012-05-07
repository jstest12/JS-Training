window.onload = function () {
    getExRates('latest.json');

    if (document.getElementsByClassName == 'undefined') {
        document.getElementsByClassName = function (cl) {
            var retnode = [],
				myclass = new RegExp('\\b' + cl + '\\b'),
				elem = this.getElementsByTagName('*');
            for (var i = 0; i < elem.length; i++) {
                var classes = elem[i].className;
                if (myclass.test(classes)) {
                    retnode.push(elem[i]);
                }
            }
            return retnode;
        };
    }
};

function getXmlHttp() {
    var xmlhttp;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e1) {
            xmlhttp = false;
        }
    }

    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }

    return xmlhttp;
}

function getExRates(option) {
    var req = getXmlHttp();
    req.open('GET', 'http://openexchangerates.org/' + option, true);
    req.onreadystatechange = function () {
		if (req.readyState == 4) {
            if (req.status == 200) {
                getJsonResp(req.responseText);
            }
        }
    };
    req.send(null);
}

function getJsonResp(json) {
    //var jsonP = eval('(' + json + ')'),
	var jsonP = JSON.parse(json),
		myDate = new Date(jsonP.timestamp * 1000),
		dateStr = myDate.toLocaleDateString() + ' ' + myDate.toLocaleTimeString();
    for (var f in jsonP.rates) {
        //		addListItem(f, jsonP.rates[f].toFixed(3));
        if (f == 'USD') {
			addListItem(f, jsonP.rates[f].toFixed(3));
		}
        if (f == 'BYR') {
			addListItem(f, jsonP.rates[f].toFixed(3));
		}
        if (f == 'EUR') {
			addListItem(f, jsonP.rates[f].toFixed(3));
		}
        if (f == 'RUB') {
			addListItem(f, jsonP.rates[f].toFixed(3));
		}
    }
}

function addListItem(text, value) {
    var divItem = document.createElement('div');
    divItem.className = 'item';
    var divLeft = document.createElement('div');
    divLeft.className = 'left';
    var divStar = document.createElement('div');
    divStar.className = 'star';
    var divFlag = document.createElement('div');
    divFlag.className = 'flag';
    var flagIcon = text.substr(0, 2).toLowerCase();
    if (text == 'XAF') {
		flagIcon = 'CF';
    }
	divFlag.style.cssText = 'background: url(flag-icons/flags_iso/64/' + flagIcon + '.png) no-repeat scroll 50% 50%;';
    var divFlagName = document.createElement('div');
    divFlagName.className = 'flag-name';
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
    divCurrValueText.onchange = updRates;
    divCurrValue.appendChild(divCurrValueText);
    divCenterTop.appendChild(divCurrValue);

    var divCenterBottom = document.createElement('div');
    divCenterBottom.className = 'center-bottom';

    divCenter.appendChild(divCenterTop);
    divCenter.appendChild(divCenterTop);
    divCenter.appendChild(divCenterBottom);
    divItem.appendChild(divCenter);

    var container = document.getElementById('container');
    container.appendChild(divItem);
}

function updRates() {
    var curr = document.getElementsByClassName('currValueText');
    for (var f in curr) {
        if (curr[f].id == this.id) {
			continue;
		}
        curr[f].value = convertValue(this.rate, curr[f].rate, this.value);
    }
}

function convertValue(from, to, startValue) {
    var res = (to * (1 / from) * (startValue || 1)).toFixed(3);
    return res;
}