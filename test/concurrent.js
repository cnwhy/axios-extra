const axios = require('../').create({ maxConcurrent: 1 });
const max = 10;
for (var i = 0; i < max; i++) {
	+(function(k) {
		axios.get('https://www.baidu.com/', { timeout: 500 }).then(
			function() {
				console.log(max + '-' + k);
			},
			err => console.log(err.message)
		);
	})(i);
}
