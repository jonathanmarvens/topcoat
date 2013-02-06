var content = document.querySelector('.content');
var cache = [];
var allresults = [];

var ua = navigator.userAgent;
var browser = {
	iPad: /iPad/.test(ua),
	iPhone: /iPhone/.test(ua),
	Android: /Android/.test(ua)
};

var jsonp = {
	callbackCounter: 0,

	fetch: function(url, callback) {
		var fn = 'JSONPCallback_' + this.callbackCounter++;
		window[fn] = this.evalJSONP(callback);
		url = url.replace('=JSONPCallback', '=' + fn);

		var scriptTag = document.createElement('SCRIPT');
		scriptTag.src = url;
		document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
	},

	evalJSONP: function(callback) {
		return function(data) {
			var validJSON = false;
		if (typeof data == "string") {
			try {validJSON = JSON.parse(data);} catch (e) {
				/*invalid JSON*/}
		} else {
			validJSON = JSON.parse(JSON.stringify(data));
				window.console && console.warn(
				'response data was not a JSON string');
			}
			if (validJSON) {
				callback(validJSON);
			} else {
				throw("JSONP call returned invalid or empty JSON");
			}
		}
	}
};


function createListWithImages (json, idx) {
	if(!idx) idx = 4;
	var loading = document.querySelector('.loading');
	var frag = document.createDocumentFragment();

	var l = Math.min(idx, json.length);
	for(var i = 0; i < l; ++i) {
		var el = json.shift();
		
		if(!stop)
			allresults.push(el);

		var li = document.createElement('li');
		li.className += 'with-images';

		var first;
		for(first in el.revisions) break;
		
		img = document.createElement('img');
		img.src = el.revisions[first].images.thumbnail_sm.url;
		img.width = 110;
		img.height = 110;
		li.appendChild(img);

		html = '<h5>' + el.title + count + '</h5>';
		html += '<p>by: ' + el.owner.first_name + '</p>';
		html += '<p class="stats"> '+ el.stats.views +' views <em>' + el.revisions[first].description + '</em></p>';
		li.innerHTML += html;
		count++;

		frag.appendChild(li);
	}
	cache = json;
	console.log('saved some for later', cache.length, cache);
	content.insertBefore(frag, loading);
}

function createList (json) {
	var frag = document.createDocumentFragment();
	json.forEach(function(el){
		var li = document.createElement('li');
		var a = document.createElement('a');
		a.href = 'infinite-page.html';
		a.innerText = el.name;
		li.appendChild(a);
		frag.appendChild(li);
	});
	content.appendChild(frag);
}

var gnEndY = 0;

function updateList () {
	if(gnEndY > limit) {
		loadJSONP(url+page, function(d){
			data = d;
			createListWithImages(d.wips);
			page++;
			createListWithImages(data.wips);
			limit *= 1;
		});
	}
}


if(browser.Android)
	window.addEventListener('touchstart', function (e) {
		content.style.webkitTransitionDuration = 0;
		startY = e.touches[0].pageY;
	}, false);

if(browser.Android)
	window.addEventListener('touchmove', function (e) {
		
		var diff = startY - e.touches[0].pageY;
		
		if(content.scrollTop === 0) {
			
			// this part here is to allow pull to update
			// to go up and down and at the same time
			// not interfere with the natural scrolling
			if(diff < -1)
				scrolling = 1;
			else
				if(!scrolling) return;

			
			var pull = document.querySelector('.pull-to-refresh');
			var msg = pull.querySelector('span');

			var pos = content.style.webkitTransform || 0;
			if(pos) pos = parseInt(pos.slice(11, pos.length-3), 10);
			
			// if(pos - diff > 100) {
			// 	msg.innerText = 'Release to update';
			// 	pull.classList.add('up');
			// }

			if(pos - diff < 0) {
				return;
			}

			startY = e.touches[0].pageY;
			content.style.webkitTransform = 'translateY('+(pos - diff)+'px)';
			e.preventDefault();
		}

	}, false);

if(browser.Android)
	window.addEventListener('touchend', function (e) {

		var pos = content.style.webkitTransform || 0;
		if(pos) pos = parseInt(pos.slice(11, pos.length-3), 10);

		if(pos > 80) {
			var pull = document.querySelector('.pull-to-refresh');
			var msg = pull.querySelector('span');

			content.style.webkitTransitionDuration = '.2s';
			content.style.webkitTransform = 'translateY(80px)';
			msg.innerText = 'Loading';
			pull.classList.remove('up');
			pull.classList.add('spin');
			setTimeout(function(){
				content.style.webkitTransitionDuration = '.1s';
				content.style.webkitTransform = 'translateY(0px)';
				msg.innerText = 'Pull down to refresh';
				pull.classList.remove('spin');
				scrolling = 0;
			}, 1500);
		} else {
			content.style.webkitTransitionDuration = '.1s';
			content.style.webkitTransform = 'translateY(0px)';
			scrolling = 0;
		}

	});

if(browser.iPhone) {
	document.querySelector('html').classList.add('iphone');
}