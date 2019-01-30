const Queue = require('promise-queue-plus/create')(Promise);
const apis_arg1 = new Set(['request']);
const apis_arg2 = new Set(['get', 'delete', 'head', 'options']);
const apis_arg3 = new Set(['post', 'put', 'patch']);
const DEF_MAX_CONCURRENT = 10;
let debug = false;

function proxyAxios(queue, axios) {

	function run(fn, config, ...args) {
		let axiosConfig = config || {};
		let queueOptions = axiosConfig.queueOptions || undefined;
		debug && console.log('workQueueOptions:', queueOptions);
		if (debug) {
			return queue.go(() => {
				return fn.apply(this, args).then(
					data => {
						console.log('_ok_');
						return data;
					},
					err => {
						console.log('_err_');
						throw err;
					}
				);
			}, queueOptions);
		} else {
			return queue.go(() => {
				return fn.apply(this, args);
			}, queueOptions);
		}
	}

	// 为 axios.defaults 添加 maxConcurrent 与 queueOptions 支持
	axios.defaults.queueOptions = queue._options;
	Object.defineProperties(axios.defaults, {
		maxConcurrent: {
			get() {
				return queue.getMax();
			},
			set(v) {
				queue.setMax(v);
			}
		},
		queueOptions: {
			get() {
				return queue._options;
			},
			set(v) {
				[
					'queueStart',
					'queueEnd',
					'workAdd',
					'workResolve',
					'workReject',
					'workFinally',
					'retry',
					'retryIsJump',
					'timeout',
					'autoRun'
				].map(k => {
					if (k in v) {
						queue._options[k] = v[k];
					}
				});
			}
		}
	});

	return new Proxy(axios, {
		apply: function(target, thisArg, argumentsList) {
			return run.call(thisArg, target, argumentsList[0], ...argumentsList);
		},
		get: function(target, property, receiver) {
			let attr = Reflect.get(target, property, receiver);
			let i = apis_arg1.has(property)
				? 0
				: apis_arg2.has(property)
				? 1
				: apis_arg3.has(property)
				? 2
				: null;
			if (i) {
				return function(...args) {
					return run.call(this, attr, args[i], ...args);
				};
			}
			if (property === 'create') {
				return function(options = {}) {
					let { maxConcurrent, queueOptions } = options;
					return create(attr.call(this, options), maxConcurrent, queueOptions);
				};
			}
			return attr;
		}
	});
}

function create(axios, maxConcurrent = DEF_MAX_CONCURRENT, queueOptions = {}) {
	return proxyAxios(Queue(maxConcurrent, queueOptions), axios);
}

module.exports = create;
