module.exports = function teset(test, axios, defConcurrent = 10, defRetry = 0) {
	const testUrl = 'https://cnodejs.org/api/v1/topics';
	function test_retry(retry){
		return (t)=>{
			t.plan(Math.max(2,retry + 2));
			//拦截 模拟失败
			axios.interceptors.response.use(function(res) {
				t.pass();
				throw 'err';
			});
			return axios.get(testUrl).then(
				res => {
					t.fail();
				},
				err => {
					axios.interceptors.response.handlers = [];
					t.is(err, 'err');
				}
			);
		}
	}
	
	test.serial('axios原功能测试', async t => {
		let data = await axios(testUrl).then(res => res.data);
		// console.log(1);
		t.is(data.success, true);
	});

	test.serial('用axios.defaults.maxConcurrent检查默认并发 ', async t => {
		return t.is(axios.defaults.maxConcurrent, defConcurrent);
	});

	test.serial('用axios.defaults.queueOptions.retry检查默认重试' + defRetry, async t => {
		return t.is(axios.defaults.queueOptions.retry, defRetry);
	});

	test.serial('用 axios.defaults.maxConcurrent 修改并发为1', async t => {
		let max = 5;
		t.plan(max);
		axios.defaults.maxConcurrent = 1;
		// t.is(axios.defaults.maxConcurrent, 1);
		let _i = 0;
		let ps = [];
		for (let i = 0; i < max; i++) {
			ps.push(
				axios.get(testUrl).then(res => {
					// console.log(i, _i);
					t.is(i, _i++);
				})
			);
		}
		return Promise.all(ps);
	});

	test.serial('默认重试测试', test_retry(defRetry));

	test.serial('用 axios.defaults.queueOptions.retry 修改默认重试 +1', async t => {
		defRetry++;
		axios.defaults.queueOptions.retry = defRetry;
		// t.is(axios.defaults.queueOptions.retry, defRetry + 1);
		return test_retry(defRetry)(t);
	});

	test.serial('retry 单独测试', async t => {
		let retry = 1;
		t.plan(retry + 2);
		// console.log('111111')
		axios.interceptors.response.use(function(res) {
			t.pass();
			throw 'err';
		});

		return axios
			.get(testUrl, {
				queueOptions: { retry }
			})
			.then(
				res => {
					t.fail();
				},
				err => {
					// console.log('222')
					axios.interceptors.response.handlers = [];
					t.is(err, 'err');
				}
			);
	});
};
