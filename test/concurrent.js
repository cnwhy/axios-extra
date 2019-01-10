const axios = require('../').create({ maxConcurrent: 1 });
const max = 10;
const url = 'https://cnodejs.org/api/v1/topics';

for (var i = 0; i < max; i++) {
	+(function(k) {
		console.log('add req',k)
		axios.get(url).then(
			function() {
				console.log(max + '-' + k);
			},
			err => console.log(err.message)
		);
	})(i);
}
