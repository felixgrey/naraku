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
const stopRun ='stop-'+ Math.random() * 10e6 + '-' + Math.random() * 10e6;
export {stopRun};

/*
 首字母大写
 */
function upperCase0(text = '') {
  return `${text}`.replace(/^[a-z]{1}/, a => a.toUpperCase());
}
export {upperCase0};

/*
  数字格式化
 */
const NumberFormat = {
  percent: function(number, extendParam = {}) {
    const {
      fixed = 2,
      forceFixed = false,
      decimal = true,
      noSymbol = false,
      noZero = false,
      blank = '--'
    } = extendParam;

    const percentSymbol = noSymbol ? '' : '%'
    
    if (noValue(number) || isNaN(+number)) {
      return  blank;
    }
    
    number = new Number(number * (decimal ? 100 : 1)).toFixed(fixed);
    if (!forceFixed) {
      number = number.replace(/(\.\d*?)[0]*$/g, (a, b) => b.replace(/\.$/g, ''));
    }
    
    if (noZero) {
      number = number.replace(/^0\./g, '.');
    }

    return  number + percentSymbol;
  },
  thsepar: function (number, extendParam = {}) {
     const {
      fixed = 2,
      forceFixed = false,
      noZero = false,
      blank = '--'
    } = extendParam;
    
    if (noValue(number) || isNaN(+number)) {
      return  blank;
    }

    let number2 = parseInt(number);
    let decimal = number - number2;
  
    if (isNaN(number2) || isNaN(decimal)){
       return  blank;
    }
  
    number2 = Array.from(`${number2}`)
      .reverse()
      .map((c, index) => index % 3 === 0 ? c + ',' : c)
      .reverse()
      .join('')
      .replace(/,$/g, '');
  
    if (decimal) {
      number2 = number2 + new Number(decimal).toFixed(fixed).replace('0.', '.');      
    }
    
    if (noZero) {
      number2 = number2.replace(/^0\./g, '.');
    }
    
    if (!forceFixed) {
      number2 = number2.replace(/(\.\d*?)[0]*$/g, (a, b) => b.replace(/\.$/g, ''));
    }

    return number2;
  }
};
export {NumberFormat};