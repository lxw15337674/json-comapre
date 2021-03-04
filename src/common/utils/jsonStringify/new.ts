import { BasicType, Status } from '../interface';
import jsonValueCallBack from '../jsonValueCallback';
import { copy, find, serializeObject, stringLoop } from '../utils';

const stringify = (diffResult, json, compareJson): [string[], Status[]] => {
  const data = new jsonStringify(diffResult, json, compareJson);
  return [data.getTextResult(), data.getStatusResult()];
};

class jsonStringify {
  diffResult: any;
  json: any;
  compareJson: any;
  textResult: string[] = [];
  statusResult: Status[] = [];
  constructor(diffResult, json, compareJson) {
    this.diffResult = diffResult;
    this.json = json;
    this.compareJson = compareJson;
    this.stringify();
  }
  getTextResult() {
    return this.textResult;
  }
  getStatusResult() {
    return this.statusResult;
  }
  fillStatusList(textList: string[], status: Status) {
    return textList.map((_) => status);
  }
  appendData(textList: string[] | string, status: Status) {
    if (Array.isArray(textList)) {
      this.textResult.push(...textList);
      this.statusResult.push(...this.fillStatusList(textList, status));
    } else {
      this.textResult.push(textList);
      this.statusResult.push(status);
    }
  }
  pushData(result: [string[], Status[]]) {
    const [text, status] = result;
    this.textResult.push(...text);
    this.statusResult.push(...status);
  }
  wrapperData(isArray: boolean, status: Status) {
    if (isArray) {
      this.textResult.unshift('[');
      this.textResult.push(']');
    } else {
      this.textResult.unshift('{');
      this.textResult.push('}');
    }
    this.textResult.unshift(status);
    this.textResult.push(status);
  }
  parse = (key: string, value: any, status, level = 1, push = true, lastItem = false) => {
    const textList: string[] = [];
    const statusList: Status[] = [];
    const whiteSpace = stringLoop('\xa0\xa0\xa0\xa0', level);
    const addLine = (key: BasicType, value: BasicType, comma = true): string => {
      if (key === '') {
        return `${whiteSpace}${JSON.stringify(value)}${comma ? ',' : ''}`;
      } else {
        return `${whiteSpace}"${key}" : ${JSON.stringify(value)} ${comma ? ',' : ''}`;
      }
    };
    const wrapperData = (isArray: boolean, status: Status, key = '') => {
      if (key) {
        key = `${key} : `;
      }
      if (isArray) {
        textList.unshift(`${whiteSpace}${key}[`);
        textList.push(`${whiteSpace}],`);
      } else {
        textList.unshift(`${whiteSpace}${key}{`);
        textList.push(`${whiteSpace}},`);
      }
      statusList.unshift(status);
      statusList.push(status);
    };
    jsonValueCallBack(
      value,
      () => {
        this.appendData(addLine(key, value), status);
      },
      () => {
        jsonValueCallBack(
          status,
          () => {
            for (let valueKey in value) {
              this.parse(valueKey, value[valueKey], status, level + 1);
            }
            wrapperData(false, status, key);
          },
          () => {
            for (let valueKey in value) {
              this.parse(valueKey, value[valueKey], status[valueKey], level + 1);
            }
            wrapperData(false, Status.eq, key);
          },
          () => {},
        );
      },
      () => {
        jsonValueCallBack(
          status,
          () => {
            for (let index in value) {
              this.parse('', value[index], status, level + 1);
            }
            wrapperData(true, status, key);
          },
          () => {},
          () => {
            for (let index in value) {
              this.parse('', value[index], status[index], level + 1);
            }
            wrapperData(true, Status.eq, key);
          },
        );
      },
    );
    if (push) {
      this.pushData([textList, statusList]);
    }
    return [textList, statusList];
  };
  stringify(level = 1) {
    jsonValueCallBack(
      this.diffResult,
      () => {},
      () => {
        const array = serializeObject(diffResult);
        for (let [key, status, index] of array) {
          const lastItem = index === array.length - 1;
          jsonValueCallBack(
            status,
            () => {
              if (status === Status.lack) {
                this.parse(key, this.compareJson[key], status, level + 1);
                return;
              }
              if (status === Status.diff) {
                const [t, s] = this.parse(key, this.json[key], status, level + 1);
                const length =
                  this.parse(key, this.compareJson[key], status, level + 1, false)[0].length -
                  t.length;
                if (length > 0) {
                  this.appendData(new Array(length).fill(''), status);
                }
                return;
              }
              this.parse(key, this.json[key], status, level + 1);
            },
            () => {
              this.parse(key, this.json[key], status, level + 1);
            },
            () => {
              this.parse(key, this.json[key], status, level + 1);
            },
          );
        }
      },
      () => {
        this.arrayToJSON(this.diffResult, this.json, this.compareJson);
      },
    );
  }
  arrayToJSON(status: Status[], array: any[], compareArray: any[], level = 0, lastItem = false) {
    for (let [item, state] of this.serializeArrayFormat(status, array, compareArray)) {
      this.parse('', item, state, level + 1);
    }
    this.wrapperData(true, Status.diff);
  }
  // 序列化数组
  // diff结果：['+',"-","="], [1,3,4],[2,3,4]
  serializeArrayFormat(diffResult: Status[], array: any[], compareArray: any[]) {
    let result = [];
    array = copy(array);
    compareArray = copy(compareArray);
    for (let index in diffResult) {
      const status = diffResult[index];
      if (status === Status.lack) {
        result.push([compareArray[0], status]);
        compareArray.splice(0, 1);
      } else {
        const compareIndex = find(array[index], compareArray);
        if (compareIndex > -1) {
          compareArray.splice(compareIndex, 1);
        }
        result.push([array[index], status]);
      }
    }
    for (let item of compareArray) {
      result.push([item, Status.lack]);
    }
    return result;
  }
}
export default stringify;
