/* eslint-disable no-unused-vars */
function isObject(value) {
  if (value === null || value === undefined) {
    return false;
  }
  return value.toString() === '[object Object]';
}
// 深合并
const extend = (sourceObj, compareObj) => {
  let obj = { ...sourceObj };
  for (var key in compareObj) {
    obj[key] =
      obj[key] && isObject(obj[key])
        ? extend(obj[key], compareObj[key])
        : (obj[key] = compareObj[key]);
  }
  return obj;
};

// 设置对象value值
const setObjValue = (sourceObj, value) => {
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
const stringLoop = (str: string, num: number): string => {
  return num > 1 ? (str += stringLoop(str, --num)) : str;
};

