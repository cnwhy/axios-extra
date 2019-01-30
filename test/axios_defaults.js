import test from 'ava';
import axios from '../index';
import testFn from './testFn';

const axios1 = axios.create({
	maxConcurrent: 3,
	queueOptions: {
		retry: 3,
		retryIsJump: true
	}
});
axios1.defaults.maxConcurrent = 1;
axios1.defaults.queueOptions = {
	retry : 5
};

testFn(test, axios1, 1, 5);