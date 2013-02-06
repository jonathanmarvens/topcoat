var content = document.querySelector('.content');

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
}


function createListWithImages (json) {

	var loading = document.querySelector('.loading');

	var frag = document.createDocumentFragment();
	json.forEach(function(el){
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
	});
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