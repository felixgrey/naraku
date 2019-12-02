import {noValue, errorLog} from './Utils.js';

/*
用于定义DSL。

属性实体: 名称[@后缀1[~值]@后缀2...]。
实体：[名称属性实体]=[值属性实体]。
语句：定义实体:[[主语实体1,主语实体2...][=>[宾语实体1,宾语实体2...]]]。
语言：[语言#][语句1;语句2;...]。

返回值结构 {
  languages // 语言实体
  statements // 语句实体
}

statement结构 {
  declareEntities // 定义实体
  subjectEntities // 主语实体
  objectEntities // 宾语实体
}

entity结构 {
  name // 实体名称
  nameAttribute // 实体名称属性
  value // 实体值
  valueAttribute //实体值属性
}

*/

function nullIfBlank(value) {
  if (noValue(value)) {
    return null;
  }
  
  if (typeof value === 'string') {
    return value.trim() === '' ? null : value;
  }
  
  if (Array.isArray(value)) {
    const length = value.filter(v => nullIfBlank(v) !== null).length;
    return !length ? null : value;
  }
  
  if (typeof value === 'object') {
    return !Object.keys(value).length ? null : value;
  }
  
  return value;
}

function toKeyValue(sourceCode, marker, blank0Able = false) {
  sourceCode = nullIfBlank(sourceCode);
  marker = nullIfBlank(marker);
  if (sourceCode === null || marker === null) {
    return [null, null];
  }
  
  if (sourceCode.indexOf(marker) === -1) {
    if (blank0Able) {
      return [null, sourceCode];
    }
    return [sourceCode , null];
  }
  
  let [v1, v2] = sourceCode.split(marker);
  v1 = nullIfBlank(v1);
  v2 = nullIfBlank(v2);
  
  if (v1 === null && blank0Able) {
    return [v2, null];
  }
  return [v1, v2];
}

function toList(sourceCode = '', marker = ',', filter = true) {
  if(nullIfBlank(sourceCode) === null) {
    return [];
  }
  const sourceList = sourceCode.split(marker).map(v => v.trim()); 
  return filter ? sourceList.filter(v => nullIfBlank(v) !== null ) : sourceList;
}

function toOneAttribute(sourceCode = '') {
  if(nullIfBlank(sourceCode) === null) {
    return [null, null];
  }
  let [key, value] = toKeyValue(sourceCode, '~');  
  
  let noKey = key === null ? true : false;
  const not = (!noKey && key.charAt(0) === '!');
  key = noKey ? null : (not ? key.replace('!', '') : key);
  if (nullIfBlank(key) === null) {
    errorLog('no attribute key:' + sourceCode);
    return [null, null];
  }
  value = value === null ? (not ? false : true) : value;

  return [key, value];
}

function toAttribute(sourceCode = '') {
  if (nullIfBlank(sourceCode) === null) {
    return [null, null];
  }

  const [name, ...attrList] = toList(sourceCode, '@', false);
  
  let attributeObj = {};
  attrList.forEach(attrSource => {
    const [key, value] = toOneAttribute(attrSource);  
    (nullIfBlank(key) !== null) && (attributeObj[key] = nullIfBlank(value));
  });

  return [name, nullIfBlank(attributeObj)];
}

let unShowChars = [
  '\uE000','\uE001','\uE002','\uE003','\uE004','\uE005','\uE006','\uE007','\uE008','\uE009',
  '\uE010','\uE011','\uE012','\uE013','\uE014','\uE015','\uE016','\uE017','\uE018','\uE019',
  '\uE020','\uE021','\uE022','\uE023','\uE014','\uE025','\uE026','\uE027','\uE028','\uE029'
];
const keyWords = ["#", ";", ":", "," ,"=" , "@", "~", "|", "&"];
export function replaceKeyWords(sourceCode){
	keyWords.forEach((word, index) => {
		sourceCode = sourceCode.replace(new RegExp('&\\' + word, 'g'), unShowChars[index]);
	});
	return sourceCode;
}
export function reducKeyWords(str) {
	unShowChars.forEach((code, index) => {
		str = str.replace(new RegExp(code, 'g'), keyWords[index]);
	});
	return str;
}

function specialValue(value, valueAttribute) {
	const {
		number,
		int,
		float,
		boolean,
		string,
		json,
	} = valueAttribute || {};
	
	if (!string) {
		if (value === '$undefined') {
			return undefined;
		} else if (value === '$null') {
			return null;
		} else if (value === '$blank') {
			return '';
		} else if (value === '$true') {
			return true;
		} else if (value === '$false') {
			return false;
		} else if (/\$space(\d*)/g.test(value)) {			
			let repeat = 1;
			(value + '').replace(/\$space(\d*)/g, (a, num) => { repeat = (+num)});			
			return new Array(repeat + 1).join(' ');
		}
	}
	
	if (number) {
		return +value;
	} else if (int) {
		return parseInt(value);
	} else if (float) {
		return parseFloat(value);
	} else if (boolean) {
		return !!value;
	} else if (string) {		
		return reducKeyWords(value + '');
	} else if (json) {		
		return JSON.parse(reducKeyWords(value + ''));
	}

	return value;
}

function compileValue(value, valueAttribute) {
	if (typeof value === 'string' && value.indexOf('|') !== -1) {
		value = value.split('|').filter(v => v.trim() !== '').map(v => specialValue(v, valueAttribute));
	}
	
	if (!Array.isArray(value)) {
		value = specialValue(value, valueAttribute);
	}
	
	return value;
}

function toEntity(sourceCode = '', nvlNameAble = false) {
  if (nullIfBlank(sourceCode) === null) {
    return null;
  }
  
  const entityList = toList(sourceCode, ',').map(sourcePart => {
    const [keySource, valueSource] = toKeyValue(sourcePart, '='); 
    let [name, nameAttribute] = toAttribute(keySource);
    if (nullIfBlank(name) === null && !nvlNameAble) {
      errorLog('no entity key:' + sourcePart);
      return null;
    }

    let [value, valueAttribute] = toAttribute(valueSource);

	value = compileValue(value, valueAttribute);
	
	nameAttribute = nameAttribute === null ? {} : nameAttribute;
	valueAttribute = valueAttribute === null ? {} : valueAttribute;
	
	for (let attr in nameAttribute) {
		nameAttribute[attr] = compileValue(nameAttribute[attr], {});
	}
	for (let attr in valueAttribute) {
		valueAttribute[attr] = compileValue(valueAttribute[attr], {});
	}

    return {
      name,
      nameAttribute,
      value,
      valueAttribute
    }
    
  }).filter(v => nullIfBlank(v) !== null);

  return entityList;
}

export function compile(sourceCode = '') {
	sourceCode = sourceCode.replace(/={4,}/g, '====');
	let sourceCodeList = sourceCode.split('====').filter(a => a.trim() !== '');
	let compiled = sourceCodeList.map(_sourceCode => {
		return _compile(_sourceCode);
	});
	if (compiled.length === 1) {
		return compiled[0];
	}
	return compiled;
}

function _compile(sourceCode = '') {
  sourceCode = replaceKeyWords(sourceCode.replace(/\n|\t/g, ' '));

  const [languageSource, statementsSource] = toKeyValue(sourceCode, '#', true);
  const statements = toList(statementsSource, ';').map(staSource => {
    const [d_sSource, objectSource] = toKeyValue(staSource, '=>'); 
    const [declareSource, subjectSource] = toKeyValue(d_sSource, ':'); 
    const declareEntities =  toEntity(declareSource);
    
    if (nullIfBlank(declareEntities) === null) {
      errorLog('no declare:' + staSource);
      return null;
    }

    return {
      declareEntities: declareEntities || [],
      subjectEntities: toEntity(subjectSource) || [],
      objectEntities: toEntity(objectSource) || []
    };
  }).filter(v => nullIfBlank(v) !== null);

  return {
    languages: toEntity(languageSource, true) || [],
    statements: statements || []
  };
}

function destruct(data) {
  if (nullIfBlank(data) === null) {
    return null;
  }

  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      return data.length <= 1 ? destruct(data[0]) : data.map(item => destruct(item));
    }

    const data2 = {};
    Object.keys(data).forEach(key => {
      (nullIfBlank(data[key]) !== null) && (data2[key] = destruct(data[key]));
    });

    const keyLength = Object.keys(data2).length;

    if(keyLength === 1 && nullIfBlank(data2.name) !== null) {
      return data2.name
    }
    
    return nullIfBlank(data2);
  }
  
  return data;
}

compile.destruct = destruct;
