import { BasicType, Options, Status } from '../interface';
import jsonValueCallBack from '../jsonValueCallback';
import { copy, find, serializeObject, stringLoop } from '../utils';

const stringify = (diffResult, json, compareJson, options: Options): [string[], Status[]] => {
  const data = new jsonStringify(diffResult, json, compareJson, options);
  return [data.getTextResult(), data.getStatusResult()];
};

const { diff, eq, lack, add } = Status;

const pushWhiteSpace = (level: number) => {
  return stringLoop('\xa0\xa0\xa0\xa0', level);
};

function listFill<T>(length: number, fillText: T): T[] {
  const textList = [];
  for (let i = 0; i < length; i++) {
    textList.push(fillText);
  }
  return textList;
}

// 从节点树获取数据，例如['key','2']=>value.key[2]
const getValue = (value: any, keyList: any[]) => {
  if (keyList.length === 0) {
    return value;
  }
  if (keyList.length === 1) {
    return value?.[keyList[0]];
  }
  return getValue(value?.[keyList[0]], keyList.slice(1));
};

const getKey = (keyList: any): string => {
  const key = keyList[keyList.length - 1];
  return /^\d+$/.test(key) ? '' : key;
};

class jsonStringify {
  diffResult: any;
  json: any;
  compareJson: any;
  textResult: string[] = [];
  statusResult: Status[] = [];
  options: Options = { arrayOrderSensitive: false };
  constructor(diffResult, json, compareJson, options) {
    this.diffResult = diffResult;
    this.json = json;
    this.compareJson = compareJson;
    this.options = options;
    this.stringify();
  }
  getTextResult() {
    return this.textResult;
  }
  getStatusResult() {
    return this.statusResult;
  }

  // appendData(textList: string[] | string, status: Status) {
  //   if (Array.isArray(textList)) {
  //     this.textResult.push(...textList);
  //     this.statusResult.push(...fillStatusList(textList, status));
  //   } else {
  //     this.textResult.push(textList);
  //     this.statusResult.push(status);
  //   }
  // }
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
    this.statusResult.unshift(status);
    this.statusResult.push(status);
  }
  parse = (
    keyList: any[], //定义为状态的节点树，例如['key',2]=>value.key[2]
    status: any,
    push = true,
    lastItem = false,
  ): [string[], Status[]] => {
    const textList: string[] = [];
    const statusList: Status[] = [];
    const level = keyList.length;
    const value = getValue(this.json, keyList);
    const compareValue = getValue(this.compareJson, keyList);
    const key = getKey(keyList);
    const whiteSpace = pushWhiteSpace(level);
    const addLine = (key: BasicType, value: BasicType, comma = true): string => {
      if (key === '' || key === undefined || key === null) {
        return `${whiteSpace}${JSON.stringify(value)}${comma ? ',' : ''}`;
      } else {
        return `${whiteSpace}"${key}" : ${JSON.stringify(value)} ${comma ? ',' : ''}`;
      }
    };
    const pushData = (
      result: [string[], Status[]],
      tempTextList = textList,
      tempStatusList = statusList,
    ) => {
      const [text, status] = result;
      tempTextList.push(...text);
      tempStatusList.push(...status);
    };
    const wrapperData = (
      isArray: boolean,
      status: Status,
      key = '',
      tempTextList = textList,
      tempStatusList = statusList,
    ) => {
      if (key) {
        key = `${key} : `;
      }
      if (isArray) {
        tempTextList.unshift(`${whiteSpace}${key}[`);
        tempTextList.push(`${whiteSpace}],`);
      } else {
        tempTextList.unshift(`${whiteSpace}${key}{`);
        tempTextList.push(`${whiteSpace}},`);
      }
      tempStatusList.unshift(status);
      tempStatusList.push(status);
    };
    jsonValueCallBack(
      status,
      (status: Status) => {
        if (status === lack) {
          // console.log('lack');
          const value = key ? { [key]: compareValue } : compareValue;
          let textList = new jsonStringify(add, value, undefined, this.options).getTextResult();
          if (key) {
            textList = textList.slice(1, -1);
          }
          pushData([textList, listFill(textList.length, lack)]);
          // console.log(textList, statusList);
          return;
        }
        let tempTextList = [];
        let tempStatusList = [];
        jsonValueCallBack(
          value,
          () => {
            tempTextList.push(addLine(key, value));
            tempStatusList.push(status);
          },
          () => {
            for (let valueKey in value) {
              const key = [...keyList, valueKey];
              pushData(this.parse(key, status, false), tempTextList, tempStatusList);
            }
            wrapperData(false, status, key, tempTextList, tempStatusList);
          },
          () => {
            for (let index in value) {
              const key = [...keyList, index];
              // console.log('array parse', key, ...this.parse(key, status, false));
              pushData(this.parse(key, status, false), tempTextList, tempStatusList);
            }
            wrapperData(true, status, key, tempTextList, tempStatusList);
          },
        );
        textList.push(...tempTextList);
        statusList.push(...tempStatusList);
        if (status === diff) {
          const value = key ? { [key]: compareValue } : compareValue;
          let compareValueLength = new jsonStringify(
            add,
            value,
            undefined,
            this.options,
          ).getTextResult().length;
          if (key) {
            compareValueLength = compareValueLength - 2;
          }
          const lackLength = compareValueLength - tempTextList.length; //要空出对应的行数
          if (lackLength > 0) {
            textList.push(...listFill(lackLength, ''));
            statusList.push(...listFill(lackLength, diff));
            // console.log(textList);
          }
        }
      },
      (status: object) => {
        for (let valueKey in status) {
          const key = [...keyList, valueKey];
          pushData(this.parse(key, status[valueKey], false));
        }
        wrapperData(false, eq, key);
      },
      (status: Status[]) => {
        for (let index in status) {
          const key = [...keyList, index];
          pushData(this.parse(key, status[index], false));
        }
        wrapperData(true, eq, key);
      },
    );
    if (push) {
      this.pushData([textList, statusList]);
    }
    return [textList, statusList];
  };

  stringify(level = 1) {
    if (this.json === null) {
      this.textResult = [];
      return;
    }
    jsonValueCallBack(
      this.diffResult,
      () => {
        this.parse([], this.diffResult);
      },
      () => {
        const array = serializeObject(this.diffResult);
        for (let [key, status, index] of array) {
          const lastItem = index === array.length - 1;
          this.parse([key], status);
        }
        this.wrapperData(Array.isArray(this.json), Status.eq);
      },
      () => {
        const array = serializeObject(this.diffResult);
        for (let [key, status, index] of array) {
          const lastItem = index === array.length - 1;
          this.parse([key], status);
        }
        this.wrapperData(Array.isArray(this.json), Status.eq);
      },
    );
  }
}
export default stringify;
