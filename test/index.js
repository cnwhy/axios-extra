const axios = require('../');
const axios2 = axios.create({
	maxConcurrent: 1,
	queueOptions: {
		retry: 3
	}
});
const url = 'https://cnodejs.org/api/v1/topics';

axios.interceptors.response.use(function(res){
	return res.data;
});

axios({
	url: url,
	queueOptions: { retry: 0 }
}).then(
	function(data) {
		console.log("data.length", data.data.length);
	},
	err => console.log(Object.keys(err.response))
);

axios2.get(url).then(
	function(res) {
		console.log('res.status',res.status);
	},
	err => console.log(Object.keys(err.response))
);
