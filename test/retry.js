const axios = require('../').create({ maxConcurrent: 1, queueOptions: { retry: 3, retryIsJump:true } });
const max = 5;

let x = 0;
//添加一个拦截器,模拟失败
axios.interceptors.response.use(function(res) {
	x++;
	console.log(`${x} % 4 = ${x%4}`, x%4 ? '[retry]': '[ok]');
	if (x % 4) {
		throw 'err';
	}
	return res;
});

for (var i = 0; i < max; i++) {
	+(function(k) {
		axios.get('https://www.baidu.com/').then(
			function() {
				console.log(max + '-' + ++k,'end');
			},
			err => console.log(max + '-' + ++k, err)
		);
	})(i);
}
