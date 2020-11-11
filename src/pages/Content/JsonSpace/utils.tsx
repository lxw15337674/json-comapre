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

export const compare = (obj, compareObj) => {
  // const fullObj = extend(obj, compareObj);
  let result = Object.entries(obj).reduce((acc, cur, index) => {
    const [key, value] = cur;
    const compareValue = compareObj[key];
    if (isObject(value)) {
      acc[key] = compare(value, compareValue || {});
      return acc;
    }
    if (isObject(compareValue)) {
      acc[key] = compare({}, compareValue);
      return acc;
    }
    if (compareValue === undefined) {
      acc[key] = '+';
      return acc;
    }
    // 这个地方就要进行隐式转换为string，进行比较，解决数组等类型的问题
    // eslint-disable-next-line eqeqeq
    acc[key] = value == compareValue ? '=' : 'diff';
    return acc;
  }, {});
  for (let key in compareObj) {
    if (!result[key]) {
      if (isObject(compareObj[key])) {
        result[key] = setObjValue(compareObj[key], '-');
      } else {
        result[key] = '-';
      }
    }
  }
  return result;
};
