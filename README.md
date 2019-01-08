# axios-plus

## API

### axios.create(options)
```
const axios = require('axios-plus');
let axios1 = axios.create({
	maxConcurrent:1,
	queueOptions:{retry:3}
});
```