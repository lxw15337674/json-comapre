// import { BasicType, Options, Status } from '../interface';
// import jsonValueCallBack from '../jsonValueCallback';
// import { copy, find, serializeObject, stringLoop } from '../utils';

// const { diff, eq, lack, add } = Status;
// const stringify = (diffResult, json, compareJson, options: Options): [string[], Status[]] => {
//   const data = new jsonStringify(diffResult, json, compareJson, options);
//   return [data.getTextResult(), data.getStatusResult()];
// };

// const whiteSpace = (level) => {
//   return stringLoop('\xa0\xa0\xa0\xa0', level);
// };
// const listFill = (num: number, text: string) => {
//   const textList = [];
//   for (let i = 0; i < num; i++) {
//     textList.push(text);
//   }
//   return textList;
// };
// const conversion = (data: any, level = 0) => {
//   return JSON.stringify(data, null, 4)
//     .split('\n')
//     .map((text) => {
//       return `${whiteSpace(level)}${text}`;
//     });
// };
// const fillStatusList = (textList: string[], status: Status) => {
//   return textList.map((_) => status);
// };
// class jsonStringify {
//   diffResult: any;
//   json: any;
//   compareJson: any;
//   textResult: string[] = [];
//   statusResult: Status[] = [];
//   arrayOrderSensitive: Options['arrayOrderSensitive'] = false;
//   constructor(diffResult, json, compareJson, options) {
//     this.diffResult = diffResult;
//     this.json = json;
//     this.compareJson = compareJson;
//     this.arrayOrderSensitive = options.arrayOrderSensitive;
//     this.stringify(diffResult, json, compareJson, 1);
//   }
//   getTextResult() {
//     return this.textResult;
//   }
//   getStatusResult() {
//     return this.statusResult;
//   }

//   appendData(textList: string[], status: Status) {
//     this.textResult.push(...textList);
//     this.statusResult.push(...fillStatusList(textList, status));
//   }
//   pushData(result: [string[], Status[]]) {
//     const [text, status] = result;
//     this.textResult.push(...text);
//     this.statusResult.push(...status);
//   }
//   wrapperData(isArray: boolean, status: Status) {
//     if (isArray) {
//       this.textResult.unshift('[');
//       this.textResult.push(']');
//     } else {
//       this.textResult.unshift('{');
//       this.textResult.push('}');
//     }
//     this.statusResult.unshift(status);
//     this.statusResult.push(status);
//   }

//   stringify(diffResult, json, compareJson, level = 1) {
//     jsonValueCallBack(
//       diffResult,
//       (res: Status) => {
//         if (res === lack) {
//           const compareText = conversion(compareJson, level);
//           this.appendData(
//             compareText.map(() => whiteSpace(level)),
//             lack,
//           );
//           return;
//         }
//         if (res === diff) {
//           const text = conversion(compareJson, level);
//           const compareText = conversion(compareJson, level);
//           const lackLineLength = text.length - compareText.length;
//           if (lackLineLength > 0) {
//             text.push(...listFill(lackLineLength, whiteSpace(level)));
//           }
//           this.appendData(text, diff);
//           return;
//         }
//         this.appendData(conversion(json, level), this.diffResult);
//       },
//       () => {
//         this.textResult.push('[');
//         for (let index in diffResult) {
//           const diff = diffResult[index];
//           const item = json[index];
//           const compareItem = compareJson[index];
//           this.stringify(diff, item, compareItem, level++);
//         }
//         this.textResult.push(']');
//       },
//       () => {
//         this.textResult.push('{');
//         for (let key in diffResult) {
//           const diff = diffResult[key];
//           const item = json[key];
//           const compareItem = compareJson[key];
//           this.stringify(diff, item, compareItem, level++);
//         }
//         this.textResult.push('}');
//       },
//     );
//   }
// }
// export default stringify;
