/* eslint-disable no-unused-vars */
export function isObject(value) {
  return dataType(value) === 'object';
}

// 追加合并，如果存在，则不修改，不存在则追加属性,但value为空
export const extend = (sourceObj, compareObj) => {
  let obj = JSON.parse(JSON.stringify(sourceObj));
  for (const key in compareObj) {
    if (obj.hasOwnProperty(key)) {
      if (isObject(obj[key])) {
        obj[key] = extend(obj[key], compareObj[key]);
      }
    } else {
      obj[key] = undefined;
    }
  }
  return obj;
};

// 设置对象value值
export const setObjValue = (sourceObj, value) => {
  let obj = { ...sourceObj };
  for (let key in obj) {
    if (isObject(obj[key])) {
      setObjValue(obj[key], value);
    } else {
      obj[key] = value;
    }
  }
  return obj;
};
// 字符串循环
export const stringLoop = (str: string, num: number): string => {
  return num > 1 ? (str += stringLoop(str, --num)) : str;
};

export const dataType = (val: any): string => {
  return Object.prototype.toString.call(val).replace(/^.{8}(.+)]$/, (m, $1) => $1.toLowerCase());
};

// 循环对象
type Item = [string, any, number];
export const serializeObject = (obj: Object): Item[] => {
  let list: Item[] = [];
  let index = 0;
  for (let key in obj) {
    list.push([key, obj[key], index]);
    index++;
  }
  return list;
};

// 判断是否为json
export const isJSON = (str: string): boolean => {
  try {
    var obj = JSON.parse(str);
    if (typeof obj === 'object' && obj) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log('error：' + str + '!!!' + e);
    return false;
  }
};
