const axios = require('axios');
const Queue = require('promise-queue-plus');

const PROXY_APIS = new Set(['request', 'get', 'delete', 'head', 'options', 'post', 'put', 'patch']);
const DEF_MAX_CONCURRENT = 10;

function proxyAxios(queue, axios) {
	return new Proxy(
		function(...args) {
			return queue.go(() => {
				return axios.apply(this, args);
			});
		},
		{
			get: function(target, property, receiver) {
				let attr = Reflect.get(axios, property, receiver);
				if (PROXY_APIS.has(property)) {
					return function(...args) {
						return queue.go(() => {
							return attr.apply(this, args);
						});
					};
				}
				if (property === 'create') {
					return function(options = {}) {
						let { maxConcurrent, queueOptions } = options;
						return create(maxConcurrent, attr.call(this, options, queueOptions));
					};
				}
				return attr;
			}
		}
	);
}

function create(maxConcurrent = DEF_MAX_CONCURRENT, _axios = axios, queueOptions = {}) {
	return proxyAxios(new Queue(maxConcurrent), _axios, queueOptions);
}

module.exports = create(DEF_MAX_CONCURRENT);
