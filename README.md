# axios-extra

通过 ES6 的`Proxy`对像, 让 [axios](https://github.com/axios/axios) 集成 [promise-queue-plus](https://github.com/cnwhy/promise-queue-plus), 使 `axios` 支持 **最大并发** 及 **出错重试** 的功能.

> 未添加任何 API, 你完全可以像使用 `axios` 那样使用 `axios-extra`;
> 由于使用了`Proxy`,请注意兼性.

## API

### axios.create(config)

现在可以通过设置 `maxConcurrent` 和 `queueOptions` 属性, 设置最大并发及重试次数.

```js
// axios 并发为10, 自动重试为0
const axios = require('axios-extra'); //默认最大并发 10, 重试 0;

// 创建一个 并发为1, 自动重试为3的 axios;
let axios1 = axios.create({
	maxConcurrent:1, //并发为1
	queueOptions: {
		retry:3, //请求失败时,最多会重试3次
		retryIsJump: true //是否立即重试, 否则将在请求队列尾部插入重试请求
	}
});
```

> 更多 `queueOptions` 配制可参看[这里](https://github.com/cnwhy/promise-queue-plus#queuepushpromisefun-args-options)

### axios(config) 及 get|post|request|delete|head|options|put|patch

`config`参数可以为某一次的请求设置 `queueOptions`;

```js
axios.get('https://www.google.com',{
	queueOptions : {
		retry: 5
	}
});
```

### `create(axios,maxConcurrent,queueOptions)` 扩展现有 `axios`

使用项目中已有 `axios`, 保证用打包工具时不会打包多个版本的 `axios`.

```js
const aec = require('axios-extra/create');
const axios = aec(requeir('axios'), 5, { retry: 5 });
```
