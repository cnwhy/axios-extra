const Queue = require('promise-queue-plus');
const apis = new Set(['request', 'get', 'delete', 'head', 'options', 'post', 'put', 'patch']);
const DEF_MAX_CONCURRENT = 10;
let debug = false;

function proxyAxios(queue, axios) {
	function run(fn, ...args) {
		let axiosConfig = args[args.length - 1];
		let queueOptions = 
			typeof axiosConfig == 'object' ? axiosConfig.queueOptions : undefined;
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

	return new Proxy(axios, {
		apply: function(target, thisArg, argumentsList) {
			return run.call(thisArg, target, ...argumentsList);
		},
		get: function(target, property, receiver) {
			let attr = Reflect.get(target, property, receiver);
			if (apis.has(property)) {
				return function(...args) {
					return run.call(this, attr, ...args);
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
	return proxyAxios(new Queue(maxConcurrent, queueOptions), axios);
}

module.exports = create;
