# axios-plus
通过ES6的`Proxy`对像, 让 [axios](https://github.com/axios/axios) 集成 [promise-queue-plus](https://github.com/cnwhy/promise-queue-plus);  
让`axios`支持 最大并发 及 出错重新请求

> 未添加任何API, 你完全可以像使用 `axios` 那样使用 `axios-plus`, 默认最大并发10, 重试0;
> 由于使用了`Proxy`,请注意兼性,.

## API

### axios.create(config)  
现在可以通过设置 `maxConcurrent` 和 `queueOptions` 属性, 设置最大并发及重试次数.

```
// axios 并发为10, 自动重试为0
const axios = require('axios-plus'); 

// 创建一个 并发为1, 自动重试为3的 axios;
let axios1 = axios.create({
	maxConcurrent:1, //并发为1
	queueOptions: {
		retry:3      //请求失败时,最多会重试3次
	}
});
```
> 更多 `queueOptions` 配制可参看[这里](https://github.com/cnwhy/promise-queue-plus#queuepushpromisefun-args-options)

### axios(config) 及 get|post|request|delete|head|options|put|patch
`config`参数可以为某一次的请求设置 `queueOptions`;

```
axios.get('https://www.google.com',{
	queueOptions : {
		retry: 5
	}
});
```

## 己知问题
 - 不能通过 `axios.defaults` 更改并发及重试次数.