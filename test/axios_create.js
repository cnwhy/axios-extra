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

testFn(test, axios1, 3, 3);