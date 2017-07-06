var express = require('express'),
		path    = require('path');

var videoPlayAuth = require('./src/playAuth.js');

var app = express();


app.use(express.static(path.join(__dirname, './')));

app.get('/', function(req, res) {
	res.sendfile('./example/index.html');
})

app.get('/on_browser', function(req, res) {
	res.sendfile('./example/index_browser.html');
})

app.get('/auth', function(req, res) {
	videoPlayAuth('LTAIcNO480JCPvsK', 'nIKdkfQ9LnXbFJ9ZAplTtAlDPE3Mqe', '4c92b2e8061d4fde8bb4675c311a2afc').then(function(resolve) {
		resolve = JSON.parse(resolve);
		res.send(resolve);
	}, function(reject) {
		console.log(reject)
	});
});



app.listen(3000, function() {
	console.log('servers is start.');
})

