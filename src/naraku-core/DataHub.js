/* eslint-disable */
import {
	noValue,
	stopRun,
	blank,
	errorLog,
	snapshot,
	same,
	getObjValue
} from './Utils.js';

let _Emitter = null;
let dataHubKey = 1;
let lagTime = 40;

const emitterMethods = ['on', 'once', 'emit', 'off', 'destroy'];
const statusList = ['undefined', 'loading', 'locked', 'set', 'error'];

function ifInvalid(result) {
	return function(target, name, descriptor) {
		const oldFun = target[name];
		descriptor.value = function(...args) {
			if (this._invalid) {
				return result;
			}
			return oldFun.apply(this, args);
		}
		return descriptor;
	}
}

/*
   函数执行者，可用作过滤器
 */
export class Executor {

	constructor() {
		this.myKey = dataHubKey++;
		this._invalid = false;
		this._before = {};
		this._after = {};
		this._runner = {};
	}

	@ifInvalid()
	register(name, fun) {
		if (noValue(name)) {
			return;
		}

		if (fun === false) {
			this._before[name] = null;
			this._after[name] = null;
			this._runner[name] = null;
			return blank;
		}

		if (this._runner[name]) {
			errorLog(`runner ${name} has registered`);
			return blank;
		}

		this._runner[name] = fun;

		let hasOff = false;
		return () => {
			if (!hasOff) {
				hasOff = true;
				this.register(name, false);
			}
		}
	}

	@ifInvalid()
	has(name) {
		return !!this._runner[name];
	}

	@ifInvalid()
	before(name, fun) {
		if (noValue(name) || !this._runner[name]) {
			return;
		}

		this._before[name] = this._before[name] || [];
		this._before[name].push(fun);

		return () => {
			if (this._invalid || !this._before[name]) {
				return;
			}
			const i = this._before[name].indexOf(fun);
			if (i !== -1) {
				this._before[name].selice(i, 1);
			}
		}
	}

	@ifInvalid()
	after(name, fun) {
		if (noValue(name) || !this._runner[name]) {
			return;
		}

		this._after[name] = this._after[name] || [];
		this._after[name].push(fun);

		return () => {
			if (this._invalid || !this._after[name]) {
				return;
			}
			const i = this._after[name].indexOf(fun);
			if (i !== -1) {
				this._after[name].selice(i, 1);
			}
		}
	}

	@ifInvalid()
	run(name, ...args) {
		if (noValue(name) || !this._runner[name]) {
			errorLog(`unknown runner ${name}`);
			return;
		}

		const befores = this._before[name] || [];
		let newArgs = args;
		for (let before of befores) {
			newArgs = before && before(newArgs, args);
			if (newArgs === stopRun) {
				return stopRun;
			}
		}

		const result = this._runner[name](...newArgs);
		const afters = this._after[name] || [];
		let newResult = result
		for (let after of afters) {
			newResult = after && after(newResult, result, newArgs, args);
		}

		return newResult;
	}

	@ifInvalid()
	destroy(name) {
		this._invalid = true;
		this._before = null;
		this._after = null;
		this._runner = null;
	}
}

/*
  DateHub控制器 
*/
export class Controller {
	constructor(_dataHub) {
		this.myKey = dataHubKey++;
		this._dataHub = _dataHub;
		this._emitter = _dataHub._emitter;
		this._invalid = false;
		this._offList = [];
		this._runnerList = [];
	}

	@ifInvalid()
	destroy() {
		this._invalid = true;
		this._dataHub.emit('$controllerDestroy', this._dataHub, this);
		clearTimeout(this._watchTimeoutIndex);
		this._offList.forEach(off => off());
		this._runnerList.forEach(name => {
			this._dataHub._executor && this._dataHub._executor.register(name, false);
		});
		this._runnerList = null;
		this._offList = null;
		this._dataHub = null;
		this._emitter = null;
	}

	@ifInvalid()
	run = (name, ...args) => {
		return this._dataHub._executor.run(name, ...args);
	}

	@ifInvalid()
	clear = (...args) => {
		return this._dataHub.clear(...args);
	}

	@ifInvalid()
	get = (name) => {
		return this._dataHub.get(name);
	}
	
	@ifInvalid()
	getValue = (name, blank) => {
		return this._dataHub.getValue(name, blank);
	}

	@ifInvalid()
	hasRunner = (name) => {
		return this._dataHub._executor.has(name);
	}

	@ifInvalid()
	hasData = (name) => {
		return this._dataHub.hasData(name);
	}

	@ifInvalid()
	first = (name) => {
		return this._dataHub.first(name);
	}

	@ifInvalid()
	refresh = (name) => {
		return this._dataHub.refresh(name);
	}

	@ifInvalid()
	submit = (name, param) => {
		return this._dataHub.submit(name, param);
	}

	@ifInvalid()
	set = (name, value) => {
		return this._dataHub.set(name, value);
	}

	@ifInvalid()
	assign0 = (name, obj) => {
		return this._dataHub.assign0(name, obj);
	}

	@ifInvalid()
	deleteData = (name) => {
		return this._dataHub.delete(name);
	}

	@ifInvalid()
	emit = (name, ...args) => {
		return this._dataHub.emit(name, ...args);
	}

	@ifInvalid()
	link = (name, dh2) => {
		const dh2c = dh2.controller();
		const dh2Off = dh2c.when(name, (data) => {
			this.set(name, data);
		});

		let hasOff = false;
		const off = () => {
			if (!hasOff) {
				hasOff = true;
				dh2c.destroy();
				this.delete(name);
			}
		}

		dh2._emitter.on('$storeDestroy', off);

		return off;
	}

	@ifInvalid()
	snapshot = (from, to) => {
		return this._dataHub.snapshot(from, to);
	}

	@ifInvalid()
	reset = (name) => {
		return this._dataHub.reset(name);
	}

	@ifInvalid()
	status = (...a) => {
		return this._dataHub.status(...a);
	}

	@ifInvalid(false)
	loading = (list) => {
		return this._dataHub.loading(list);
	}

	@ifInvalid(false)
	ready = (list) => {
		return this._dataHub.ready(list);
	}

	@ifInvalid()
	switchFlag(name, flag) {
		return this._dataHub.switchFlag(name, flag);
	}

	// 改名
	switchTo(...args) {
		return this.switchFlag(...args);
	}

	@ifInvalid(false)
	locked = (list) => {
		return this._dataHub.locked(list);
	}

	@ifInvalid()
	register = (name, callback) => {
		this._runnerList.push(name);
		return this._dataHub._executor.register(name, callback);
	}

	@ifInvalid()
	before = (name, callback) => {
		return this._dataHub._executor.before(name, callback);
	}

	@ifInvalid()
	after = (name, callback) => {
		this._dataHub._executor.after(name, callback);
	}

	@ifInvalid()
	on = (name, callback) => {
		if (this._invalid) {
			return;
		}
		this._emitter.on(name, callback);
		return () => {
			this._emitter.off(name, callback);
		}
	}

	@ifInvalid()
	fetch = (type, param = {}, extendParam = {}) => {
		const tempDataName = '' + Math.random();
		this._dataHub.doFetch(type, tempDataName, param, extendParam);
		return new Promise((resolve) => {
			this.once('$fetchEnd:' + tempDataName, (data) => {
				resolve(data);
				this._dataHub.delete(tempDataName);
			});
		});
	}

	@ifInvalid()
	once = (name, callback) => {
		if (this._invalid) {
			return;
		}
		this._emitter.once(name, callback);
		return () => {
			this._emitter.off(name, callback);
		}
	}

	@ifInvalid()
	watch = (callback, joinWatch = []) => {
		if (this._invalid) {
			return;
		}

		const onChange = () => {
			if (this._invalid) {
				return;
			}
			clearTimeout(this._watchTimeoutIndex);
			this._watchTimeoutIndex = setTimeout(() => {
				callback();
			}, lagTime);
		};

		this.on('$dataChange', onChange);
		this.on('$statusChange', onChange);
		
		const joinedDhc = [];
		joinWatch = [].concat(joinWatch).forEach(dh => {
			const dhc = dh.controller();
			joinedDhc.push(dhc);
			
			dhc.on('$dataChange', onChange);
			dhc.on('$statusChange', onChange);
		});
		let hasOff = false;
		const off = () => {
			if (!hasOff) {
				hasOff = true;
				joinedDhc.forEach(dhc => dhc.destroy());
			}
		}
		this._emitter.on('$storeDestroy', off);

		callback();
		return joinedDhc;
	}

	_checkReady = (name) => {
		if (this._invalid) {
			return {
				ready: false
			};
		}

		let dataList = [];
		for (let _name of name) {
			const noData = noValue(this._dataHub._data[_name]);
			const status = this._dataHub.status(_name);
			if (noData || status === 'loading' || status === 'error') {
				return {
					ready: false
				};
			}
			dataList.push(this._dataHub.get(_name));
		}

		return {
			ready: true,
			dataList
		}
	}

	@ifInvalid(blank)
	when = (name, callback, _once = false) => {
		if (Array.isArray(name)) {
			if (name.length === 0) {
				return blank;
			}

			let offList = [];

			const wrapedCallback = () => {

				const {
					ready,
					dataList
				} = this._checkReady(name);

				if (ready) {
					callback(dataList);
				}
			};

			const {
				ready,
				dataList
			} = this._checkReady(name);

			if (ready) {
				callback(dataList);
				if (_once) {
					return blank;
				}
			}

			let fun = _once ? 'once' : 'on';
			name.forEach(_name => {
				offList.push(this[fun](_name, wrapedCallback));
			});

			return () => {
				offList && offList.forEach(off => off());
				offList = null;
			};
		}

		return this._when(name, callback, _once);
	}

	@ifInvalid(blank)
	all = (name, callback) => {
		name = [].concat(name);

		let offList = [];
		let stop = false;

		const infiniteOnce = () => {
			if (this._invalid) {
				return;
			}

			Promise.all(name.map(_n => new Promise(r => {
				offList.push(this.once(_n, r));
			}))).then(() => {
				callback(this._checkReady(name).dataList);
				offList = [];
				(!stop) && infiniteOnce();
			});
		}
		infiniteOnce();

		const {
			ready,
			dataList
		} = this._checkReady(name);

		if (ready) {
			callback(dataList);
		}

		return () => {
			stop = true;
			offList.forEach(off => off());
		};
	}

	@ifInvalid(blank)
	_when = (name, callback, _once = false) => {
		if (noValue(name)) {
			return blank;
		}

		let fun = _once ? 'once' : 'on';

		const wrapedCallback = () => {
			if (this._invalid) {
				return;
			}
			
			if (this._dataHub._switcherMap.hasOwnProperty(name)) {
				if (!this._dataHub._switcherMap[name]) {
					return;
				}
			}
			
			callback(this._dataHub.get(name));
		}

		if (this._dataHub.status(name) === 'set') {
			wrapedCallback();
			if (_once) {
				return blank;
			}
		}

		return this[fun](name, wrapedCallback);
	}

}

function toObjParam(param) {
	if (noValue(param)) {
		return {};
	}
	if (typeof param !== 'object') {
		return {
			data: param
		};
	}
	return param;
}

function actionPlugn(dataName, configInfo, dh) {
	let {
		action = configInfo.type,
			dependence = [],
			lazy = false,
			filter = [],
			form = false,
			pagination = false,
			first = false,
			switcher = false,
			extendParam = {},
	} = configInfo;

	if (noValue(action) || action === 'static') {
		return;
	}

	if (form) {
		lazy = true;
	}

	dependence = [].concat(dependence);
	filter = [].concat(filter);

	if (pagination) {
		const dpName = dataName + 'Pagination';
		const oldDep = dependence.concat(filter);
		dependence = dependence.concat(dpName);

		if (typeof pagination !== 'object') {
			pagination = {};
		}
		pagination = Object.assign({}, DataHub.pagination, pagination);

		const {
			data = 'data',
				total = 'total',
		} = pagination;

		let value = {};
		if (dh._config[dpName] && dh._config[dpName].default) {
			const pgData = snapshot(dh._config[dpName].default);
			value = [].concat(pgData)[0] || {};
		}

		value = Object.assign({
			[total]: 0
		}, DataHub.paginationData, value);
		dh.set(dpName, value);

		let initValue = snapshot(value);
		dh._controller.when(oldDep, () => {
			dh.set(dpName, snapshot(initValue));
		});

		dh.addBeforeFetcher((newParam, param, newArgs, args) => {
			if (newParam && args[1] === dataName) {
				newParam = { ...newParam
				};
				delete newParam[total];
			}
			return newParam;
		});

		dh.addAfterFetcher((newResult, result, newArgs, args) => {
			if (args[1] === dataName) {
				dh._data[dpName][0][total] = newResult[total];
				return newResult[data];
			}
			return newResult;
		});
	}

	let $fetch = (extendParam) => {
		const param = {};

		for (let depName of dependence) {
			const depData = dh.get(depName);
			if (depData.length === 0) {
				if (dh.get(dataName).length !== 0) {
					dh.doFetch(null, dataName, null, null, true);
				}
				return;
			}
			Object.assign(param, toObjParam(depData[0]));
		}

		for (let filterName of filter) {
			const filterData = dh.get(filterName);
			if (filterData.length === 0) {
				continue;
			}
			Object.assign(param, toObjParam(filterData[0]));
		}

		dh.doFetch(action, dataName, param, {
			form,
			pagination: !!pagination,
			first,
			...extendParam
		});

	}

	if (switcher) {
		dh._switcherMap[dataName] = null;
		let $oldFetch = $fetch;
		$fetch = (...args) => {
			if (dh._switcherMap[dataName]) {
				$oldFetch(...args);
			} else {
				dh._switcherWatingMap[dataName] = true;;
			}
		}

		dh._controller.on('$switcher:' + dataName, (flag) => {
			dh._switcherMap[dataName] = flag;
			dh.status(dataName, flag ? 'on': 'off');
			if (flag && dh._switcherWatingMap[dataName]) {
				dh._switcherWatingMap[dataName] = false;
				$fetch();
			}
		});
	}

	const lockList = dependence.concat(filter);
	let unlock = blank;
	dh._controller.on('$statusChange:' + dataName, (status) => {
		if (status === 'loading') {
			unlock = dh.lock(lockList);
		} else {
			unlock();
		}
	});

	dh._executor.register('$refresh:' + dataName, $fetch);

	if (!lazy) {
		if (dependence.length) {
			dh._controller.when(dependence, $fetch);
		}

		if (filter.length) {
			filter.forEach(fName => dh._controller.when(fName, $fetch));
		}

		$fetch();
	}
}

const _dataHubPluginNames = ['action', 'type', 'default', 'snapshot', 'reset', 'clear'];
const _dataHubPlugin = {
	action: actionPlugn,
	type: actionPlugn,
	default: (dataName, configInfo, dh) => {
		let {
			default: _default
		} = configInfo;

		if (_default !== undefined && !dh.get(dataName).length) {
			dh.set(dataName, snapshot(_default));
		}
	},
	snapshot: (dataName, configInfo, dh) => {
		let {
			snapshot,
		} = configInfo;

		if (noValue(snapshot)) {
			return;
		}

		[].concat(snapshot).forEach(name => {
			dh._controller.when(name, () => {
				dh.snapshot(name, dataName);
			});
		});

	},
	reset: (dataName, configInfo, dh) => {
		let {
			reset,
			default: _default
		} = configInfo;

		if (reset !== undefined) {
			const doReset = (_default === undefined) ? () => {
				dh.set(dataName, []);
			} : () => {
				dh.set(dataName, snapshot(_default));
			};
			dh._controller.when(reset, doReset);
		}
	},
	clear: (dataName, configInfo, dh) => {
		let {
			clear
		} = configInfo;

		if (clear !== undefined) {
			dh._controller.when(clear, () => {
				dh.set(dataName, []);
			});
		}
	}
};

function _runDataConfigPlugn(cfg, name, info, ds) {
	if (!_dataHubPlugin[cfg]) {
		return true
	}
	return _dataHubPlugin[cfg](name, info, ds) === false ? false : true;
}

export class DataHub {
	constructor(config = {}, ControllerClass = Controller, ExecutorClass = Executor) {
		if (!_Emitter) {
			throw new Error('must implement Emitter first');
		}

		this.myKey = dataHubKey++;

		this._ControllerClass = ControllerClass;
		this._executor = new ExecutorClass();
		this._emitter = new _Emitter();
		this._controller = this.controller();
		this._lagFetchTimeoutIndex = {};
		this._data = {};
		this._status = {};
		this._offStatus = {};
		this._lockedStack = {};
		this._config = config;
		this._switcherMap = {};
		this._switcherWatingMap = {};
		this.extendData = {};

		this._controller.register('beforeFetcher', same);
		this._controller.register('afterFetcher', same);

		this.addBeforeFetcher = (callback) => {
			this._controller.after('beforeFetcher', callback);
		}
		this.addAfterFetcher = (callback) => {
			this._controller.after('afterFetcher', callback);
		}

		this._init();
	}

	_init() {
		const config = this._config;
		for (let dataName in config) {
			if (dataName.charAt(0) === '$') {
				_runDataConfigPlugn(dataName, dataName, config, this);
				continue;
			}
			const configInfo = config[dataName];
			for (let configName of _dataHubPluginNames) {
				if (!configInfo[configName]) {
					continue;
				}
				const runNext = _runDataConfigPlugn(configName, dataName, configInfo, this);
				if (!runNext) {
					break;
				}
			}
		}
	}

	@ifInvalid()
	switchFlag(names, flag = true) {
		if (names === undefined) {
			return;
		}
		[].concat(names).forEach(name => this.emit('$switcher:' + name, flag));
	}

	// 改名
	switchTo(...args) {
		return this.switchFlag(...args);
	}

	@ifInvalid()
	status(...args) {
		let [name, value = null] = args;
		const oldStatus = this._status[name] || 'undefined';
		if (args.length === 1) {
			return oldStatus;
		}
		
		if (value === 'on' || value === 'off') {
			if (!this._switcherMap.hasOwnProperty(name)) {
				errorLog(`the only data which has switch can be set status on or off`);
				return oldStatus;
			}
			
			if (oldStatus === 'off' && value === 'off') {
				return 'off';
			}
			
			if (oldStatus !== 'off' && value === 'on') {
				return oldStatus;
			}
			
			if (value === 'on') {
				value = this._offStatus[name];
				this._status[name] = value;
				delete this._offStatus[name];
				return value;
			}

			if (value === 'off') {
				this._offStatus[name] = oldStatus;
				this._status[name] = 'off';
				return 'off';
			}

			return oldStatus;
		}

		this._lockedStack[name] = this._lockedStack[name] || [];
		if (value === 'on') {
			if (this._lockedStack[name].length) {
				value = this._lockedStack[name];
			}
		}

		if (value !== null &&  value !== '$current' && statusList.indexOf(value) === -1) {
			errorLog(`${name} status must be one of ${statusList.join(',')}, but it is ${value}`);
			return oldStatus;
		}

		if (value === 'locked') {
			this._lockedStack[name].push(oldStatus);
		} else if (this._lockedStack[name].length) {
			if (value === null) {
				value = this._lockedStack[name].pop();
			} else {
				this._lockedStack[name] = [];
			}
		}

		if (value !== null && value !== oldStatus) {
			this._status[name] = value;
			this._emitter.emit('$statusChange', {
				name,
				value
			});
			this._emitter.emit('$statusChange:' + name, value);
			return this._status[name];
		}

		return oldStatus;
	}

	beforeSet(name, value) {
		return value;
	};

	@ifInvalid()
	set(name, value) {
		if (this.status(name) === 'locked') {
			errorLog(`can not set ${name} when locked`);
			return;
		}
		
		if (this.status(name) === 'off') {
			errorLog(`can not set ${name} when off`);
			return;
		}
		
		if (!this._validate(name, value)) {
			value = [];
		}
		
		const data = [].concat(value);
		value = this.beforeSet(name, value);
		if (this._checkChange(name, data)) {
			this._data[name] = data;
			this.status(name, 'set');
			this._emitter.emit('$dataChange', {
				name,
				data
			});
			this._emitter.emit(name, data);
		} else {
			this.status(name, 'set');
		}
	}

	@ifInvalid(false)
	hasData(name) {
		return this.status(name) !== 'undefined';
	}

	_blank(name) {
		if (!this._data[name] || this._data[name].length !== 0 || this.loading(name)) {
			return false;
		}
		return true;
	}

	@ifInvalid(true)
	blank(list) {
		return ([].concat(list)).reduce((a, b) => (a || this._blank(b)), false);
	}

	@ifInvalid(false)
	ready(list) {
		return ([].concat(list)).reduce((a, b) => (a && this.status(b) === 'set'), true);
	}

	@ifInvalid(false)
	loading(list) {
		return ([].concat(list)).reduce((a, b) => (a || this.status(b) === 'loading'), false);
	}

	@ifInvalid(false)
	error(list) {
		return ([].concat(list)).reduce((a, b) => (a || this.status(b) === 'error'), false);
	}

	@ifInvalid(false)
	locked(list) {
		return ([].concat(list)).reduce((a, b) => (a || this.status(b) === 'locked'), false);
	}

	@ifInvalid()
	lock(names) {
		let unlock = false;
		names = [].concat(names);
		names.forEach(name => {
			this.status(name, 'locked');
		});

		return () => {
			if (!unlock) {
				unlock = true;
				names.forEach((name) => {
					this.status(name, null);
				});
			}
		};
	}

	@ifInvalid()
	submit(name, param = {}) {
		const {
			data = {},
				lock = [],
				refresh = [],
				callback = blank,
				extend = {}
		} = param;

		if (!this.ready(name) && this.status(name) !== 'undefined') {
			errorLog(`${name} is not ready, can not be submited`);
			return;
		}

		const unlock = this.lock([].concat(lock).concat(refresh))

		this.set(name, data);
		this.refresh(name, extend);

		const afterSubmit = (data) => {
			callback(data);
			unlock();
			[].concat(refresh).forEach(refreshName => {
				this.refresh(refreshName);
			});
		}

		return new Promise((resolve, reject) => {
			this._controller.once('$fetchEnd:' + name, (resultData) => {
				if (this.status(name) === 'error') {
					this.set(name, [])
					afterSubmit([]);
					reject([]);
				} else {
					afterSubmit(resultData)
					resolve(resultData);
				}
			});
		});
	}

	@ifInvalid()
	emit(name, ...args) {
		this._emitter.emit(name, ...args);
	}

	@ifInvalid()
	bind(that, dhName, dhCName, watch) {
		return DataHub.bind(this, that, dhName, dhCName, watch);
	}

	beforeGet(name, value) {
		return value;
	}

	@ifInvalid()
	get(name) {
		return this.beforeGet(name, this._data[name] || []);
	}
	
	@ifInvalid()
	getValue(name, blank) {
		const [dhName, ...dataPath] = name.split('.');
		return getObjValue(this.get(dhName), dataPath, blank);
	}

	@ifInvalid()
	first(name) {
		const a = this.get(name)[0];
		if (a === undefined) {
			return {};
		}
		return a;
	}

	@ifInvalid()
	assign0(name, obj = {}) {
		const newObj = Object.assign(this.first(name), obj);
		const data = this.get(name);
		data.splice(0, 1, newObj);
		this.set(name, data);
	}

	@ifInvalid()
	snapshot(from, to) {
		this.set(to, snapshot(this.get(from)));
	}

	@ifInvalid()
	reset(name) {
		const cfg = this._config[name];
		if (!cfg || cfg.default === undefined) {
			this.delete(name);
		} else {
			this.set(name, snapshot(cfg.default));
		}
	}

	@ifInvalid()
	clear(name) {
		if (noValue(name)) {
			return;
		}

		[].concat(name).forEach(_name => {
			if (this.hasData(_name)) {
				this.set(_name, []);
			}
		});
	}

	@ifInvalid()
	delete(name) {
		delete this._data[name];

		this.status(name, 'undefined');
		delete this._status[name];
		delete this._offStatus[name];

		this.emit('$dataChange', {
			name
		});
		this.emit('$delete:' + name);
	}

	deleteData = this.delete;

	@ifInvalid()
	refresh(name, param) {
		const $refresh = '$refresh:' + name;
		if (this._executor.has($refresh)) {
			this._executor.run($refresh, param);
		} else {
			this._emitter.emit(name, this.get(name));
		}
	}

	_checkChange() {
		return true;
	}

	_validate(name, value) {
		if (value === undefined) {
			// errorLog(`${name} can not be undefined`);
			return false;
		}
		return true;
	}

	@ifInvalid()
	doFetch(action, name, param = {}, extend = {}, fetchBlank = false) {

		clearTimeout(this._lagFetchTimeoutIndex[name]);
		if (fetchBlank) {
			this.set(name, []);
			return;
		}

		this._lagFetchTimeoutIndex[name] = setTimeout(() => {
			if (this._invalid) {
				return;
			}
			if (this.status(name) === 'loading') {
				errorLog(`${name} can not be fetched when loading`);
				return;
			}

			this.status(name, 'loading');
			param = snapshot(param);

			Promise.resolve(param)
				.then((param) => this._controller.run('beforeFetcher', param, name, this))
				.then((param) => DataHub.dh._controller.run('beforeFetcher', param, name, this))
				.then((newParam) => {
					if (newParam === stopRun || this._invalid) {
						return Promise.reject(stopRun);
					}
					let submitData = snapshot(this.get(name));
					if (extend.first) {
						submitData = submitData[0];
					}
					return DataHub.dh._controller.run(action, { ...extend,
						param: newParam,
						data: submitData
					});
				})
				.then((result) => {
					return DataHub.dh._controller.run('afterFetcher', result, name, this);
				})
				.then((result2) => {
					return this._controller.run('afterFetcher', result2, name, this);
				})
				.then((newResult) => {
					if (newResult === undefined) {
						newResult = [];
					} else {
						newResult = [].concat(newResult);
					}
					this.set(name, newResult);
					this.emit('$fetchEnd', newResult);
					this.emit('$fetchEnd:' + name, newResult);
				}).catch((e) => {
					if (this._invalid) {
						return;
					}
					if (e === stopRun) {
						this.status(name, 'set');
					} else {
						errorLog(e);
						if (!this._data[name]) {
							this.set(name, []);
						}
						this.status(name, 'error');
						this.emit('$error', e);
						this.emit('$error:' + name, e);
						this.emit('$fetchEnd', e);
						this.emit('$fetchEnd:' + name, e);
					}
				});
		}, lagTime);
	}

	@ifInvalid()
	controller() {
		return new this._ControllerClass(this);
	}

	@ifInvalid()
	destroy() {
		this._invalid = true;
		Object.keys(this._lagFetchTimeoutIndex).forEach(index => {
			clearTimeout(index);
		});
		this._emitter.emit('$storeDestroy', this._emitter);

		this._controller.destroy();
		this._executor.destroy();
		this._emitter.destroy();

		this._lagFetchTimeoutIndex = null;
		this._executor = null;
		this._emitter = null;
		this._config = null;
		this._data = null;
		this._status = null;
		this._offStatus = null;
		this._switcherMap = null;
		this._lockedStack = null;
		this._switcherWatingMap = null;
		this.extendData = null;
	}
}

DataHub.addPlugn = (name, callback) => {
	if (name.charAt(0) !== '$') {
		_dataHubPluginNames.push(name);
	}
	_dataHubPlugin[name] = callback;
}

DataHub.instance = (config) => {
	return new DataHub(config);
}

DataHub.setEmitter = (Emitter) => {
	if (_Emitter) {
		errorLog('Emitter has implemented, who care!');
	}

	const _pe = Emitter.prototype;
	emitterMethods.forEach(name => {
		if (typeof _pe[name] !== 'function') {
			throw new Error(`Emitter must implement ${emitterMethods.join(',')}, but the Emitter do not implement ${name}.`);
		}
	});

	_Emitter = Emitter;

	DataHub.dh = DataHub.instance({});

	DataHub.addBeforeFetcher = (callback) => {
		DataHub.dh._controller.before('beforeFetcher', callback);
	}
	DataHub.addAfterFetcher = (callback) => {
		DataHub.dh._controller.after('afterFetcher', callback);
	}
	DataHub.addFetcher = (name, callback) => {
		DataHub.dh._controller.register(name, callback);
	}

	['get', 'set', 'assign0', 'first', 'emit'].forEach(funName => {
		DataHub[funName] = (...args) => {
			return DataHub.dh[funName](...args);
		}
	});

	['when', 'all', 'on', 'once', 'register', 'run'].forEach(funName => {
		DataHub[funName] = (...args) => {
			return DataHub.dh._controller[funName](...args);
		}
	});

}

DataHub.inject = blank;
DataHub.bind = blank;

DataHub.dhName = 'dh';
DataHub.pDhName = 'pDh';
DataHub.gDhName = 'gDh';

DataHub.dhCName = 'dhController';
DataHub.pDhCName = 'pDhController';
DataHub.gDhCName = 'gDhController';

DataHub.joinWatchName = 'joinedDhList';

DataHub.viewType = 'auto';

DataHub.pagination = {
	data: 'data',
	total: 'total'
};

DataHub.paginationData = {
	page: 1,
	limit: 10,
	total: 0,
}

DataHub.bindView = (dataHub, updateView = () => blank, dhName, dhCName, watch = false) => {
	if (noValue(dhName)) {
		dhName = DataHub.pDhName;
	}
	
	if (noValue(dhCName)) {
		dhCName = dhName + 'Controller'
	}
	
	return {
		doBind: (that) => {
			if (that[dhName]) {
				errorLog(`dataHub has bound by name ${dhName}.`);
				return;
			}
			that[dhName] = dataHub;
			that[dhCName] = that[dhName].controller();
			if (watch) {
				that[dhCName].watch(() => updateView.call(that), that[DataHub.joinWatchName]);
			}
		},
		beforeDestroy: (that, beforeDestroy) => {
			beforeDestroy && beforeDestroy.apply(that);

			that[dhCName] && that[dhCName].destroy();
			that[dhCName] = null;
			that[dhName] = null;
		}
	}
};

DataHub.injectView = (config = null, updateView = () => blank, gDh = true) => {
	return {
		afterCreated: (that, afterCreated) => {
			const cfg = !noValue(config);
			if (cfg) {
				that[DataHub.dhName] = DataHub.instance(config);
				that[DataHub.dhCName] = that[DataHub.dhName].controller();
				that[DataHub.dhCName].watch(() => updateView.call(that), that[DataHub.joinWatchName]);
			}

			if (gDh) {
				that[DataHub.gDhName] = DataHub.dh
				that[DataHub.gDhCName] = DataHub.dh.controller();
				that[DataHub.gDhCName].watch(() => updateView.call(that), that[DataHub.joinWatchName]);
			}

			if ((!cfg) && (!gDh)) {
				errorLog('not inject dataHub or globalDataHub, who care!')
			}

			afterCreated && afterCreated.apply(that);
		},
		beforeDestroy: (that, beforeDestroy) => {
			beforeDestroy && beforeDestroy.apply(that);

			that[DataHub.gDhCName] && that[DataHub.gDhCName].destroy();
			that[DataHub.dhName] && that[DataHub.dhName].destroy();

			that[DataHub.dhName] = null;
			that[DataHub.dhCName] = null;
			that[DataHub.gDhCName] = null;
		}
	}
};

DataHub.setLagTime = (v) => {
	lagTime = (+v) || 40;
}
