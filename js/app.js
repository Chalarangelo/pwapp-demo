var requestResult = '';
document.addEventListener('DOMContentLoaded', function() {
	ajaxGetRequest('https://jsonplaceholder.typicode.com/posts/1', true, function(result) {
		requestResult = JSON.parse(result);
		document.getElementById('result').innerHTML = '<h2>'+requestResult['title']+'</h2><p>'+requestResult['body']+'</p>';
	});
});
function ajaxGetRequest(url, async, callback) {
	var request = new XMLHttpRequest();
	//var response = '';
	request.open('GET', url, async);
	request.onload = function() {
		if (this.status >= 200 && this.status < 400) {
			callback(this.response);
		}
		else {
			callback('GET request from '+url+' returned an error.');
		}
	};
	request.onerror = function() {
		callback('GET request from '+url+' returned an error.');
	};
	request.send();
}
