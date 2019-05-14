/*
 空值检查函数
 */
export function noValue(value) {
  return (value === null || value === undefined);
}

/*
 默认函数系列
 */
export function blank(){}
export function blankNull(){ return null}
export function same(a){ return a}

/*
 错误警告
*/
let errorLog = blank;
let console = (global || {}).console;
if (process && process.env && process.env.NODE_ENV === 'development' && console && typeof console.error === 'function') {
  errorLog = function(...args){console.error('【naraku-WARING】:', ...args)};
}
export {errorLog};

/*
  数据快照 
*/
export function snapShot(data) {
  if (noValue(data) || typeof data !== 'object') {
    return data;
  }
  return JSON.parse(JSON.stringify(data));
}

/*
  18位统一Id
*/
let idIndex = 1;
let idBase = Math.random()*10e18;
export function uid18(){
  return idBase + idIndex++;
}

/*
 当前URL
 */
const localBaseUrl = (() => {
  let {protocol = '', hostname = '', port = ''} = global.location || {};
  return `${protocol}//${hostname}${port ? (':' + port) : ''}`;
})();
export {localBaseUrl};

/*
 停止运行标记
 */
const stopRun = Math.random() * 10e6;
export {stopRun};

/*
 首字母大写
 */
function upperCase0(text = '') {
  return `${text}`.replace(/^[a-z]{1}/, a => a.toUpperCase());
}
export {upperCase0};