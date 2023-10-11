import test from "ava";
import axios from "../index";
const testUrl = "https://www.baidu.com";

test("maxConcurrent 不能小于等于零", (t) => {
	t.plan(4);
	t.throws(() => {
		axios.defaults.maxConcurrent = 0;
	});
	t.throws(function () {
		let axios1 = axios.create({
			maxConcurrent: 0,
		});
	});
	t.throws(() => {
		axios.defaults.maxConcurrent = -1;
	});
	t.throws(function () {
		let axios1 = axios.create({
			maxConcurrent: -1,
		});
	});
});

test("调用Queue API stop", async (t) => {
	t.plan(1);
	const axios1 = axios.create({ maxConcurrent: 1 });
	let k = Promise.all([
		axios1.get(testUrl).then(t.pass, t.fail)
	]);
	axios1.get(testUrl).then(t.fail, t.fail);
	axios1.get(testUrl).then(t.fail, t.fail);
	axios1.get(testUrl).then(t.fail, t.fail);
	axios1.requestQueue.stop();
	return k;
});

test("调用Queue API start", async (t) => {
	t.plan(4);
	const axios1 = axios.create({ maxConcurrent: 1 });
	let k = Promise.all([
		axios1.get(testUrl).then(t.pass, t.fail),
		axios1.get(testUrl).then(t.pass, t.fail),
		axios1.get(testUrl).then(t.pass, t.fail),
		axios1.get(testUrl).then(t.pass, t.fail),
	]);

	axios1.requestQueue.stop();
	setTimeout(() => {
		axios1.requestQueue.start();
	}, 100)
	return k;
});

test("调用Queue API clear", async (t) => {
	t.plan(4);
	const axios1 = axios.create({ maxConcurrent: 1 });
	let k = Promise.all([
		axios1.get(testUrl).then(
			(data) => {
				t.pass();
			},
			(err) => {
				t.fail();
			}
		),
		axios1.get(testUrl).then(
			t.fail,
			(err) => {
				t.is(err, "runClear");
			}
		),
		axios1.get(testUrl).then(
			t.fail,
			(err) => {
				t.is(err, "runClear");
			}
		),
		axios1.get(testUrl).then(
			t.fail,
			(err) => {
				t.is(err, "runClear");
			}
		),
	]);
	axios1.requestQueue.clear('runClear');
	return k;
});
