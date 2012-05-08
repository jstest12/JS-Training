/* fix for IE */
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

var EXRATES = EXRATES || {};

/*
 * Helper function from 'Javascript Patterns' book
 */
EXRATES.namespace = function(ns_string) {
    var parts = ns_string.split('.'),
        parent = EXRATES,
        i;

    if (parts[0] === 'EXRATES') {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i+=1) {
        if (typeof parent[parts[i]] === 'undefined') {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

EXRATES.namespace('EXRATES.converter');

EXRATES.converter = (function() {
	/* helper function for XHR */
    var getXmlHttp = function() {
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
        },
		/* main func for creating list items */
        getJsonResp = function(json) {
            var jsonP = JSON.parse(json),
                myDate = new Date(jsonP.timestamp * 1000),
                dateStr = myDate.toLocaleDateString() + ' ' + myDate.toLocaleTimeString();
            for (var f in jsonP.rates) {
                if (f == 'USD') {
                    addListItem(f, jsonP.rates[f].toFixed(3));
					continue;
                }
                if (f == 'BYR') {
                    addListItem(f, jsonP.rates[f].toFixed(3));
					continue;
                }
                if (f == 'EUR') {
                    addListItem(f, jsonP.rates[f].toFixed(3));
					continue;
                }
                if (f == 'RUB') {
                    addListItem(f, jsonP.rates[f].toFixed(3));
					continue;
                }
				//addListItem(f, jsonP.rates[f].toFixed(3));
            }
        },
		/* helper function for making DOM elements */
        makeDiv = function(type, clName) {
            var divElem;
            if (typeof arguments[0] === 'string') {
                divElem = document.createElement(type);
            } else {
                return;
            }
            if (typeof arguments[1] === 'string') {
                divElem.className = clName;
            }
            return divElem;
        },
		/* function for creating styled list element */
        addListItem = function(text, value) {
            var divItem = makeDiv('div','item'),
                divLeft = makeDiv('div','left'),
                divStar = makeDiv('div','star'),
                divFlag = makeDiv('div','flag'),
                flagIcon = text.substr(0, 2).toLowerCase(),
                divFlagName = makeDiv('div','flag-name'),
                divFlagnameText = makeDiv('span','flag-nameText');
                
            divFlagnameText.innerHTML = text;
            divFlagName.appendChild(divFlagnameText);
            
            divFlag.style.cssText = 'background: url(flag-icons/flags_iso/64/' + flagIcon + '.png) no-repeat scroll 50% 50%;';

            divLeft.appendChild(divStar);
            divLeft.appendChild(divFlag);
            divLeft.appendChild(divFlagName);

            divItem.appendChild(divLeft);

            var divRight = makeDiv('div','right');

            divItem.appendChild(divRight);

            var divCenter = makeDiv('div','center'),
                divCenterTop = makeDiv('div','center-top'),
                divCurrValue = makeDiv('span','currValue'),
                divCurrValueText = makeDiv('input','currValueText');
                
            divCurrValueText.type = 'text';
            divCurrValueText.name = 'currValueText';
            divCurrValueText.value = value;
            divCurrValueText.id = text;
            divCurrValueText.rate = value;
            divCurrValueText.onchange = updRates;
            divCurrValue.appendChild(divCurrValueText);
            divCenterTop.appendChild(divCurrValue);

            var divCenterBottom = makeDiv('div','center-bottom');

            divCenter.appendChild(divCenterTop);
            divCenter.appendChild(divCenterTop);
            divCenter.appendChild(divCenterBottom);
            divItem.appendChild(divCenter);

            var container = document.getElementById('container');
            container.appendChild(divItem);
        },
		/* ElentListener */
        updRates = function() {
            var curr = document.getElementsByClassName('currValueText');
            for (var f in curr) {
                if (curr[f].id == this.id) {
                    continue;
                }
                curr[f].value = convertValue(this.rate, curr[f].rate, this.value);
            }
        },
		/* function for converting two currencies through USD */
        convertValue = function(from, to, startValue) {
            var res = (to * (1 / from) * (startValue || 1)).toFixed(3);
            return res;
        };

    return {
        getExRates: function(option) {
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
    };
})();