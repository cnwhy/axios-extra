import test from 'ava';
import axios from '../index';

test('maxConcurrent 不能小于等于零', t => {
	t.plan(4);
	t.throws(() => {
		axios.defaults.maxConcurrent = 0;
	});
	t.throws(function(){
		let axios1 = axios.create({
			maxConcurrent: 0
		});
	})
	t.throws(() => {
		axios.defaults.maxConcurrent = -1;
	});
	t.throws(function(){
		let axios1 = axios.create({
			maxConcurrent: -1
		});
	})
});
