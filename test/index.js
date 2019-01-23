const axios = require('../');
const axios2 = axios.create({
	maxConcurrent: 1,
	queueOptions: {
		retry: 3
	}
});
const url = 'https://cnodejs.org/api/v1/topics';
axios.defaults.maxConcurrent = 1;
axios.interceptors.response.use(function(res){
	return res.data;
},function(err){
	console.log('err');
	return Promise.reject(err);
});

// axios.interceptors.response.use(function(res) {
// 	console.log(1);
// 	return res;
// });

axios({
	url: url,
	queueOptions: { retry: 0 }
}).then(
	function(data) {
		console.log("1data.length", data.data.length);
	},
	err => console.log(Object.keys(err.response))
);

axios.get(url).then(
	function(data) {
		console.log("2data.length", data.data.length);
	},
	err => console.log(Object.keys(err.response))
);

axios.post(url,{},{queueOptions:{retry:3}}).then(
	function(data) {
		console.log("3data.length", data.data.length);
	},
	err => {
		console.log(Object.keys(err.response))
		console.log(err.response.status)
	}
);

axios2.get(url).then(
	function(res) {
		console.log('res.status',res.status);
	},
	err => console.log(Object.keys(err.response))
);
