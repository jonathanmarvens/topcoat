var url = 'https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=twitterapi&count=2';

function sendTextNew() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'text';
	xhr.onload = function(e) {
		if (this.status == 200) {
			console.log(this.response);
		}
	};
	xhr.send();
}

sendTextNew();